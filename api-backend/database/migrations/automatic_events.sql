-- ===================================================================
--  AUTO-EXPIRE PROMOTIONS
-- ===================================================================

-- Event to automatically expire promotions daily
DROP EVENT IF EXISTS evt_expire_promotions;

DELIMITER //

CREATE EVENT evt_expire_promotions
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Mark promotions as inactive if past valid_to date
    UPDATE promotions 
    SET is_active = FALSE,
        updated_at = CURRENT_TIMESTAMP
    WHERE valid_to < CURDATE() 
    AND is_active = TRUE;
    
    -- Mark customer promotions as expired
    UPDATE customer_promotions cp
    JOIN promotions p ON cp.promo_id = p.id
    SET cp.status = 'expired',
        cp.updated_at = CURRENT_TIMESTAMP
    WHERE p.valid_to < CURDATE() 
    AND cp.status = 'assigned';
END//

DELIMITER ;

-- ===================================================================
--  AUTO-CANCEL ABANDONED ORDERS
-- ===================================================================

-- Event to auto-cancel abandoned orders every 30 minutes
DROP EVENT IF EXISTS evt_cancel_abandoned_orders;

DELIMITER //

CREATE EVENT evt_cancel_abandoned_orders
ON SCHEDULE EVERY 30 MINUTE
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Declare variables for cursor
    DECLARE done INT DEFAULT FALSE;
    DECLARE order_id_var CHAR(36);
    DECLARE branch_id_var CHAR(36);
    
    -- Cursor for abandoned orders
    DECLARE order_cursor CURSOR FOR
        SELECT id, branch_id
        FROM orders 
        WHERE order_type = 'online' 
        AND order_status = 'pending'
        AND placed_at < DATE_SUB(NOW(), INTERVAL 120 MINUTE);
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN order_cursor;
    
    order_loop: LOOP
        FETCH order_cursor INTO order_id_var, branch_id_var;
        IF done THEN
            LEAVE order_loop;
        END IF;
        
        -- Cancel the order
        UPDATE orders 
        SET order_status = 'cancelled',
            cancelled_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id_var;
        
        -- Create inventory adjustment for cancelled items
        INSERT INTO inventory_adjustments (
            id, branch_id, product_id, adjustment_type, 
            quantity, reason, reference_order_id, created_at
        )
        SELECT 
            UUID(), branch_id_var, oi.product_id, 'cancelled_order_loss',
            oi.quantity, 'Order cancelled due to abandonment', order_id_var, CURRENT_TIMESTAMP
        FROM order_items oi
        WHERE oi.order_id = order_id_var;
        
        -- Restore inventory for cancelled items
        UPDATE branch_inventory bi
        JOIN order_items oi ON bi.product_id = oi.product_id AND bi.branch_id = branch_id_var
        SET bi.quantity_on_hand = bi.quantity_on_hand + oi.quantity,
            bi.updated_at = CURRENT_TIMESTAMP
        WHERE oi.order_id = order_id_var
        AND bi.deleted_at IS NULL;
    END LOOP;
    
    CLOSE order_cursor;
END//

DELIMITER ;


-- ===================================================================
--  AUTO-BAN FRAUDULENT CUSTOMERS
-- ===================================================================

-- Event to check for fraudulent customers daily
DROP EVENT IF EXISTS evt_detect_fraudulent_customers;

DELIMITER //

CREATE EVENT evt_detect_fraudulent_customers
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE customer_id_var CHAR(36);
    DECLARE customer_user_id CHAR(36);
    DECLARE cancellation_count INT;
    
    -- Cursor to check each customer with recent cancellations
    DECLARE customer_cursor CURSOR FOR
        SELECT o.customer_id, c.user_id, COUNT(*) as recent_cancellations
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.order_status = 'cancelled'
        AND o.cancelled_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND c.deleted_at IS NULL
        GROUP BY o.customer_id, c.user_id
        HAVING recent_cancellations >= 5; -- Reduced threshold for demonstration
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN customer_cursor;
    
    customer_loop: LOOP
        FETCH customer_cursor INTO customer_id_var, customer_user_id, cancellation_count;
        IF done THEN
            LEAVE customer_loop;
        END IF;
        
        -- Ban the customer if they have 5+ cancellations in a week
        UPDATE users 
        SET status = 'banned',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = customer_user_id
        AND status != 'banned';
        
        -- Log the ban using feedbacks table as audit trail
        INSERT INTO feedbacks (id, customer_id, branch_id, subject, message, status, created_at)
        VALUES (
            UUID(),
            customer_id_var,
            COALESCE(
                (SELECT branch_id FROM orders WHERE customer_id = customer_id_var ORDER BY placed_at DESC LIMIT 1),
                (SELECT id FROM branches WHERE status = 'open' LIMIT 1)
            ),
            'Account Banned - Excessive Cancellations',
            CONCAT('Customer banned for excessive order cancellations (', cancellation_count, ' cancellations in the last 7 days). Ban date: ', DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d %H:%i:%s')),
            'closed',
            CURRENT_TIMESTAMP
        );
    END LOOP;
    
    CLOSE customer_cursor;
END//

DELIMITER ;
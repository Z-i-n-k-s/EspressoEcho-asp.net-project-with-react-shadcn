

-- ===================================================================
-- PROMOTION VALIDATION TRIGGER FOR ORDER PLACEMENT
-- ===================================================================

DELIMITER //

CREATE TRIGGER tr_validate_promo_on_order
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE promo_id CHAR(36);
    DECLARE promo_active BOOLEAN;
    DECLARE promo_valid_from DATE;
    DECLARE promo_valid_to DATE;
    DECLARE promo_max_uses INT;
    DECLARE promo_current_uses INT;
    DECLARE promo_rule_type ENUM('order_count', 'customer_duration', 'order_amount');
    DECLARE promo_rule_criteria TEXT;
    DECLARE customer_order_count INT;
    DECLARE customer_duration_days INT;
    DECLARE customer_total_spent DECIMAL(10,2);
    
    -- Only validate if a promo code is being used
    IF NEW.promo_code_used IS NOT NULL THEN
        -- Get promotion details
        SELECT 
            p.id, p.is_active, p.valid_from, p.valid_to, 
            p.max_uses, p.current_uses, p.rule_type, p.rule_criteria
        INTO 
            promo_id, promo_active, promo_valid_from, promo_valid_to,
            promo_max_uses, promo_current_uses, promo_rule_type, promo_rule_criteria
        FROM promotions p
        WHERE p.code = NEW.promo_code_used;
        
        -- Check if promotion exists
        IF promo_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid promotion code';
        END IF;
        
        -- Check if promotion is active
        IF NOT promo_active THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Promotion is not active';
        END IF;
        
        -- Check if current date is within promotion validity period
        IF CURDATE() < promo_valid_from OR CURDATE() > promo_valid_to THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Promotion is not valid at this time';
        END IF;
        
        -- Check if promotion has reached its usage limit
        IF promo_max_uses IS NOT NULL AND promo_current_uses >= promo_max_uses THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Promotion has reached its usage limit';
        END IF;
        
        -- Check rule-based conditions if applicable
        IF promo_rule_type IS NOT NULL THEN
            CASE promo_rule_type
                WHEN 'order_count' THEN
                    -- Count customer's previous orders
                    SELECT COUNT(*) INTO customer_order_count
                    FROM orders
                    WHERE customer_id = NEW.customer_id
                    AND order_status != 'cancelled';
                    
                    -- Parse rule criteria (expected format: "min_count:X")
                    IF NOT customer_order_count >= CAST(SUBSTRING_INDEX(promo_rule_criteria, ':', -1) AS UNSIGNED) THEN
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Customer does not meet order count requirement for this promotion';
                    END IF;
                    
                WHEN 'customer_duration' THEN
                    -- Calculate how long the customer has been registered
                    SELECT DATEDIFF(CURDATE(), DATE(created_at)) INTO customer_duration_days
                    FROM customers
                    WHERE id = NEW.customer_id;
                    
                    -- Parse rule criteria (expected format: "min_days:X")
                    IF NOT customer_duration_days >= CAST(SUBSTRING_INDEX(promo_rule_criteria, ':', -1) AS UNSIGNED) THEN
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Customer does not meet duration requirement for this promotion';
                    END IF;
                    
                WHEN 'order_amount' THEN
                    -- Calculate customer's total spending
                    SELECT COALESCE(SUM(total_amount), 0) INTO customer_total_spent
                    FROM orders
                    WHERE customer_id = NEW.customer_id
                    AND order_status != 'cancelled';
                    
                    -- Parse rule criteria (expected format: "min_amount:X")
                    IF NOT customer_total_spent >= CAST(SUBSTRING_INDEX(promo_rule_criteria, ':', -1) AS DECIMAL(10,2)) THEN
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Customer does not meet spending requirement for this promotion';
                    END IF;
            END CASE;
        END IF;
        
        -- Check if customer has already used this promotion
        IF EXISTS (
            SELECT 1 FROM customer_promotions 
            WHERE customer_id = NEW.customer_id 
            AND promo_id = promo_id 
            AND status = 'used'
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Customer has already used this promotion';
        END IF;
    END IF;
END//

DELIMITER ;

-- ===================================================================
-- PROMOTION APPLICATION SUCCESS TRIGGER
-- ===================================================================

DELIMITER //

CREATE TRIGGER tr_promo_application_success
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE promo_id CHAR(36);
    DECLARE customer_user_id CHAR(36);
    
    -- Only process if a promo code was successfully used
    IF NEW.promo_code_used IS NOT NULL THEN
        -- Get the promotion ID
        SELECT id INTO promo_id
        FROM promotions 
        WHERE code = NEW.promo_code_used;
        
        -- Get the customer's user ID
        SELECT user_id INTO customer_user_id
        FROM customers
        WHERE id = NEW.customer_id;
        
        -- Record the promotion usage in customer_promotions table
        INSERT INTO customer_promotions (
            id, customer_id, promo_id, status, 
            assigned_by, assigned_at, used_at, order_id
        ) VALUES (
            UUID(), NEW.customer_id, promo_id, 'used',
            'auto_system', NOW(), NOW(), NEW.id
        );
        
        -- Increment the promotion usage count
        UPDATE promotions 
        SET current_uses = current_uses + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE code = NEW.promo_code_used;
    END IF;
END//

DELIMITER ;





-- ===================================================================
-- TOPPINGS DELETE TRIGGERS
-- ===================================================================

DELIMITER //

CREATE TRIGGER tr_topping_before_delete
BEFORE DELETE ON toppings
FOR EACH ROW
BEGIN
    DECLARE product_id_val CHAR(36);
    DECLARE topping_count INT;
    DECLARE new_default_topping_id CHAR(36);
    DECLARE done INT DEFAULT FALSE;
    
    -- Cursor to get all products that have this topping
    DECLARE product_cursor CURSOR FOR 
        SELECT DISTINCT product_id 
        FROM product_toppings 
        WHERE topping_id = OLD.id;
    
    -- Handler for when no more rows
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Remove all assignments of this topping
    DELETE FROM product_toppings WHERE topping_id = OLD.id;
    
    -- For products that had this topping as default, find a new default topping
    OPEN product_cursor;
    
    read_loop: LOOP
        FETCH product_cursor INTO product_id_val;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Check if the deleted topping was the default for this product
        IF EXISTS (
            SELECT 1 FROM product_toppings 
            WHERE product_id = product_id_val 
            AND topping_id = OLD.id 
            AND is_default = TRUE
        ) THEN
            -- Count available toppings for this product
            SELECT COUNT(*) INTO topping_count
            FROM product_toppings
            WHERE product_id = product_id_val;
            
            -- If there are other toppings, set one as default
            IF topping_count > 0 THEN
                -- Get the first available topping ID
                SELECT topping_id INTO new_default_topping_id
                FROM product_toppings
                WHERE product_id = product_id_val
                LIMIT 1;
                
                -- Set this topping as default
                UPDATE product_toppings
                SET is_default = TRUE
                WHERE product_id = product_id_val
                AND topping_id = new_default_topping_id;
            END IF;
        END IF;
    END LOOP;
    
    CLOSE product_cursor;
END//

DELIMITER ;


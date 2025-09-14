-- ===================================================================
-- CUSTOMER MANAGEMENT TRIGGERS
-- ===================================================================

DELIMITER //

-- Auto-create customer record when user gets customer role
CREATE TRIGGER tr_auto_create_customer
AFTER INSERT ON user_roles
FOR EACH ROW
BEGIN
    DECLARE role_name VARCHAR(20);
    
    SELECT name INTO role_name FROM roles WHERE id = NEW.role_id;
    
    IF role_name = 'customer' THEN
        INSERT INTO customers (id, user_id, created_at)
        VALUES (UUID(), NEW.user_id, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
    END IF;
END//

DELIMITER ;

-- ===================================================================
-- INVENTORY MANAGEMENT TRIGGERS
-- ===================================================================

DELIMITER $$

CREATE TRIGGER after_branch_inventory_update
AFTER UPDATE ON branch_inventory
FOR EACH ROW
BEGIN
    DECLARE adjustment_type ENUM(
        'manual_increase',
        'manual_decrease',
        'cancelled_order_loss',
        'damaged_goods',
        'expired_goods',
        'theft_loss',
        'transfer_out',
        'transfer_in',
        'transfer_rejected_restore',
        'transfer_rejected_no_impact'
    );
    
    -- Determine adjustment type based on quantity change
    IF NEW.quantity_on_hand > OLD.quantity_on_hand THEN
        SET adjustment_type = 'manual_increase';
    ELSE
        SET adjustment_type = 'manual_decrease';
    END IF;
    
    -- Insert into inventory_adjustments table
    INSERT INTO inventory_adjustments (
        id,
        branch_id,
        product_id,
        adjustment_type,
        quantity,
        last_updated_by,
        created_at
    ) VALUES (
        UUID(),
        NEW.branch_id,
        NEW.product_id,
        adjustment_type,
        ABS(NEW.quantity_on_hand - OLD.quantity_on_hand),
        NEW.last_updated_by,
        NOW()
    );
END$$

CREATE TRIGGER after_branch_inventory_insert
AFTER INSERT ON branch_inventory
FOR EACH ROW
BEGIN
    -- For new inserts, consider it as an increase
    INSERT INTO inventory_adjustments (
        id,
        branch_id,
        product_id,
        adjustment_type,
        quantity,
        last_updated_by,
        created_at
    ) VALUES (
        UUID(),
        NEW.branch_id,
        NEW.product_id,
        'manual_increase',
        NEW.quantity_on_hand,
        NEW.last_updated_by,
        NOW()
    );
END$$

DELIMITER ;

-- ===================================================================
-- BRANCH MANAGER VALIDATION TRIGGERS
-- ===================================================================

DELIMITER //

-- Add this to handle manager removal
CREATE TRIGGER tr_branch_manager_removal
BEFORE UPDATE ON branches
FOR EACH ROW
BEGIN
    -- When manager is being removed, ensure they're reassigned properly
    IF OLD.manager_id IS NOT NULL AND NEW.manager_id IS NULL THEN
        -- Update the employee's branch assignment to NULL
        UPDATE employees 
        SET branch_id = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = OLD.manager_id
        AND branch_id = OLD.id;
    END IF;
END//


-- Branch Manager Validation (Update)
CREATE TRIGGER tr_branch_manager_validation
BEFORE UPDATE ON branches
FOR EACH ROW
BEGIN
    DECLARE manager_exists INT DEFAULT 0;
    DECLARE manager_role VARCHAR(20);
    DECLARE existing_branch_id CHAR(36);
    
    -- Validate when manager_id is being set
    IF NEW.manager_id IS NOT NULL THEN
        -- Check if user exists with manager role and is assigned to this branch or unassigned
        SELECT COUNT(*), e.role 
        INTO manager_exists, manager_role
        FROM employees e 
        WHERE e.user_id = NEW.manager_id 
        AND e.role = 'manager' 
        AND (e.branch_id = NEW.id OR e.branch_id IS NULL)
        AND e.deleted_at IS NULL
        LIMIT 1;
        
        IF manager_exists = 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Manager must exist in employees table with manager role and be assigned to this branch or unassigned';
        END IF;
        
        -- Check if manager is already assigned to another branch
        SELECT b.id INTO existing_branch_id
        FROM branches b 
        WHERE b.manager_id = NEW.manager_id AND b.id != NEW.id AND b.deleted_at IS NULL
        LIMIT 1;
        
        IF existing_branch_id IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'This manager is already assigned to another branch';
        END IF;
    END IF;
END//

-- Branch Manager Validation (Insert)
CREATE TRIGGER tr_branch_manager_validation_insert
BEFORE INSERT ON branches
FOR EACH ROW
BEGIN
    DECLARE manager_exists INT DEFAULT 0;
    DECLARE manager_role VARCHAR(20);
    DECLARE existing_branch_id CHAR(36);
    
    -- Validate when manager_id is being set
    IF NEW.manager_id IS NOT NULL THEN
        -- Check if user exists with manager role and is unassigned
        SELECT COUNT(*), e.role 
        INTO manager_exists, manager_role
        FROM employees e 
        WHERE e.user_id = NEW.manager_id 
        AND e.role = 'manager' 
        AND e.branch_id IS NULL
        AND e.deleted_at IS NULL
        LIMIT 1;
        
        IF manager_exists = 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Manager must exist in employees table with manager role and be unassigned to any branch';
        END IF;
        
        -- Check if manager is already assigned to another branch
        SELECT b.id INTO existing_branch_id
        FROM branches b 
        WHERE b.manager_id = NEW.manager_id AND b.deleted_at IS NULL
        LIMIT 1;
        
        IF existing_branch_id IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'This manager is already assigned to another branch';
        END IF;
    END IF;
END//

DELIMITER ;


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
-- CATEGORY SOFT DELETE TRIGGERS
-- ===================================================================

DELIMITER //

-- Trigger 1: Prevent category deletion if any products have active orders
CREATE TRIGGER tr_prevent_category_deletion_with_active_products
BEFORE UPDATE ON categories
FOR EACH ROW
BEGIN
    DECLARE active_products_count INT;
    
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Check if any products in this category have active orders
        SELECT COUNT(DISTINCT p.id) INTO active_products_count
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        WHERE p.category_id = OLD.id
        AND p.deleted_at IS NULL
        AND o.order_status IN ('pending', 'confirmed', 'preparing', 'ready_for_delivery', 'on_the_way');
        
        IF active_products_count > 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot delete category: Some products have active orders';
        END IF;
    END IF;
END//

-- Trigger 2: When a category is soft deleted, soft delete its products and related data
CREATE TRIGGER tr_category_soft_delete_products
AFTER UPDATE ON categories
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Soft delete all products in this category
        UPDATE products 
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP,
            is_active = FALSE
        WHERE category_id = NEW.id
        AND deleted_at IS NULL;
        
        -- Remove category assignments from branches
        UPDATE branch_categories 
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE category_id = NEW.id
        AND deleted_at IS NULL;
    END IF;
END//

-- ===================================================================
-- PRODUCT SOFT DELETE TRIGGERS (FIXED)
-- ===================================================================

DELIMITER //

-- Trigger 1: Prevent product deletion if it has active orders
CREATE TRIGGER tr_prevent_product_deletion_with_active_orders
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    DECLARE active_orders_count INT;
    
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Check if product has active orders
        SELECT COUNT(DISTINCT o.id) INTO active_orders_count
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE oi.product_id = OLD.id
        AND o.order_status IN ('pending', 'confirmed', 'preparing', 'ready_for_delivery', 'on_the_way');
        
        IF active_orders_count > 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot delete product: It has active orders';
        END IF;
    END IF;
END//

-- Trigger 2: Set is_active to FALSE when soft deleting (BEFORE UPDATE)
CREATE TRIGGER tr_product_before_soft_delete
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    -- Set is_active to FALSE when soft deleting
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        SET NEW.is_active = FALSE;
    END IF;
END//

-- Trigger 3: Handle product soft delete relations (AFTER UPDATE - FIXED)
CREATE TRIGGER tr_product_soft_delete_relations
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Remove product-topping associations (soft delete)
        UPDATE product_toppings 
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.id
        AND deleted_at IS NULL;
        
        -- Remove branch inventory records (soft delete)
        UPDATE branch_inventory 
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.id
        AND deleted_at IS NULL;
        
        -- Update inventory adjustments (soft delete) - NO CIRCULAR REFERENCE
        UPDATE inventory_adjustments 
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.id
        AND deleted_at IS NULL;
        
        -- Hide product reviews (set is_visible to FALSE)
        UPDATE product_reviews 
        SET is_visible = FALSE,
            removed_at = CURRENT_TIMESTAMP,
            removed_by = 'SYSTEM'
        WHERE product_id = NEW.id
        AND is_visible = TRUE;
        
        -- Remove from branch categories if this is the only product in the category
        -- This prevents circular reference by not touching the products table
        UPDATE branch_categories bc
        INNER JOIN (
            SELECT category_id, COUNT(*) as product_count
            FROM products 
            WHERE deleted_at IS NULL 
            AND is_active = TRUE
            GROUP BY category_id
        ) pc ON bc.category_id = pc.category_id
        SET bc.deleted_at = CURRENT_TIMESTAMP
        WHERE bc.category_id IN (
            SELECT category_id FROM products WHERE id = NEW.id
        )
        AND pc.product_count = 0
        AND bc.deleted_at IS NULL;
    END IF;
END//

DELIMITER ;

-- ===================================================================
-- ADDITIONAL SAFETY TRIGGERS TO PREVENT CIRCULAR REFERENCES
-- ===================================================================

DELIMITER //

-- Prevent updating products table from within product triggers
CREATE TRIGGER tr_prevent_circular_product_updates
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    -- Check if this update is coming from a trigger context
    -- This is a simplified check - in practice, you'd need more sophisticated logic
    IF @disable_product_triggers THEN
        SET @disable_product_triggers = NULL;
    ELSE
        -- Allow the update to proceed
        SET NEW.updated_at = CURRENT_TIMESTAMP;
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


-- ===================================================================
-- EMPLOYEE SOFT DELETE TRIGGERS
-- ===================================================================

DELIMITER //

CREATE TRIGGER tr_employee_soft_delete
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Update user status to banned
        UPDATE users 
        SET status = 'banned', 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = NEW.user_id;
        
        -- Remove employee roles from user_roles
        DELETE ur FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = NEW.user_id 
        AND r.name IN ('manager', 'cashier', 'staff');
        
        -- If employee was a branch manager, remove them from that position
        UPDATE branches 
        SET manager_id = NULL, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE manager_id = NEW.user_id;
    END IF;
END//

DELIMITER ;

-- ===================================================================
-- CUSTOMER SOFT DELETE/BAN TRIGGERS
-- ===================================================================

DELIMITER //

CREATE TRIGGER tr_customer_soft_delete
BEFORE UPDATE ON customers
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Update user status to banned
        UPDATE users 
        SET status = 'banned', 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = NEW.user_id;
        
        -- Revoke any assigned promotions
        UPDATE customer_promotions 
        SET status = 'expired', 
            used_at = CURRENT_TIMESTAMP 
        WHERE customer_id = NEW.id 
        AND status = 'assigned';
        
        -- Anonymize product reviews
        UPDATE product_reviews 
        SET is_visible = FALSE, 
            removed_by = 'SYSTEM', 
            removed_at = CURRENT_TIMESTAMP 
        WHERE customer_id = NEW.id;
        
        -- Close any open feedback
        UPDATE feedbacks 
        SET status = 'closed', 
            updated_at = CURRENT_TIMESTAMP 
        WHERE customer_id = NEW.id 
        AND status IN ('open', 'in_progress');
    END IF;
END//

DELIMITER ;


-- ===================================================================
-- BRANCH SOFT DELETE - EMPLOYEE CASCADE TRIGGER
-- ===================================================================

DELIMITER //

CREATE TRIGGER tr_branch_soft_delete_employees
BEFORE UPDATE ON branches
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Soft delete all employees associated with this branch
        UPDATE employees 
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE branch_id = NEW.id
        AND deleted_at IS NULL;
        
        -- Deactivate all announcements for this branch
        UPDATE branch_announcements 
        SET is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE branch_id = NEW.id;
        
        -- Remove branch-category associations
        UPDATE branch_categories 
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE branch_id = NEW.id
        AND deleted_at IS NULL;
        
        -- Soft delete branch inventory records
        UPDATE branch_inventory 
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE branch_id = NEW.id
        AND deleted_at IS NULL;
    END IF;
END//

DELIMITER ;
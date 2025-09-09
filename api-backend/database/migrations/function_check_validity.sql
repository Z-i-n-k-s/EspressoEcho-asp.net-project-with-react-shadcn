
-- ===================================================================
--  VALIDATION FUNCTION FOR PROMO CODE APPLICATION
-- ===================================================================

DELIMITER //

-- Function to check if promo code is valid
CREATE FUNCTION fn_is_promo_valid(promo_code VARCHAR(50))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE is_valid BOOLEAN DEFAULT FALSE;
    DECLARE promo_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO promo_count
    FROM promotions 
    WHERE code = promo_code
    AND is_active = TRUE
    AND valid_from <= CURDATE()
    AND valid_to >= CURDATE()
    AND (max_uses IS NULL OR current_uses < max_uses);
    
    IF promo_count > 0 THEN
        SET is_valid = TRUE;
    END IF;
    
    RETURN is_valid;
END//

DELIMITER ;
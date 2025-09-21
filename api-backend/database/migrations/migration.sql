-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS feedback_replies;
DROP TABLE IF EXISTS feedbacks;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS delivery_assignments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS offline_order_items;
DROP TABLE IF EXISTS offline_orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customer_promotions;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS inventory_adjustments;
DROP TABLE IF EXISTS inventory_transfer_items;
DROP TABLE IF EXISTS inventory_transfers;
DROP TABLE IF EXISTS branch_inventory;
DROP TABLE IF EXISTS branch_categories;
DROP TABLE IF EXISTS product_toppings;
DROP TABLE IF EXISTS toppings;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS branch_announcements;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- Create tables with consistent column names

-- Users and Authentication
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    status ENUM('active', 'banned') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE roles (
    id CHAR(36) PRIMARY KEY,
    name ENUM('admin', 'manager', 'cashier', 'staff', 'customer') UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_roles (
    user_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Branch Management
CREATE TABLE branches (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(20),
    manager_id CHAR(36) NULL,
    status ENUM('open', 'closed', 'temporarily_closed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_branches_status (status)
) ENGINE=InnoDB;

CREATE TABLE employees (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    branch_id CHAR(36) NULL,
    role ENUM('manager', 'cashier', 'staff') NOT NULL,
    hire_date DATE NOT NULL,
    created_by CHAR(36) NULL,  -- Changed to NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employees_branch (branch_id),
    INDEX idx_employees_user (user_id)
) ENGINE=InnoDB;


CREATE TABLE branch_announcements (
    id CHAR(36) PRIMARY KEY,
    branch_id CHAR(36) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'offer', 'closure') NOT NULL,
    created_by CHAR(36) NULL,  -- Changed to NULL
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- Product and Category Management
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category_id CHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by CHAR(36)  NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE  SET NULL,
    INDEX idx_products_category (category_id),
    INDEX idx_products_active (is_active)
) ENGINE=InnoDB;

-- Toppings Master Table
CREATE TABLE toppings (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by CHAR(36)  NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE  SET NULL
) ENGINE=InnoDB;

-- Mapping Table for Product-Toppings (Many-to-Many)
CREATE TABLE product_toppings (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    topping_id CHAR(36) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_by CHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_product_topping (product_id, topping_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE  SET NULL
) ENGINE=InnoDB;

-- Branch-Category Assignment
CREATE TABLE branch_categories (
    id CHAR(36) PRIMARY KEY,
    branch_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,
    assigned_by CHAR(36) NULL,  -- Changed to NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_branch_category (branch_id, category_id),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- Inventory Management
CREATE TABLE branch_inventory (
    branch_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 0,
    last_updated_by CHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (branch_id, product_id),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (last_updated_by) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE inventory_transfers (
    id CHAR(36) PRIMARY KEY,
    from_branch_id CHAR(36)  NULL,
    to_branch_id CHAR(36)  NULL,
    requested_by CHAR(36)  NULL,
    approved_by CHAR(36) NULL,
    received_by CHAR(36) NULL,
    status ENUM('pending', 'approved', 'completed', 'rejected') NOT NULL DEFAULT 'pending',
    reason TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    rejection_reason TEXT,
    inventory_deducted BOOLEAN DEFAULT FALSE,
    inventory_added BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (from_branch_id) REFERENCES branches(id) ON DELETE  SET NULL,
    FOREIGN KEY (to_branch_id) REFERENCES branches(id) ON DELETE  SET NULL,
    FOREIGN KEY (requested_by) REFERENCES employees(id) ON DELETE  SET NULL,
    FOREIGN KEY (approved_by) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (received_by) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE inventory_transfer_items (
    id CHAR(36) PRIMARY KEY,
    transfer_id CHAR(36) NOT NULL,
    product_id CHAR(36)  NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (transfer_id) REFERENCES inventory_transfers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE  SET NULL
) ENGINE=InnoDB;

-- Customer Management
CREATE TABLE customers (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    phone VARCHAR(20),
    default_delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Promotions and Discounts
CREATE TABLE promotions (
    id CHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    rule_type ENUM('order_count', 'customer_duration', 'order_amount'),
    rule_criteria TEXT,
    created_by CHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE  SET NULL,
    INDEX idx_promotions_validity (valid_from, valid_to, is_active),
    INDEX idx_promotions_code_active (code, is_active)
) ENGINE=InnoDB;

-- Order Management
CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY,
    customer_id CHAR(36) NOT NULL,
    branch_id CHAR(36) NOT NULL,
    order_type ENUM('online') NOT NULL DEFAULT 'online',
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready_for_delivery', 'on_the_way', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    default_address BOOLEAN DEFAULT FALSE,
    delivery_address TEXT,
    special_instructions TEXT,
    promo_code_used VARCHAR(50),
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    prepared_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    handled_by CHAR(36),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (promo_code_used) REFERENCES promotions(code) ON DELETE SET NULL,
    FOREIGN KEY (handled_by) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_orders_customer (customer_id),
    INDEX idx_orders_branch (branch_id),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_placed_at (placed_at),
    INDEX idx_orders_status_placed_at (order_status, placed_at),
    INDEX idx_orders_cancelled_at (cancelled_at),
    INDEX idx_orders_customer_status_cancelled (customer_id, order_status, cancelled_at)
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    inventory_deducted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE  SET NULL
) ENGINE=InnoDB;

-- Offline POS Orders
CREATE TABLE offline_orders (
    id CHAR(36) PRIMARY KEY,
    branch_id CHAR(36) NOT NULL,
    cashier_id CHAR(36) NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (cashier_id) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE offline_order_items (
    id CHAR(36) PRIMARY KEY,
    offline_order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    inventory_deducted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (offline_order_id) REFERENCES offline_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE  SET NULL
) ENGINE=InnoDB;

-- 1️⃣ Remove branch_id from orders
ALTER TABLE orders
    DROP FOREIGN KEY orders_ibfk_2,  -- check with SHOW CREATE TABLE orders for actual FK name
    DROP INDEX idx_orders_branch,
    DROP COLUMN branch_id;

-- 2️⃣ Add topping_id to order_items
ALTER TABLE order_items
    ADD COLUMN topping_id CHAR(36) NULL AFTER product_id,
    ADD CONSTRAINT fk_order_items_topping FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE SET NULL;




CREATE TABLE customer_promotions (
    id CHAR(36) PRIMARY KEY,
    customer_id CHAR(36) NOT NULL,
    promo_id CHAR(36) NOT NULL,
    status ENUM('assigned', 'used', 'expired') NOT NULL DEFAULT 'assigned',
    assigned_by ENUM('admin', 'auto_system') NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    order_id CHAR(36),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (promo_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_customer_promotions_status (status)
) ENGINE=InnoDB;

-- Payment Management
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    order_type ENUM('online', 'offline') NOT NULL,
    payment_method ENUM('cash', 'card', 'bkash', 'nagad', 'cash_on_delivery') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(255),
    collected_by CHAR(36),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (collected_by) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_status (status)
) ENGINE=InnoDB;

-- Delivery Management
CREATE TABLE delivery_assignments (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    staff_id CHAR(36)  NULL,
    assigned_by CHAR(36) NULL,
    status ENUM('assigned', 'in_progress', 'delivered', 'failed') NOT NULL DEFAULT 'assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    delivery_notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES employees(id) ON DELETE  SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES employees(id) ON DELETE  SET NULL,
    INDEX idx_delivery_status (status)
) ENGINE=InnoDB;

-- Customer Feedback and Reviews
CREATE TABLE feedbacks (
    id CHAR(36) PRIMARY KEY,
    customer_id CHAR(36) NOT NULL,
    branch_id CHAR(36) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_feedbacks_customer (customer_id),
    INDEX idx_feedbacks_branch (branch_id),
    INDEX idx_feedbacks_subject_created (subject, created_at),
    INDEX idx_feedbacks_customer_subject (customer_id, subject)
) ENGINE=InnoDB;

CREATE TABLE feedback_replies (
    id CHAR(36) PRIMARY KEY,
    feedback_id CHAR(36) NOT NULL,
    responder_id CHAR(36) NULL,
    responder_role ENUM('admin', 'manager') NOT NULL,
    message TEXT NOT NULL,
    replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE,
    FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE  SET NULL
) ENGINE=InnoDB;

CREATE TABLE product_reviews (
    id CHAR(36) PRIMARY KEY,
    customer_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    order_id CHAR(36) NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    removed_by CHAR(36),
    removed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (removed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product_reviews_product (product_id),
    INDEX idx_product_reviews_visible (is_visible)
) ENGINE=InnoDB;

-- Inventory adjustments table for tracking manual adjustments, transfers, and losses
CREATE TABLE inventory_adjustments (
    id CHAR(36) PRIMARY KEY,
    branch_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    adjustment_type ENUM(
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
    ) NOT NULL,
    quantity INTEGER NOT NULL,
    reason TEXT,
    last_updated_by CHAR(36) NULL,
    reference_order_type ENUM('online','offline') NULL,
    reference_order_id CHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (last_updated_by) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_inventory_adjustments_branch_product (branch_id, product_id),
    INDEX idx_inventory_adjustments_created_at (created_at)
) ENGINE=InnoDB;

-- Enable Event Scheduler
SET GLOBAL event_scheduler = ON;
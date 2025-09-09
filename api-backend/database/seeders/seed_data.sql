-- ===============================================
-- Roles
-- ===============================================
INSERT INTO roles (id, name, created_at, updated_at)
VALUES
('11111111-1111-1111-1111-111111111111', 'admin', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'manager', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'cashier', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'staff', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'customer', NOW(), NOW());

-- ===============================================
-- Users
-- ===============================================
INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@example.com', '$2y$10$examplehash', 'Admin User', 'active', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'manager1@example.com', '$2y$10$examplehash', 'Manager One', 'active', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'cashier1@example.com', '$2y$10$examplehash', 'Cashier One', 'active', NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'customer1@example.com', '$2y$10$examplehash', 'Customer One', 'active', NOW(), NOW());

-- ===============================================
-- User Roles
-- ===============================================
INSERT INTO user_roles (user_id, role_id)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555');

-- ===============================================
-- Branches
-- ===============================================
INSERT INTO branches (id, name, address, contact_phone, manager_id, status, created_at, updated_at)
VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Main Branch', '123 Main Street', '0123456789', NULL, 'open', NOW(), NOW());

-- ===============================================
-- Employees
-- ===============================================
INSERT INTO employees (id, user_id, branch_id, role, hire_date, created_by, created_at, updated_at)
VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'manager', '2025-01-01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
('11112222-3333-4444-5555-666677778888', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cashier', '2025-03-01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW());

-- ===============================================
-- Customers
-- ===============================================
INSERT INTO customers (id, user_id, phone, default_delivery_address, created_at, updated_at)
VALUES
('99999999-9999-9999-9999-999999999999', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '01712345678', '456 Customer Road', NOW(), NOW());

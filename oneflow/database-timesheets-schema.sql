-- ================================================================
-- TIMESHEETS DATABASE SCHEMA
-- ================================================================
-- Tracks employee work time, billing status, and costs
-- ================================================================

USE oneflow;

-- ================================================================
-- 1. ADD HOURLY_RATE TO USERS TABLE
-- ================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 50.00
COMMENT 'Employee hourly rate for timesheet calculations';

-- Update existing users with default hourly rates based on role
UPDATE users SET hourly_rate = CASE
    WHEN role = 'SUPERADMIN' THEN 100.00
    WHEN role = 'PROJECT_MANAGER' THEN 80.00
    WHEN role = 'SALES_FINANCE' THEN 70.00
    WHEN role = 'TEAM_MEMBER' THEN 50.00
    ELSE 50.00
END
WHERE hourly_rate IS NULL;

-- ================================================================
-- 2. CREATE TIMESHEETS TABLE
-- ================================================================

DROP TABLE IF EXISTS timesheets;

CREATE TABLE timesheets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Employee Information
    employee_username VARCHAR(255) NOT NULL COMMENT 'Employee username',
    employee_name VARCHAR(255) NOT NULL COMMENT 'Employee full name',

    -- Task/Project Linkage
    task_id BIGINT COMMENT 'Reference to tasks.id',
    task_title VARCHAR(255) COMMENT 'Task name for display',
    project_id BIGINT COMMENT 'Reference to projects.id',
    project_name VARCHAR(255) COMMENT 'Project name for display',

    -- Time Tracking
    work_date DATE NOT NULL COMMENT 'Date of work',
    hours_worked DECIMAL(10,2) NOT NULL COMMENT 'Number of hours worked',
    session_start DATETIME COMMENT 'Work session start time',
    session_end DATETIME COMMENT 'Work session end time',

    -- Financial
    hourly_rate DECIMAL(10,2) NOT NULL COMMENT 'Hourly rate in currency',
    total_cost DECIMAL(10,2) NOT NULL COMMENT 'Total cost (hours * rate)',

    -- Billing
    billing_status VARCHAR(20) NOT NULL DEFAULT 'NON_BILLED'
        COMMENT 'BILLED, NON_BILLED, PENDING, APPROVED',

    -- Additional Info
    description TEXT COMMENT 'Work description/notes',

    -- Approval Tracking
    approved_by VARCHAR(255) COMMENT 'Username of approver',
    approved_at DATETIME COMMENT 'Approval timestamp',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_employee (employee_username),
    INDEX idx_task_id (task_id),
    INDEX idx_project_id (project_id),
    INDEX idx_date (work_date),
    INDEX idx_status (billing_status),
    INDEX idx_created (created_at),

    -- Foreign Keys
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE,

    -- Constraints
    CHECK (hours_worked > 0 AND hours_worked <= 24),
    CHECK (hourly_rate > 0),
    CHECK (total_cost >= 0)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Employee timesheet tracking with billing status';

-- ================================================================
-- 3. INSERT SAMPLE TIMESHEET DATA
-- ================================================================

-- Sample timesheets for testing
INSERT INTO timesheets (
    employee_username, employee_name, task_id, task_title, project_id, project_name,
    work_date, hours_worked, hourly_rate, total_cost, billing_status, description
) VALUES
-- Week 1 - Website Redesign Project
('super', 'Super Admin', 1, 'Design homepage mockup', 1, 'Website Redesign',
    '2025-11-01', 8.00, 100.00, 800.00, 'BILLED', 'Created initial homepage mockups and wireframes'),
('super', 'Super Admin', 1, 'Design homepage mockup', 1, 'Website Redesign',
    '2025-11-02', 6.00, 100.00, 600.00, 'BILLED', 'Refined design based on feedback'),
('jane_dev', 'Jane Developer', 2, 'Implement user authentication', 1, 'Website Redesign',
    '2025-11-03', 8.00, 50.00, 400.00, 'BILLED', 'Set up JWT authentication system'),
('jane_dev', 'Jane Developer', 2, 'Implement user authentication', 1, 'Website Redesign',
    '2025-11-04', 7.00, 50.00, 350.00, 'BILLED', 'Testing and bug fixes for auth'),

-- Week 2 - Mobile App Development
('jane_dev', 'Jane Developer', 3, 'API integration', 2, 'Mobile App Development',
    '2025-11-05', 8.00, 50.00, 400.00, 'PENDING', 'Started API integration work'),
('john_manager', 'John Manager', 4, 'Database schema design', 3, 'Database Migration',
    '2025-11-06', 6.00, 80.00, 480.00, 'APPROVED', 'Designed database schema and relationships'),
('bob_sales', 'Bob Sales', 5, 'Social media content', 4, 'Marketing Campaign Q1',
    '2025-11-07', 8.00, 70.00, 560.00, 'BILLED', 'Created social media content calendar'),

-- Week 3 - Internal work (NON_BILLED)
('super', 'Super Admin', NULL, 'Code review', NULL, 'Internal',
    '2025-11-08', 4.00, 100.00, 400.00, 'NON_BILLED', 'Code review for team members'),
('jane_dev', 'Jane Developer', NULL, 'Training', NULL, 'Internal',
    '2025-11-09', 3.00, 50.00, 150.00, 'NON_BILLED', 'Attended React training session');

-- ================================================================
-- 4. USEFUL TIMESHEET QUERIES
-- ================================================================

-- View all timesheets with details
SELECT
    ts.id,
    ts.employee_name,
    ts.work_date,
    ts.hours_worked,
    CONCAT('$', FORMAT(ts.hourly_rate, 2)) as rate,
    CONCAT('$', FORMAT(ts.total_cost, 2)) as cost,
    ts.billing_status,
    ts.project_name,
    ts.task_title
FROM timesheets ts
ORDER BY ts.work_date DESC;

-- Get timesheets by employee
SELECT
    work_date,
    hours_worked,
    total_cost,
    billing_status,
    project_name,
    task_title
FROM timesheets
WHERE employee_username = 'super'
ORDER BY work_date DESC;

-- Get total hours and cost by employee
SELECT
    employee_name,
    COUNT(*) as entries,
    SUM(hours_worked) as total_hours,
    CONCAT('$', FORMAT(SUM(total_cost), 2)) as total_cost
FROM timesheets
GROUP BY employee_username, employee_name
ORDER BY total_cost DESC;

-- Get billed vs non-billed totals
SELECT
    billing_status,
    COUNT(*) as count,
    SUM(hours_worked) as total_hours,
    CONCAT('$', FORMAT(SUM(total_cost), 2)) as total_cost
FROM timesheets
GROUP BY billing_status;

-- Get project costs from timesheets
SELECT
    p.name as project,
    COUNT(ts.id) as timesheet_entries,
    SUM(ts.hours_worked) as total_hours,
    CONCAT('$', FORMAT(SUM(ts.total_cost), 2)) as total_cost
FROM projects p
LEFT JOIN timesheets ts ON p.id = ts.project_id
GROUP BY p.id, p.name
ORDER BY SUM(ts.total_cost) DESC;

-- Get this week's timesheets
SELECT
    employee_name,
    work_date,
    hours_worked,
    project_name,
    billing_status,
    CONCAT('$', FORMAT(total_cost, 2)) as cost
FROM timesheets
WHERE work_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY work_date DESC, employee_name;

-- Get pending approval timesheets
SELECT
    ts.id,
    ts.employee_name,
    ts.work_date,
    ts.hours_worked,
    ts.project_name,
    ts.task_title,
    CONCAT('$', FORMAT(ts.total_cost, 2)) as cost
FROM timesheets ts
WHERE ts.billing_status = 'PENDING'
ORDER BY ts.work_date;

-- Get employee utilization (billable vs non-billable)
SELECT
    employee_name,
    SUM(CASE WHEN billing_status = 'BILLED' THEN hours_worked ELSE 0 END) as billable_hours,
    SUM(CASE WHEN billing_status = 'NON_BILLED' THEN hours_worked ELSE 0 END) as non_billable_hours,
    SUM(hours_worked) as total_hours,
    ROUND(SUM(CASE WHEN billing_status = 'BILLED' THEN hours_worked ELSE 0 END) * 100.0 / SUM(hours_worked), 2) as billable_percentage
FROM timesheets
GROUP BY employee_username, employee_name
ORDER BY billable_percentage DESC;

-- Get daily timesheet report
SELECT
    work_date,
    COUNT(DISTINCT employee_username) as employees_worked,
    SUM(hours_worked) as total_hours,
    CONCAT('$', FORMAT(SUM(total_cost), 2)) as total_cost
FROM timesheets
GROUP BY work_date
ORDER BY work_date DESC;

-- Get task time tracking
SELECT
    t.title as task,
    p.name as project,
    COUNT(ts.id) as timesheet_entries,
    SUM(ts.hours_worked) as hours_spent,
    CONCAT('$', FORMAT(SUM(ts.total_cost), 2)) as cost
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN timesheets ts ON t.id = ts.task_id
GROUP BY t.id, t.title, p.name
HAVING COUNT(ts.id) > 0
ORDER BY SUM(ts.total_cost) DESC;

-- ================================================================
-- 5. MAINTENANCE PROCEDURES
-- ================================================================

-- Update hourly rates for all users
UPDATE users
SET hourly_rate = CASE
    WHEN role = 'SUPERADMIN' THEN 120.00
    WHEN role = 'PROJECT_MANAGER' THEN 90.00
    WHEN role = 'SALES_FINANCE' THEN 75.00
    WHEN role = 'TEAM_MEMBER' THEN 55.00
END;

-- Recalculate total costs for all timesheets
UPDATE timesheets
SET total_cost = hours_worked * hourly_rate;

-- Archive old timesheets (optional - move to archive table)
-- CREATE TABLE timesheets_archive LIKE timesheets;
-- INSERT INTO timesheets_archive SELECT * FROM timesheets WHERE work_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
-- DELETE FROM timesheets WHERE work_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- ================================================================
-- 6. VIEWS FOR REPORTING
-- ================================================================

-- Create view for timesheet summary
CREATE OR REPLACE VIEW timesheet_summary AS
SELECT
    ts.id,
    ts.employee_username,
    ts.employee_name,
    ts.work_date,
    ts.hours_worked,
    ts.hourly_rate,
    ts.total_cost,
    ts.billing_status,
    p.name as project,
    t.title as task,
    ts.description,
    ts.approved_by,
    ts.approved_at
FROM timesheets ts
LEFT JOIN projects p ON ts.project_id = p.id
LEFT JOIN tasks t ON ts.task_id = t.id;

-- Create view for employee timesheet stats
CREATE OR REPLACE VIEW employee_timesheet_stats AS
SELECT
    employee_username,
    employee_name,
    COUNT(*) as total_entries,
    SUM(hours_worked) as total_hours,
    SUM(total_cost) as total_cost,
    SUM(CASE WHEN billing_status = 'BILLED' THEN total_cost ELSE 0 END) as billed_amount,
    SUM(CASE WHEN billing_status = 'NON_BILLED' THEN total_cost ELSE 0 END) as non_billed_amount,
    AVG(hours_worked) as avg_hours_per_entry
FROM timesheets
GROUP BY employee_username, employee_name;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Check table structure
DESCRIBE timesheets;

-- Check sample data
SELECT COUNT(*) as timesheet_count FROM timesheets;

-- Check users have hourly rates
SELECT username, role, hourly_rate FROM users;

-- Check timesheet totals
SELECT
    COUNT(*) as total_entries,
    SUM(hours_worked) as total_hours,
    CONCAT('$', FORMAT(SUM(total_cost), 2)) as total_cost
FROM timesheets;

-- Success message
SELECT
    'Timesheets table created successfully!' as Status,
    'Sample data inserted!' as Message,
    'Check views and queries above!' as NextStep;


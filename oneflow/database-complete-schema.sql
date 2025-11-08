-- ================================================================
-- OneFlow Database Schema - Complete SQL Setup
-- ================================================================
-- This script creates all necessary tables for the OneFlow application
-- Run this in MySQL to set up your database structure
-- ================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS oneflow;
USE oneflow;

-- ================================================================
-- 1. USERS TABLE
-- ================================================================
-- Stores user authentication and role information
-- ================================================================

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed password',
    role VARCHAR(50) NOT NULL DEFAULT 'TEAM_MEMBER'
        COMMENT 'User role: SUPERADMIN, PROJECT_MANAGER, TEAM_MEMBER, SALES_FINANCE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts with authentication and authorization';

-- ================================================================
-- 2. PROJECTS TABLE
-- ================================================================
-- Stores project information and metrics
-- ================================================================

DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Project name',
    description TEXT COMMENT 'Detailed project description',
    manager VARCHAR(255) NOT NULL COMMENT 'Project manager username',
    status VARCHAR(50) NOT NULL DEFAULT 'Planned'
        COMMENT 'Project status: Planned, In Progress, Completed, On Hold',
    progress INT NOT NULL DEFAULT 0
        COMMENT 'Progress percentage (0-100)',
    deadline VARCHAR(50) COMMENT 'Project deadline date',
    team_size INT DEFAULT 0 COMMENT 'Number of team members',
    tasks_completed INT DEFAULT 0 COMMENT 'Number of completed tasks',
    total_tasks INT DEFAULT 0 COMMENT 'Total number of tasks',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_manager (manager),
    INDEX idx_status (status),
    INDEX idx_deadline (deadline),

    CHECK (progress >= 0 AND progress <= 100),
    CHECK (tasks_completed >= 0),
    CHECK (total_tasks >= 0),
    CHECK (team_size >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Project management and tracking';

-- ================================================================
-- 3. TASKS TABLE
-- ================================================================
-- Stores task information linked to projects
-- ================================================================

DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Task title',
    description TEXT COMMENT 'Detailed task description',
    project VARCHAR(255) COMMENT 'Project name (for display)',
    project_id BIGINT COMMENT 'Reference to project ID',
    assignee VARCHAR(255) NOT NULL COMMENT 'Assigned user username',
    assignee_avatar VARCHAR(500) COMMENT 'Avatar URL or path',
    due_date VARCHAR(50) COMMENT 'Task due date',
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium'
        COMMENT 'Task priority: Low, Medium, High',
    state VARCHAR(20) NOT NULL DEFAULT 'New'
        COMMENT 'Task state: New, In Progress, Done',
    completed INT DEFAULT 0 COMMENT 'Subtasks completed count',
    total INT DEFAULT 0 COMMENT 'Total subtasks count',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_project_id (project_id),
    INDEX idx_assignee (assignee),
    INDEX idx_priority (priority),
    INDEX idx_state (state),
    INDEX idx_due_date (due_date),

    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CHECK (completed >= 0),
    CHECK (total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Task management and tracking';

-- ================================================================
-- 4. TASK_TAGS TABLE
-- ================================================================
-- Stores tags associated with tasks (Many-to-Many relationship)
-- ================================================================

DROP TABLE IF EXISTS task_tags CASCADE;

CREATE TABLE task_tags (
    task_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,

    PRIMARY KEY (task_id, tag),

    FOREIGN KEY (task_id) REFERENCES tasks(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_tag (tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tags for categorizing tasks';

-- ================================================================
-- SAMPLE DATA FOR TESTING
-- ================================================================
-- Comment out this section if you don't want sample data
-- ================================================================

-- Insert sample users with different roles
INSERT INTO users (username, email, password, role) VALUES
('superadmin', 'admin@oneflow.com', '$2a$10$xj3qIQjbw3RgxQJqwCz6IeKCXk4x9zWqLJX5mKu4Qz8ZxT6yHzV0e', 'SUPERADMIN'),
('john_manager', 'john.manager@oneflow.com', '$2a$10$xj3qIQjbw3RgxQJqwCz6IeKCXk4x9zWqLJX5mKu4Qz8ZxT6yHzV0e', 'PROJECT_MANAGER'),
('jane_dev', 'jane.dev@oneflow.com', '$2a$10$xj3qIQjbw3RgxQJqwCz6IeKCXk4x9zWqLJX5mKu4Qz8ZxT6yHzV0e', 'TEAM_MEMBER'),
('bob_sales', 'bob.sales@oneflow.com', '$2a$10$xj3qIQjbw3RgxQJqwCz6IeKCXk4x9zWqLJX5mKu4Qz8ZxT6yHzV0e', 'SALES_FINANCE');
-- Default password for all test users: admin123

-- Insert sample projects
INSERT INTO projects (name, description, manager, status, progress, deadline, team_size, tasks_completed, total_tasks) VALUES
('Website Redesign', 'Complete overhaul of company website with modern UI/UX', 'john_manager', 'In Progress', 65, '2025-12-31', 5, 13, 20),
('Mobile App Development', 'Native iOS and Android app for customer portal', 'john_manager', 'In Progress', 40, '2026-03-15', 8, 8, 20),
('Database Migration', 'Migrate from legacy system to new cloud infrastructure', 'john_manager', 'Planned', 15, '2026-01-30', 3, 3, 20),
('Marketing Campaign Q1', 'Launch new product marketing campaign', 'bob_sales', 'In Progress', 80, '2025-12-15', 4, 16, 20);

-- Insert sample tasks
INSERT INTO tasks (title, description, project, project_id, assignee, priority, state, due_date, completed, total) VALUES
('Design homepage mockup', 'Create initial design concepts for new homepage', 'Website Redesign', 1, 'jane_dev', 'High', 'In Progress', '2025-11-15', 2, 5),
('Implement user authentication', 'Set up JWT-based authentication system', 'Website Redesign', 1, 'jane_dev', 'High', 'Done', '2025-11-10', 4, 4),
('API integration', 'Integrate third-party APIs for data fetching', 'Mobile App Development', 2, 'jane_dev', 'Medium', 'New', '2025-12-01', 0, 3),
('Database schema design', 'Design new database schema and relationships', 'Database Migration', 3, 'john_manager', 'High', 'In Progress', '2025-11-20', 1, 3),
('Social media content', 'Create content calendar for social media', 'Marketing Campaign Q1', 4, 'bob_sales', 'Medium', 'Done', '2025-11-05', 5, 5);

-- Insert sample task tags
INSERT INTO task_tags (task_id, tag) VALUES
(1, 'design'),
(1, 'ui/ux'),
(1, 'frontend'),
(2, 'backend'),
(2, 'security'),
(2, 'authentication'),
(3, 'backend'),
(3, 'api'),
(3, 'integration'),
(4, 'database'),
(4, 'architecture'),
(5, 'marketing'),
(5, 'content');

-- ================================================================
-- USEFUL QUERIES FOR VERIFICATION
-- ================================================================

-- View all tables
SHOW TABLES;

-- View users with roles
SELECT id, username, email, role, created_at FROM users;

-- View projects with metrics
SELECT
    id,
    name,
    manager,
    status,
    CONCAT(progress, '%') as progress,
    CONCAT(tasks_completed, '/', total_tasks) as task_progress,
    deadline
FROM projects
ORDER BY created_at DESC;

-- View tasks with project info
SELECT
    t.id,
    t.title,
    p.name as project_name,
    t.assignee,
    t.priority,
    t.state,
    t.due_date,
    CONCAT(t.completed, '/', t.total) as subtasks
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
ORDER BY t.created_at DESC;

-- View tasks with their tags
SELECT
    t.id,
    t.title,
    GROUP_CONCAT(tt.tag ORDER BY tt.tag SEPARATOR ', ') as tags
FROM tasks t
LEFT JOIN task_tags tt ON t.id = tt.task_id
GROUP BY t.id, t.title;

-- Project statistics
SELECT
    COUNT(*) as total_projects,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN status = 'Planned' THEN 1 ELSE 0 END) as planned,
    ROUND(AVG(progress), 2) as avg_progress
FROM projects;

-- Task statistics by state
SELECT
    state,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks), 2) as percentage
FROM tasks
GROUP BY state;

-- ================================================================
-- MAINTENANCE QUERIES
-- ================================================================

-- Update project progress based on completed tasks
UPDATE projects p
SET progress = CASE
    WHEN total_tasks > 0
    THEN ROUND((tasks_completed * 100.0) / total_tasks)
    ELSE 0
END;

-- Count tasks for each project
UPDATE projects p
SET total_tasks = (
    SELECT COUNT(*)
    FROM tasks t
    WHERE t.project_id = p.id
),
tasks_completed = (
    SELECT COUNT(*)
    FROM tasks t
    WHERE t.project_id = p.id AND t.state = 'Done'
);

-- Delete old completed tasks (optional - be careful!)
-- DELETE FROM tasks WHERE state = 'Done' AND updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- ================================================================
-- BACKUP COMMAND (Run from command line)
-- ================================================================
-- mysqldump -u root -p oneflow > oneflow_backup_$(date +%Y%m%d).sql

-- ================================================================
-- RESTORE COMMAND (Run from command line)
-- ================================================================
-- mysql -u root -p oneflow < oneflow_backup_YYYYMMDD.sql

-- ================================================================
-- END OF SCHEMA
-- ================================================================

-- Show success message
SELECT 'Database schema created successfully!' as Status,
       'Sample data inserted!' as Message,
       'Run verification queries above to check data' as NextStep;


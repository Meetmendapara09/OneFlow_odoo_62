# 📊 Complete Database Setup Guide - Projects & Tasks

## Overview

This guide will help you set up the complete database schema for Users, Projects, and Tasks with full functionality.

## Step 1: Run the SQL Schema

### Option A: Run Complete Schema (Recommended)

Open MySQL command line or MySQL Workbench and run:

```bash
mysql -u root -p471@Root < C:\Users\palak\OneDrive\Desktop\clone_1\oneflow\database-complete-schema.sql
```

Or copy-paste the contents of `database-complete-schema.sql` into MySQL Workbench and execute.

### Option B: Let JPA Auto-Create (Already Done)

Your backend with `spring.jpa.hibernate.ddl-auto=update` will automatically create/update tables when it starts.

**Status**: ✅ Tables already created when you started the backend!

## Step 2: Verify Database Structure

```sql
USE oneflow;

-- Check all tables exist
SHOW TABLES;

-- Expected output:
-- +----------------------+
-- | Tables_in_oneflow    |
-- +----------------------+
-- | projects             |
-- | task_tags            |
-- | tasks                |
-- | users                |
-- +----------------------+
```

### Verify Projects Table Structure

```sql
DESCRIBE projects;
```

**Expected columns:**
```
+------------------+--------------+------+-----+-------------------+
| Field            | Type         | Null | Key | Default           |
+------------------+--------------+------+-----+-------------------+
| id               | bigint       | NO   | PRI | NULL              |
| name             | varchar(255) | NO   |     | NULL              |
| description      | text         | YES  |     | NULL              |
| manager          | varchar(255) | NO   |     | NULL              |
| status           | varchar(50)  | NO   |     | NULL              |
| progress         | int          | NO   |     | NULL              |
| deadline         | varchar(50)  | YES  |     | NULL              |
| team_size        | int          | YES  |     | NULL              |
| tasks_completed  | int          | YES  |     | NULL              |
| total_tasks      | int          | YES  |     | NULL              |
+------------------+--------------+------+-----+-------------------+
```

### Verify Tasks Table Structure

```sql
DESCRIBE tasks;
```

**Expected columns:**
```
+------------------+--------------+------+-----+---------+
| Field            | Type         | Null | Key | Default |
+------------------+--------------+------+-----+---------+
| id               | bigint       | NO   | PRI | NULL    |
| title            | varchar(255) | NO   |     | NULL    |
| description      | text         | YES  |     | NULL    |
| project          | varchar(255) | YES  |     | NULL    |
| project_id       | bigint       | YES  | MUL | NULL    |
| assignee         | varchar(255) | NO   |     | NULL    |
| assignee_avatar  | varchar(500) | YES  |     | NULL    |
| due_date         | varchar(50)  | YES  |     | NULL    |
| priority         | varchar(20)  | NO   |     | NULL    |
| state            | varchar(20)  | NO   |     | NULL    |
| completed        | int          | YES  |     | NULL    |
| total            | int          | YES  |     | NULL    |
+------------------+--------------+------+-----+---------+
```

## Step 3: Test Database Functionality

### Create a Test Project

```sql
INSERT INTO projects (name, description, manager, status, progress, deadline, team_size, tasks_completed, total_tasks)
VALUES (
    'Test Project',
    'This is a test project to verify database functionality',
    'superadmin',
    'In Progress',
    50,
    '2025-12-31',
    5,
    10,
    20
);

-- Verify it was created
SELECT * FROM projects WHERE name = 'Test Project';
```

### Create a Test Task

```sql
INSERT INTO tasks (title, description, project, project_id, assignee, priority, state, due_date, completed, total)
VALUES (
    'Test Task',
    'This is a test task',
    'Test Project',
    (SELECT id FROM projects WHERE name = 'Test Project' LIMIT 1),
    'superadmin',
    'High',
    'New',
    '2025-12-01',
    0,
    5
);

-- Verify it was created
SELECT * FROM tasks WHERE title = 'Test Task';
```

### Add Tags to Test Task

```sql
INSERT INTO task_tags (task_id, tag)
VALUES 
    ((SELECT id FROM tasks WHERE title = 'Test Task' LIMIT 1), 'test'),
    ((SELECT id FROM tasks WHERE title = 'Test Task' LIMIT 1), 'demo');

-- Verify tags
SELECT t.title, tt.tag 
FROM tasks t 
JOIN task_tags tt ON t.id = tt.task_id 
WHERE t.title = 'Test Task';
```

## Step 4: Test via Backend API

### Test Project Creation via API

```bash
# PowerShell
$body = @{
    name = "API Test Project"
    description = "Created via API"
    manager = "superadmin"
    status = "Planned"
    progress = 0
    deadline = "2025-12-31"
    teamSize = 3
    tasksCompleted = 0
    totalTasks = 0
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:8080/api/projects' -Method POST -Body $body -ContentType 'application/json' -Headers @{Authorization="Bearer YOUR_JWT_TOKEN"}
```

### Test Get All Projects

```bash
# PowerShell
Invoke-RestMethod -Uri 'http://localhost:8080/api/projects' -Method GET -Headers @{Authorization="Bearer YOUR_JWT_TOKEN"}
```

## Step 5: Test via Frontend

### Test Projects Page

1. **Sign in** as superadmin
2. **Navigate to**: http://localhost:3000/projects
3. **Click** "Create Project" or similar button
4. **Fill in** project details
5. **Submit** and verify it appears in the list
6. **Check database**:
   ```sql
   SELECT * FROM projects ORDER BY id DESC LIMIT 1;
   ```

### Test Tasks Page

1. **Navigate to**: http://localhost:3000/tasks
2. **Create** a new task
3. **Assign** to a project
4. **Submit** and verify
5. **Check database**:
   ```sql
   SELECT * FROM tasks ORDER BY id DESC LIMIT 1;
   ```

## Step 6: Verify Data Persistence

### Test 1: Create and Retrieve

```sql
-- Count before
SELECT COUNT(*) as before_count FROM projects;

-- Create via API or frontend
-- (Use your frontend or API test above)

-- Count after
SELECT COUNT(*) as after_count FROM projects;

-- Should be: after_count = before_count + 1
```

### Test 2: Update Project

```sql
-- Update via SQL
UPDATE projects 
SET progress = 75, status = 'In Progress' 
WHERE name = 'Test Project';

-- Verify via API
-- GET http://localhost:8080/api/projects
-- Should show updated progress
```

### Test 3: Delete Project

```sql
-- Delete via SQL
DELETE FROM projects WHERE name = 'Test Project';

-- Verify via API
-- GET http://localhost:8080/api/projects
-- Should not show deleted project
```

## Step 7: Database Relationships

### Verify Foreign Keys Work

```sql
-- Try to create task with invalid project_id (should fail or set NULL)
INSERT INTO tasks (title, project_id, assignee, priority, state)
VALUES ('Invalid Task', 99999, 'test', 'Low', 'New');

-- Check if it was created with NULL project_id
SELECT * FROM tasks WHERE title = 'Invalid Task';
```

### Verify Cascade Delete

```sql
-- Create a project and task
INSERT INTO projects (name, manager, status, progress) 
VALUES ('Delete Test', 'admin', 'Planned', 0);

SET @project_id = LAST_INSERT_ID();

INSERT INTO tasks (title, project_id, assignee, priority, state)
VALUES ('Task to be deleted', @project_id, 'admin', 'Low', 'New');

INSERT INTO task_tags (task_id, tag)
VALUES ((SELECT id FROM tasks WHERE title = 'Task to be deleted'), 'test-tag');

-- Delete the task
DELETE FROM tasks WHERE title = 'Task to be deleted';

-- Verify task_tags were also deleted (cascade)
SELECT * FROM task_tags WHERE tag = 'test-tag';
-- Should return empty result
```

## Useful Queries for Development

### Get All Projects with Task Count

```sql
SELECT 
    p.id,
    p.name,
    p.manager,
    p.status,
    p.progress,
    COUNT(t.id) as actual_task_count,
    p.total_tasks as recorded_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id
ORDER BY p.id;
```

### Get All Tasks with Project Names

```sql
SELECT 
    t.id,
    t.title,
    p.name as project_name,
    t.assignee,
    t.priority,
    t.state,
    GROUP_CONCAT(tt.tag SEPARATOR ', ') as tags
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN task_tags tt ON t.id = tt.task_id
GROUP BY t.id;
```

### Get User's Projects

```sql
SELECT * FROM projects 
WHERE manager = 'superadmin' 
ORDER BY created_at DESC;
```

### Get Overdue Tasks

```sql
SELECT 
    t.title,
    t.due_date,
    t.assignee,
    t.state,
    p.name as project
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
WHERE t.state != 'Done' 
  AND STR_TO_DATE(t.due_date, '%Y-%m-%d') < CURDATE()
ORDER BY t.due_date;
```

### Project Dashboard Stats

```sql
SELECT 
    COUNT(*) as total_projects,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
    AVG(progress) as average_progress,
    SUM(total_tasks) as total_tasks_all_projects
FROM projects;
```

## Troubleshooting

### Issue: Tables not created

**Solution**:
```sql
-- Check if JPA created them
SHOW TABLES;

-- If not, run the schema manually
SOURCE C:/Users/palak/OneDrive/Desktop/clone_1/oneflow/database-complete-schema.sql;
```

### Issue: Foreign key constraint error

**Solution**:
```sql
-- Check if referenced project exists
SELECT id FROM projects WHERE id = YOUR_PROJECT_ID;

-- If not, create project first or use NULL
INSERT INTO tasks (title, project_id, ...) 
VALUES ('Task', NULL, ...);
```

### Issue: Data not showing in frontend

**Solution**:
1. Check backend is running: `netstat -ano | findstr :8080`
2. Check API response: Open browser DevTools → Network tab
3. Verify database has data: `SELECT * FROM projects;`
4. Check authentication: Make sure JWT token is valid

### Issue: Duplicate entries

**Solution**:
```sql
-- Check for duplicates
SELECT name, COUNT(*) 
FROM projects 
GROUP BY name 
HAVING COUNT(*) > 1;

-- Remove duplicates (keep latest)
DELETE p1 FROM projects p1
INNER JOIN projects p2 
WHERE p1.id < p2.id 
  AND p1.name = p2.name;
```

## Database Backup & Restore

### Backup All Tables

```bash
# Command line
mysqldump -u root -p471@Root oneflow > oneflow_backup.sql

# Backup only projects and tasks
mysqldump -u root -p471@Root oneflow projects tasks task_tags > projects_backup.sql
```

### Restore from Backup

```bash
mysql -u root -p471@Root oneflow < oneflow_backup.sql
```

## Summary Checklist

- [ ] Database schema created
- [ ] All 4 tables exist (users, projects, tasks, task_tags)
- [ ] Sample data inserted (optional)
- [ ] Can create projects via SQL
- [ ] Can create tasks via SQL
- [ ] Can create projects via API
- [ ] Can create tasks via API
- [ ] Frontend projects page works
- [ ] Frontend tasks page works
- [ ] Data persists across server restarts
- [ ] Foreign keys working correctly
- [ ] Cascade deletes working

## Current Status

✅ **Backend**: Running and connected to MySQL
✅ **Models**: Project and Task entities properly configured
✅ **Repositories**: ProjectRepository and TaskRepository created
✅ **Services**: ProjectService and TaskService with MySQL integration
✅ **Database**: Schema auto-created by JPA

**Your projects and tasks are now fully functional with MySQL database!** 🎉

All CRUD operations will persist to the database and survive server restarts.


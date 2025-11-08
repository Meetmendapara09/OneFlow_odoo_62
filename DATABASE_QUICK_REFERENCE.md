# 🚀 Quick Reference: Projects & Tasks Database

## ✅ SYSTEM STATUS

**Database**: ✅ Connected and Functional
**Projects Table**: ✅ Created (4 records exist)
**Tasks Table**: ✅ Created (5 records exist)
**Backend**: ✅ Running on port 8080
**Frontend**: ✅ Ready to use

---

## 📊 PROJECTS TABLE

### Structure
```sql
id, name, description, manager, status, progress, 
deadline, team_size, tasks_completed, total_tasks
```

### Valid Status Values
- `Planned`
- `In Progress`
- `Completed`
- `On Hold`

### Quick Commands

**View all projects:**
```sql
mysql -u root -p471@Root -e "USE oneflow; SELECT id, name, manager, status, progress FROM projects;"
```

**Create project:**
```sql
INSERT INTO projects (name, manager, status, progress)
VALUES ('New Project', 'superadmin', 'Planned', 0);
```

**Update project:**
```sql
UPDATE projects SET progress = 50, status = 'In Progress' WHERE id = 1;
```

---

## 📝 TASKS TABLE

### Structure
```sql
id, title, description, project, project_id, assignee,
priority, state, due_date, completed, total
```

### Valid Priority Values
- `Low`
- `Medium`
- `High`

### Valid State Values
- `New`
- `In Progress`
- `Done`

### Quick Commands

**View all tasks:**
```sql
mysql -u root -p471@Root -e "USE oneflow; SELECT id, title, assignee, priority, state FROM tasks;"
```

**Create task:**
```sql
INSERT INTO tasks (title, assignee, priority, state)
VALUES ('New Task', 'superadmin', 'High', 'New');
```

**Link task to project:**
```sql
UPDATE tasks SET project_id = 1 WHERE id = 5;
```

---

## 🏷️ TASK TAGS

**Add tags:**
```sql
INSERT INTO task_tags (task_id, tag) VALUES (1, 'urgent'), (1, 'backend');
```

**View tasks with tags:**
```sql
SELECT t.title, GROUP_CONCAT(tt.tag) as tags
FROM tasks t
LEFT JOIN task_tags tt ON t.id = tt.task_id
GROUP BY t.id;
```

---

## 🔗 API ENDPOINTS (Requires JWT)

### Sign In First
```powershell
$body = '{"username":"super","password":"YOUR_PASSWORD"}'
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/signin' -Method POST -Body $body -ContentType 'application/json'
$token = $response.token
```

### Projects API
```powershell
$headers = @{Authorization = "Bearer $token"}

# GET all projects
Invoke-RestMethod -Uri 'http://localhost:8080/api/projects' -Headers $headers

# GET single project
Invoke-RestMethod -Uri 'http://localhost:8080/api/projects/1' -Headers $headers

# POST create project
$body = @{name="Test";manager="super";status="Planned";progress=0} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:8080/api/projects' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
```

### Tasks API
```powershell
$headers = @{Authorization = "Bearer $token"}

# GET all tasks
Invoke-RestMethod -Uri 'http://localhost:8080/api/tasks' -Headers $headers

# POST create task
$body = @{title="Test Task";assignee="super";priority="High";state="New"} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:8080/api/tasks' -Method POST -Body $body -ContentType 'application/json' -Headers $headers
```

---

## 🌐 FRONTEND PAGES

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | http://localhost:3000/dashboard | Overview stats |
| Projects | http://localhost:3000/projects | List/Create projects |
| Tasks | http://localhost:3000/tasks | List/Create tasks |
| Analytics | http://localhost:3000/analytics | Analytics view |

---

## 📈 USEFUL QUERIES

### Dashboard Stats
```sql
SELECT 
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM tasks) as total_tasks,
    (SELECT COUNT(*) FROM tasks WHERE state = 'Done') as completed_tasks,
    (SELECT AVG(progress) FROM projects) as avg_progress;
```

### Projects with Task Count
```sql
SELECT 
    p.name,
    COUNT(t.id) as task_count,
    SUM(CASE WHEN t.state = 'Done' THEN 1 ELSE 0 END) as completed_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id;
```

### High Priority Pending Tasks
```sql
SELECT title, assignee, due_date 
FROM tasks 
WHERE priority = 'High' AND state != 'Done'
ORDER BY due_date;
```

### My Assigned Tasks
```sql
SELECT title, project, priority, state, due_date
FROM tasks
WHERE assignee = 'superadmin'
ORDER BY priority DESC, due_date;
```

---

## 🛠️ MAINTENANCE

### Backup
```bash
mysqldump -u root -p471@Root oneflow > backup.sql
```

### Restore
```bash
mysql -u root -p471@Root oneflow < backup.sql
```

### Update Project Task Counts
```sql
UPDATE projects p SET 
    total_tasks = (SELECT COUNT(*) FROM tasks WHERE project_id = p.id),
    tasks_completed = (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND state = 'Done');
```

### Clean Old Completed Tasks (Optional)
```sql
DELETE FROM tasks 
WHERE state = 'Done' 
AND updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

---

## 🐛 TROUBLESHOOTING

### Backend not responding?
```bash
netstat -ano | findstr :8080
# If nothing, restart backend:
cd C:\Users\palak\OneDrive\Desktop\clone_1\oneflow
mvn spring-boot:run
```

### Can't connect to database?
```sql
mysql -u root -p471@Root -e "SELECT 1;"
# Should return 1 if working
```

### Data not showing in frontend?
1. Check JWT token is valid
2. Open DevTools → Network tab
3. Check API response status
4. Verify data in database

### Foreign key errors?
```sql
-- Check if project exists before linking
SELECT id FROM projects WHERE id = YOUR_PROJECT_ID;
```

---

## 📋 QUICK TESTS

### Test 1: Create Project via SQL
```sql
INSERT INTO projects (name, manager, status, progress) 
VALUES ('SQL Test', 'super', 'Planned', 0);

SELECT * FROM projects WHERE name = 'SQL Test';
```

### Test 2: Create Task via SQL
```sql
INSERT INTO tasks (title, assignee, priority, state)
VALUES ('SQL Test Task', 'super', 'Medium', 'New');

SELECT * FROM tasks WHERE title = 'SQL Test Task';
```

### Test 3: Link Task to Project
```sql
UPDATE tasks 
SET project_id = (SELECT id FROM projects WHERE name = 'SQL Test' LIMIT 1)
WHERE title = 'SQL Test Task';

SELECT t.title, p.name as project 
FROM tasks t 
JOIN projects p ON t.project_id = p.id 
WHERE t.title = 'SQL Test Task';
```

---

## ✅ VERIFICATION

Run this to verify everything is working:

```sql
mysql -u root -p471@Root oneflow << EOF
SELECT 'Database Connection' as Test, 'OK' as Status
UNION ALL
SELECT 'Projects Table', CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'EMPTY' END FROM projects
UNION ALL
SELECT 'Tasks Table', CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'EMPTY' END FROM tasks
UNION ALL
SELECT 'Users Table', CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'EMPTY' END FROM users;
EOF
```

**Expected output:**
```
+---------------------+--------+
| Test                | Status |
+---------------------+--------+
| Database Connection | OK     |
| Projects Table      | OK     |
| Tasks Table         | OK     |
| Users Table         | OK     |
+---------------------+--------+
```

---

## 🎯 SUMMARY

**✅ Database**: Fully set up and functional
**✅ Projects**: CRUD operations working
**✅ Tasks**: CRUD operations working
**✅ Backend**: Connected to MySQL
**✅ API**: Secured with JWT
**✅ Sample Data**: Available for testing

**Your database-driven projects and tasks system is ready to use!** 🚀

For detailed guides, see:
- `database-complete-schema.sql` - Full SQL schema
- `DATABASE_PROJECTS_SETUP_GUIDE.md` - Setup instructions
- `DATABASE_FUNCTIONALITY_STATUS.md` - Detailed status


# ✅ OneFlow MySQL Database - Successfully Running!

## 🎉 Database Status: RUNNING

Your MySQL database is now successfully running in Docker with all the data from `database-complete-schema.sql` loaded.

## 📊 What's Been Set Up

### Database Information
- **Container Name**: oneflow-mysql
- **Status**: Healthy and Running
- **Port**: 3306 (accessible on localhost)
- **Database**: oneflow

### Connection Details
```
Host: localhost
Port: 3306
Database: oneflow
Username: oneflow_user
Password: oneflow_pass
Root Password: rootpassword
```

### Spring Boot Connection String
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/oneflow?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=oneflow_user
spring.datasource.password=oneflow_pass
```

## 📋 Database Contents

### Tables Created
✓ users (4 sample users)
✓ projects (4 sample projects)
✓ tasks (5 sample tasks)
✓ task_tags (13 sample tags)

### Sample Users
1. **superadmin** - SUPERADMIN role
2. **john_manager** - PROJECT_MANAGER role
3. **jane_dev** - TEAM_MEMBER role
4. **bob_sales** - SALES_FINANCE role

All test users have password: `admin123` (BCrypt hashed)

### Sample Projects
1. Website Redesign (65% complete)
2. Mobile App Development (40% complete)
3. Database Migration (15% complete)
4. Marketing Campaign Q1 (80% complete)

## 🚀 Quick Commands

### Using the Helper Script
```bash
cd /workspaces/iitgn_odoo/oneflow

# Check status
./db-commands.sh status

# View tables
./db-commands.sh tables

# View users
./db-commands.sh users

# View projects
./db-commands.sh projects

# Connect to MySQL
./db-commands.sh connect

# View logs
./db-commands.sh logs

# Stop database
./db-commands.sh stop

# Start database
./db-commands.sh start

# Create backup
./db-commands.sh backup

# Reset database (WARNING: deletes all data!)
./db-commands.sh reset
```

### Using Docker Compose
```bash
cd /workspaces/iitgn_odoo/oneflow

# Start
docker-compose -f docker-compose.mysql.yml up -d

# Stop
docker-compose -f docker-compose.mysql.yml down

# View logs
docker-compose -f docker-compose.mysql.yml logs -f

# Restart
docker-compose -f docker-compose.mysql.yml restart
```

### Direct Docker Commands
```bash
# Connect to MySQL CLI
docker exec -it oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow

# Execute SQL query
docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SELECT * FROM users;"

# Check container status
docker ps | grep oneflow-mysql

# View container logs
docker logs -f oneflow-mysql
```

## 🔧 Files Created

1. **Dockerfile.mysql** - MySQL Docker image configuration
2. **docker-compose.mysql.yml** - Docker Compose setup
3. **mysql.cnf** - MySQL configuration (performance, charset)
4. **.env.mysql** - Environment variables
5. **db-commands.sh** - Helper script for easy database management
6. **README-DOCKER-MYSQL.md** - Complete documentation

## 🎯 Next Steps

### For Spring Boot Application

1. Update `oneflow/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/oneflow?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=oneflow_user
spring.datasource.password=oneflow_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

2. Start your Spring Boot application:
```bash
cd /workspaces/iitgn_odoo/oneflow
./mvnw spring-boot:run
```

### For Testing

Test the connection:
```bash
# Quick health check
docker exec oneflow-mysql mysqladmin ping -h localhost -u root -prootpassword

# List all tables
docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SHOW TABLES;"

# Count records
docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "
SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM projects) as projects,
  (SELECT COUNT(*) FROM tasks) as tasks,
  (SELECT COUNT(*) FROM task_tags) as tags;
"
```

## 📦 Data Persistence

Your data is persisted in a Docker volume named `oneflow_mysql_data`. This means:
- ✅ Data survives container restarts
- ✅ Data survives container deletion (unless you use `down -v`)
- ✅ Can be backed up and restored

## 🔒 Security Notes

⚠️ **IMPORTANT**: Current passwords are for DEVELOPMENT ONLY!

For production:
1. Change all passwords in `docker-compose.mysql.yml`
2. Use Docker secrets or secure environment variables
3. Enable SSL/TLS
4. Restrict network access
5. Set up regular backups

## 🐛 Troubleshooting

If you encounter issues:

```bash
# Check if container is running
docker ps | grep oneflow-mysql

# View recent logs
docker logs --tail=50 oneflow-mysql

# Restart container
docker-compose -f docker-compose.mysql.yml restart

# Full reset (DELETES ALL DATA!)
docker-compose -f docker-compose.mysql.yml down -v
docker-compose -f docker-compose.mysql.yml up -d
```

## 📈 Monitoring

```bash
# Container resource usage
docker stats oneflow-mysql

# Database size
docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'oneflow'
GROUP BY table_schema;
"

# Connection count
docker exec oneflow-mysql mysql -u oneflow_user -poneflow_pass -e "SHOW STATUS LIKE 'Threads_connected';"
```

## ✅ Success!

Your MySQL database is fully operational and ready to use with your OneFlow application!

---

For more details, see `README-DOCKER-MYSQL.md`

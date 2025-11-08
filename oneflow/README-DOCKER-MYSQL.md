# OneFlow MySQL Docker Setup

This directory contains Docker configuration for running MySQL database for the OneFlow application.

## 📋 Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Start MySQL database
docker-compose -f docker-compose.mysql.yml up -d

# View logs
docker-compose -f docker-compose.mysql.yml logs -f

# Stop database
docker-compose -f docker-compose.mysql.yml down

# Stop and remove all data (CAUTION: This deletes all data!)
docker-compose -f docker-compose.mysql.yml down -v
```

### Option 2: Using Docker Commands Directly

```bash
# Build the image
docker build -f Dockerfile.mysql -t oneflow-mysql:latest .

# Run the container
docker run -d \
  --name oneflow-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=oneflow \
  -e MYSQL_USER=oneflow_user \
  -e MYSQL_PASSWORD=oneflow_pass \
  -v mysql_data:/var/lib/mysql \
  oneflow-mysql:latest

# View logs
docker logs -f oneflow-mysql

# Stop container
docker stop oneflow-mysql

# Remove container
docker rm oneflow-mysql
```

## 🔌 Connection Details

Once the database is running, you can connect using:

- **Host**: `localhost` (or `127.0.0.1`)
- **Port**: `3306`
- **Database**: `oneflow`
- **Username**: `oneflow_user`
- **Password**: `oneflow_pass`
- **Root Password**: `rootpassword`

### Connection String for Spring Boot

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/oneflow?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=oneflow_user
spring.datasource.password=oneflow_pass
```

## 🔧 Database Management

### Connect to MySQL CLI

```bash
# Connect as oneflow_user
docker exec -it oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow

# Connect as root
docker exec -it oneflow-mysql mysql -u root -prootpassword oneflow
```

### Execute SQL Commands

```bash
# Run a SQL file
docker exec -i oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow < your-script.sql

# Run a single command
docker exec -it oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SHOW TABLES;"
```

### Backup Database

```bash
# Create backup
docker exec oneflow-mysql mysqldump -u oneflow_user -poneflow_pass oneflow > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker exec -i oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow < backup_file.sql
```

## 📊 Verify Installation

After starting the database, verify that everything is working:

```bash
# Check if container is running
docker ps | grep oneflow-mysql

# Check database health
docker exec oneflow-mysql mysqladmin ping -h localhost -u root -prootpassword

# View tables
docker exec -it oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SHOW TABLES;"

# View sample data
docker exec -it oneflow-mysql mysql -u oneflow_user -poneflow_pass oneflow -e "SELECT * FROM users;"
```

## 🗂️ File Structure

```
oneflow/
├── Dockerfile.mysql              # MySQL Docker image configuration
├── docker-compose.mysql.yml      # Docker Compose configuration
├── database-complete-schema.sql  # Database schema and sample data
├── mysql.cnf                     # Custom MySQL configuration
├── .env.mysql                    # Environment variables
└── README-DOCKER-MYSQL.md        # This file
```

## ⚙️ Configuration

### MySQL Configuration (mysql.cnf)

The `mysql.cnf` file contains custom MySQL settings:
- Character set: UTF-8 (utf8mb4)
- Performance tuning parameters
- Logging configuration
- Security settings

### Environment Variables

Edit `.env.mysql` or `docker-compose.mysql.yml` to change:
- Database name
- User credentials
- Root password

## 🔒 Security Notes

**IMPORTANT**: The default passwords in this setup are for development only!

For production:
1. Change all passwords in `.env.mysql` or `docker-compose.mysql.yml`
2. Use Docker secrets or environment variables
3. Enable SSL/TLS connections
4. Restrict network access
5. Regular backups
6. Update MySQL regularly

### Change Passwords

```bash
# Connect to MySQL as root
docker exec -it oneflow-mysql mysql -u root -prootpassword

# Then run:
ALTER USER 'oneflow_user'@'%' IDENTIFIED BY 'new_secure_password';
FLUSH PRIVILEGES;
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose -f docker-compose.mysql.yml logs

# Check if port 3306 is already in use
netstat -tulpn | grep 3306
# or
lsof -i :3306
```

### Connection refused

```bash
# Wait for MySQL to fully initialize (first startup takes longer)
docker-compose -f docker-compose.mysql.yml logs -f

# Check health status
docker inspect oneflow-mysql | grep -A 10 "Health"
```

### Reset database completely

```bash
# Stop and remove everything including data
docker-compose -f docker-compose.mysql.yml down -v

# Start fresh
docker-compose -f docker-compose.mysql.yml up -d
```

### Access denied errors

Verify credentials in:
- `docker-compose.mysql.yml`
- `.env.mysql`
- Your application's configuration

## 📈 Monitoring

### View resource usage

```bash
# Container stats
docker stats oneflow-mysql

# Disk usage
docker exec oneflow-mysql du -sh /var/lib/mysql
```

### Check MySQL status

```bash
docker exec -it oneflow-mysql mysql -u root -prootpassword -e "SHOW STATUS;"
docker exec -it oneflow-mysql mysql -u root -prootpassword -e "SHOW PROCESSLIST;"
```

## 🔗 Integration with Spring Boot

Update your `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/oneflow?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=oneflow_user
spring.datasource.password=oneflow_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## 📚 Additional Resources

- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 📝 Notes

- The database schema (`database-complete-schema.sql`) is automatically executed on first startup
- Data is persisted in a Docker volume named `mysql_data`
- Sample data includes test users with password: `admin123` (BCrypt hashed)
- The database includes 4 tables: users, projects, tasks, and task_tags

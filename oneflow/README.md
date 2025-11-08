# OneFlow Backend API 🔧

Spring Boot REST API for OneFlow Portal - A comprehensive project and task management system.

## 🏗️ Architecture

This backend follows a clean layered architecture:

```
Controller Layer → Service Layer → Repository Layer → Database
     ↓                  ↓                ↓
  REST API        Business Logic    Data Access
```

## 📦 Technology Stack

- **Framework**: Spring Boot 3.5.7
- **Language**: Java 17
- **Security**: Spring Security 6.5.6 + JWT
- **Database**: MySQL 8.0+ (with JPA/Hibernate)
- **Build Tool**: Maven 3.9+
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Hibernate with Spring Data JPA
- **Testing**: JUnit 5, Spring Boot Test

## 🚀 Getting Started

### Prerequisites

- Java Development Kit (JDK) 17 or higher
- Maven 3.9+ (or use included Maven wrapper)
- MySQL 8.0+ or Docker

### 1. Database Setup

#### Using Docker (Recommended)

```bash
docker run --name oneflow-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=oneflowdb \
  -e MYSQL_USER=oneflow \
  -e MYSQL_PASSWORD=oneflowpassword \
  -p 3306:3306 \
  -d mysql:8.0
```

#### Using Local MySQL

```sql
CREATE DATABASE oneflowdb;
CREATE USER 'oneflow'@'localhost' IDENTIFIED BY 'oneflowpassword';
GRANT ALL PRIVILEGES ON oneflowdb.* TO 'oneflow'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/oneflowdb
spring.datasource.username=oneflow
spring.datasource.password=oneflowpassword

# JWT Configuration (IMPORTANT: Use a secure key in production!)
jwt.secret=your-secure-512-bit-jwt-secret-key-change-this-in-production
jwt.expiration=86400000
```

### 3. Build and Run

#### Using Maven Wrapper (Recommended)

```bash
# Clean and build
./mvnw clean install

# Run application
./mvnw spring-boot:run
```

#### Using Maven

```bash
# Clean and build
mvn clean install

# Run application
mvn spring-boot:run
```

#### Using JAR

```bash
# Build JAR
./mvnw clean package

# Run JAR
java -jar target/oneflow-0.0.1-SNAPSHOT.jar
```

### 4. Verify Installation

The API will be available at `http://localhost:8080`

**Health Check:**
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "message": "OneFlow API is running",
  "status": "UP",
  "timestamp": "2025-11-08T15:41:57.951Z"
}
```

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication

All endpoints (except `/auth/**` and `/health`) require JWT authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | User login | No |

#### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects | Yes |
| GET | `/api/projects/{id}` | Get project by ID | Yes |
| POST | `/api/projects` | Create new project | Yes |
| PUT | `/api/projects/{id}` | Update project | Yes |
| DELETE | `/api/projects/{id}` | Delete project | Yes |

#### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks | Yes |
| GET | `/api/tasks/{id}` | Get task by ID | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/{id}` | Update task | Yes |
| DELETE | `/api/tasks/{id}` | Delete task | Yes |

#### Health

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | API health check | No |

### API Examples

#### Register User

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepass123"
  }'
```

Response: JWT token as plain text string

#### Create Project (Authenticated)

```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "manager": "John Doe",
    "status": "In Progress",
    "progress": 0,
    "deadline": "2025-12-31",
    "teamSize": 5,
    "tasksCompleted": 0,
    "totalTasks": 10
  }'
```

#### Get All Projects

```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Task

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Implement feature",
    "description": "Task description",
    "project": "Project Name",
    "projectId": "project-uuid",
    "assignee": "John Doe",
    "due": "2025-12-15",
    "priority": "High",
    "state": "New",
    "tags": ["frontend", "urgent"]
  }'
```

## 🏛️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

### Projects Table

```sql
CREATE TABLE projects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager VARCHAR(255),
    status VARCHAR(50),
    progress INT,
    deadline DATE,
    team_size INT,
    tasks_completed INT,
    total_tasks INT
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project VARCHAR(255),
    project_id VARCHAR(255),
    assignee VARCHAR(255),
    assignee_avatar VARCHAR(255),
    due DATE,
    priority VARCHAR(50),
    state VARCHAR(50),
    completed INT,
    total INT
);

CREATE TABLE task_tags (
    task_id VARCHAR(255),
    tags VARCHAR(255),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

## 🔐 Security

### JWT Configuration

- **Algorithm**: HS512 (HMAC with SHA-512)
- **Token Expiration**: 24 hours (configurable)
- **Secret Key**: Minimum 512 bits required

⚠️ **Important**: Change the default JWT secret in production!

### Password Security

- Passwords are hashed using BCrypt
- Minimum strength: BCrypt default strength (10 rounds)


## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Verify MySQL is running:
```bash
docker ps | grep mysql
```

2. Test database connection:
```bash
mysql -h localhost -u oneflow -p oneflowdb
```

3. Check logs:
```bash
./mvnw spring-boot:run --debug
```

### JWT Token Issues

- Ensure secret key is at least 512 bits (64 characters)
- Check token expiration time
- Verify Bearer token format in Authorization header

## 🚀 Production Deployment

### Environment Variables

Set these environment variables in production:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-host:3306/oneflowdb
export SPRING_DATASOURCE_USERNAME=oneflow
export SPRING_DATASOURCE_PASSWORD=secure-password
export JWT_SECRET=your-super-secure-512-bit-production-secret
export SERVER_PORT=8080
```

### Build Production JAR

```bash
./mvnw clean package -DskipTests
```

### Run Production JAR

```bash
java -jar \
  -Dspring.profiles.active=prod \
  -Xmx512m \
  target/oneflow-0.0.1-SNAPSHOT.jar
```

## 📝 Configuration Reference

### Key Configuration Properties

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/oneflowdb
spring.datasource.username=oneflow
spring.datasource.password=oneflowpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# Logging
logging.level.root=INFO
logging.level.com.example.oneflow=DEBUG

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

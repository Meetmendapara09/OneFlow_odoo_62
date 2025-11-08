# OneFlow Portal 🚀

**OneFlow Portal** is a modern, full-stack project and task management platform built for Companies. It combines a powerful Spring Boot backend with a sleek Next.js frontend to deliver a seamless user experience for managing projects, tasks, analytics, and team collaboration.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Development](#-development)

---

## ✨ Features

### Core Functionality

- 🔐 **JWT-based Authentication** - Secure user registration and login
- 📊 **Project Management** - Create, update, delete, and track projects
- ✅ **Task Tracking** - Manage tasks with priorities, tags, and subtasks
- 📈 **Analytics Dashboard** - Visual insights into project and task metrics
- 👥 **User Management** - Role-based access control and user profiles
- 🎨 **Theme Customization** - Light/dark mode with DaisyUI themes
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Technical Features

- ⚡ **Real-time Updates** - Fast and reactive UI with Next.js 16
- 🔄 **RESTful API** - Clean and well-documented backend endpoints
- 💾 **MySQL Database** - Persistent data storage with JPA/Hibernate
- 🔒 **CORS Configured** - Secure cross-origin resource sharing
- 🐳 **Docker Support** - MySQL containerized for easy deployment
- 🎯 **Type Safety** - Full TypeScript support in frontend

---

## 🛠 Technology Stack

### Backend (oneflow/)

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ | Programming Language |
| Spring Boot | 3.5.7 | Application Framework |
| Spring Security | 6.5.6 | Authentication & Authorization |
| Spring Data JPA | 3.5.7 | Database ORM |
| MySQL | 8.0+ | Primary Database |
| JWT (jjwt) | 0.11.5 | Token-based Authentication |
| Lombok | Latest | Boilerplate Code Reduction |
| Maven | 3.9+ | Build Tool |

### Frontend (frontend/)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.1 | React Framework |
| React | 19.2.0 | UI Library |
| TypeScript | 5.0+ | Type Safety |
| Tailwind CSS | 4.0 | Styling Framework |
| DaisyUI | 5.4.7 | Component Library |
| Recharts | 3.3.0 | Data Visualization |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)** 17 or higher
- **Maven** 3.9 or higher
- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **MySQL** 8.0 or higher (or Docker)
- **Docker** (optional, for MySQL container)
- **Git** for version control

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Meetmendapara09/iitgn_odoo.git
cd iitgn_odoo
```

### 2. Setup MySQL Database

**Option A: Using Docker (Recommended)**

```bash
docker run --name oneflow-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=oneflowdb \
  -e MYSQL_USER=oneflow \
  -e MYSQL_PASSWORD=oneflowpassword \
  -p 3306:3306 \
  -d mysql:8.0
```

**Option B: Using Local MySQL**

```sql
CREATE DATABASE oneflowdb;
CREATE USER 'oneflow'@'localhost' IDENTIFIED BY 'oneflowpassword';
GRANT ALL PRIVILEGES ON oneflowdb.* TO 'oneflow'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Backend

Edit `oneflow/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/oneflowdb
spring.datasource.username=oneflow
spring.datasource.password=oneflowpassword
jwt.secret=your-secure-jwt-secret-key-min-512-bits
```

### 4. Start Backend

```bash
cd oneflow
./mvnw clean install
./mvnw spring-boot:run
```

Backend will be available at `http://localhost:8080`

### 5. Configure Frontend

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 6. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 7. Access the Application

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:8080/api>
- **Health Check**: <http://localhost:8080/api/health>

**Default Test Credentials:**

- Username: `testuser`
- Password: `password123`

---

## ⚙️ Configuration

### Backend Configuration

Key configuration options in `application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/oneflowdb
spring.datasource.username=oneflow
spring.datasource.password=oneflowpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-512-bit-secret-key-here
jwt.expiration=86400000

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

### Frontend Configuration

Environment variables in `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Optional: Analytics, etc.
# NEXT_PUBLIC_ANALYTICS_ID=your-id
```

---

## 💻 Development

### Running Tests

**Backend:**

```bash
cd oneflow
./mvnw test
```

**Frontend:**

```bash
cd frontend
npm test
```

### Database Migrations

Database schema is automatically created/updated using Hibernate DDL auto-update. For production, consider using Flyway or Liquibase.

### Code Style

**Backend:**

- Follow Java naming conventions
- Use Lombok annotations to reduce boilerplate
- Keep controllers thin, services fat
- Write meaningful test cases

**Frontend:**

- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components
- Keep components small and reusable

---

### Environment Variables

Ensure these are set in production:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` (minimum 512 bits)
- `NEXT_PUBLIC_API_URL`

---

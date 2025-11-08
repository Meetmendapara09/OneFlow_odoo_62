# OneFlow Frontend 🎨

Modern, responsive Next.js frontend for OneFlow Portal - A comprehensive project and task management system built for Companies.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)

## 🎯 Overview

This is a full-featured React application built with Next.js 16, featuring server-side rendering, TypeScript support, JWT authentication, and a beautiful UI powered by Tailwind CSS and DaisyUI. The frontend integrates seamlessly with the OneFlow Spring Boot backend API.

## ✨ Features

- 🔐 **JWT Authentication** - Secure login and registration
- 📊 **Project Management** - Create, view, edit, and delete projects
- ✅ **Task Tracking** - Manage tasks with priorities and tags
- 📈 **Analytics Dashboard** - Visual insights with Recharts
- 👤 **User Profile** - Account management
- 🎨 **Theme Support** - Light, dark, and custom themes
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Real-time Updates** - Fast and reactive UI

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.1 | React Framework with SSR |
| React | 19.2.0 | UI Library |
| TypeScript | 5.0+ | Type Safety |
| Tailwind CSS | 4.0 | Utility-first CSS |
| DaisyUI | 5.4.7 | Component Library |
| Recharts | 3.3.0 | Data Visualization |

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Backend API running on port 8080

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment configuration
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build

```bash
npm run build
npm start
```
## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the frontend directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# For GitHub Codespaces or remote backend:
# NEXT_PUBLIC_API_URL=https://your-backend-url.app.github.dev/api
```

### Tailwind Configuration

Customize theme in `tailwind.config.ts`:

```typescript
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "oneflow"],
    base: true,
    styled: true,
  },
}
```

### Theme Customization

Change theme in `app/layout.tsx`:

```tsx
<html lang="en" data-theme="oneflow">
```

Available themes: `light`, `dark`, `oneflow`, `corporate`, `cupcake`, etc.

## 🔌 API Integration

The frontend uses a typed API client located in `lib/api.ts` that handles all backend communication.

### Authentication

```typescript
import { authAPI } from '@/lib/api';

// Sign up
await authAPI.signup({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepass123'
});

// Sign in
const token = await authAPI.signin({
  username: 'johndoe',
  password: 'securepass123'
});

// Store JWT token
localStorage.setItem('token', token);
```

### Projects

```typescript
import { projectAPI } from '@/lib/api';

// Get all projects
const projects = await projectAPI.list();

// Create project
const newProject = await projectAPI.create({
  name: 'New Project',
  description: 'Description',
  manager: 'John Doe',
  status: 'In Progress',
  progress: 0,
  deadline: '2025-12-31',
  teamSize: 5
});

// Update project
await projectAPI.update('project-id', { progress: 50 });

// Delete project
await projectAPI.delete('project-id');
```

### Tasks

```typescript
import { taskAPI } from '@/lib/api';

// Get all tasks
const tasks = await taskAPI.list();

// Create task
const newTask = await taskAPI.create({
  title: 'New Task',
  description: 'Task description',
  projectId: 'project-id',
  assignee: 'John Doe',
  priority: 'High',
  state: 'New',
  tags: ['frontend', 'urgent']
});
```

## 🎨 UI Components

### Available DaisyUI Components

The project uses DaisyUI for pre-built components:

- **Buttons**: `btn`, `btn-primary`, `btn-outline`, `btn-ghost`
- **Cards**: `card`, `card-body`, `card-title`, `card-actions`
- **Forms**: `form-control`, `input`, `textarea`, `select`, `checkbox`
- **Navigation**: `navbar`, `menu`, `drawer`, `tabs`
- **Layout**: `hero`, `footer`, `divider`, `stack`
- **Data Display**: `table`, `badge`, `stat`, `timeline`
- **Feedback**: `alert`, `toast`, `loading`, `progress`

### Custom Components

#### AuthCard

```tsx
<AuthCard title="Sign In" subtitle="Welcome back!">
  <form>{/* Your form */}</form>
</AuthCard>
```

#### FormField

```tsx
<FormField
  label="Email"
  type="email"
  name="email"
  placeholder="Enter your email"
  required
/>
```

#### ProjectCard

```tsx
<ProjectCard
  project={{
    id: "1",
    name: "Project Name",
    status: "In Progress",
    progress: 75,
    manager: "John Doe"
  }}
/>
```

## 🔐 Authentication Flow

### 1. User Registration (`/signup`)

- User fills registration form
- Form submits to `/api/auth/signup`
- On success, redirect to login page

### 2. User Login (`/signin`)

- User enters credentials
- Form submits to `/api/auth/signin`
- Receive JWT token
- Store token in localStorage
- Redirect to dashboard

### 3. Protected Routes

All pages except landing, signin, and signup check for JWT token:

```typescript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/signin');
  }
}, []);
```

### 4. Logout

```typescript
const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/');
};
```

## 📊 Pages Overview

### Public Pages

- **Landing Page** (`/`) - Hero, features, statistics, FAQ
- **Sign In** (`/signin`) - User login
- **Sign Up** (`/signup`) - User registration
- **Forgot Password** (`/forgot`) - Password recovery

### Protected Pages

- **Dashboard** (`/dashboard`) - Overview with stats
- **Projects** (`/projects`) - Projects list and management
- **Project Detail** (`/projects/[id]`) - Single project view
- **Tasks** (`/tasks`) - Tasks list and management
- **Task Detail** (`/tasks/[id]`) - Single task view
- **Analytics** (`/analytics`) - Charts and insights
- **Profile** (`/profile`) - User account settings
- **Style Guide** (`/styleguide`) - Component showcase

## 🧪 Development

### Run Development Server

```bash
npm run dev
```

Runs with Turbopack for faster builds. Visit http://localhost:3000

### Build for Production

```bash
npm run build
```

Creates optimized production build in `.next/` directory.

### Start Production Server

```bash
npm start
```

Runs the production build.

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### API Connection Issues

1. Verify backend is running: `curl http://localhost:8080/api/health`
2. Check CORS is configured on backend
3. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
4. Check browser console for errors

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t oneflow-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api:8080/api \
  oneflow-frontend
```

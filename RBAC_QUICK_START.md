# 🚀 Quick Start Guide - Role-Based Access Control

## Test the System Now!

### Step 1: Verify Backend is Running
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080
```
You should see: `LISTENING 20072` (or similar PID)

### Step 2: Test Signup with Roles

Go to: **http://localhost:3000/signup**

Create test users with different roles:

#### Test User 1: Superadmin
- Username: `superadmin`
- Email: `super@admin.com`
- Password: `admin12345`
- **Role**: Super Admin ⭐

#### Test User 2: Project Manager
- Username: `pm_test`
- Email: `pm@test.com`
- Password: `manager123`
- **Role**: Project Manager 👨‍💼

#### Test User 3: Team Member
- Username: `developer`
- Email: `dev@test.com`
- Password: `developer123`
- **Role**: Team Member 👨‍💻

#### Test User 4: Sales/Finance
- Username: `sales_user`
- Email: `sales@test.com`
- Password: `sales12345`
- **Role**: Sales/Finance 💰

### Step 3: Test Each Role

#### A. Sign in as Superadmin
1. Go to http://localhost:3000/signin
2. Username: `superadmin`, Password: `admin12345`
3. **Expected Results:**
   - ✅ Redirected to dashboard
   - ✅ Navbar shows "superadmin" with **"SUPERADMIN"** badge
   - ✅ Dropdown shows role
   - ✅ **Admin menu visible** (Manage Users, Settings)

#### B. Sign in as Project Manager
1. Sign out (click dropdown → Sign Out)
2. Sign in: `pm_test` / `manager123`
3. **Expected Results:**
   - ✅ Navbar shows **"PROJECT MANAGER"** badge
   - ✅ **Admin menu visible** (can manage projects)

#### C. Sign in as Team Member
1. Sign out
2. Sign in: `developer` / `developer123`
3. **Expected Results:**
   - ✅ Navbar shows **"TEAM MEMBER"** badge
   - ✅ **No admin menu** (regular user)

#### D. Sign in as Sales/Finance
1. Sign out
2. Sign in: `sales_user` / `sales12345`
3. **Expected Results:**
   - ✅ Navbar shows **"SALES FINANCE"** badge
   - ✅ **No admin menu**
   - ✅ (Future: access to financial reports)

### Step 4: Verify Role Persistence

1. Sign in with any user
2. **Refresh the page (F5)**
3. **Expected**: Still signed in, role badge still visible

### Step 5: Check Database

```bash
mysql -u root -p471@Root -e "USE oneflow; SELECT id, username, email, role FROM users;"
```

**Expected output:**
```
+----+-------------+------------------+------------------+
| id | username    | email            | role             |
+----+-------------+------------------+------------------+
|  1 | superadmin  | super@admin.com  | SUPERADMIN       |
|  2 | pm_test     | pm@test.com      | PROJECT_MANAGER  |
|  3 | developer   | dev@test.com     | TEAM_MEMBER      |
|  4 | sales_user  | sales@test.com   | SALES_FINANCE    |
+----+-------------+------------------+------------------+
```

## Visual Guide

### What You'll See in the UI

#### 1. Signup Form
```
┌─────────────────────────────────────┐
│ Username: [              ]          │
│ Email:    [              ]          │
│ Password: [              ]          │
│ Confirm:  [              ]          │
│                                     │
│ Role: [▼ Team Member      ]         │
│       ├─ Team Member                │
│       ├─ Project Manager            │
│       ├─ Sales/Finance              │
│       └─ Super Admin                │
│                                     │
│         [Sign Up]                   │
└─────────────────────────────────────┘
```

#### 2. Navbar (Superadmin)
```
⚡ OneFlow  Dashboard Projects Tasks Analytics Profile  [S▼] [SUPERADMIN]
                                                         └─────────────┘
                                                         Click to open menu
```

#### 3. User Dropdown (Superadmin)
```
┌─────────────────────────┐
│ Signed in as            │
│ superadmin              │
│ [SUPERADMIN]            │
├─────────────────────────┤
│ 👤 Profile              │
│ 📊 Dashboard            │
├─────────────────────────┤
│ Admin                   │
│ 👥 Manage Users         │
│ ⚙️ Settings             │
├─────────────────────────┤
│ 🚪 Sign Out             │
└─────────────────────────┘
```

#### 4. User Dropdown (Team Member)
```
┌─────────────────────────┐
│ Signed in as            │
│ developer               │
│ [TEAM MEMBER]           │
├─────────────────────────┤
│ 👤 Profile              │
│ 📊 Dashboard            │
├─────────────────────────┤
│ 🚪 Sign Out             │
└─────────────────────────┘
```
*(No Admin section)*

## Role Differences Quick Reference

| What You See | SUPERADMIN | PROJECT_MANAGER | TEAM_MEMBER | SALES_FINANCE |
|--------------|------------|-----------------|-------------|---------------|
| Badge Color | Secondary | Secondary | Secondary | Secondary |
| Admin Menu | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Manage Users | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Settings | ✅ Yes | ❌ No | ❌ No | ❌ No |

## Developer: Using Roles in Code

### Example 1: Conditional Button
```typescript
import { useAuth } from "@/contexts/AuthContext";

function ProjectCard() {
  const { isAdmin } = useAuth();
  
  return (
    <div className="card">
      <h3>My Project</h3>
      {isAdmin() && (
        <button className="btn btn-error">Delete Project</button>
      )}
    </div>
  );
}
```

### Example 2: Role-Specific Content
```typescript
import RoleGuard from "@/components/RoleGuard";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Everyone sees this */}
      <section>General Stats</section>
      
      {/* Only admins see this */}
      <RoleGuard allowedRoles={['SUPERADMIN', 'PROJECT_MANAGER']}>
        <section>Admin Statistics</section>
      </RoleGuard>
      
      {/* Only sales sees this */}
      <RoleGuard allowedRoles={['SUPERADMIN', 'SALES_FINANCE']}>
        <section>Financial Reports</section>
      </RoleGuard>
    </div>
  );
}
```

### Example 3: Check Specific Role
```typescript
import { useAuth } from "@/contexts/AuthContext";

function Settings() {
  const { user, hasRole } = useAuth();
  
  if (hasRole('SUPERADMIN')) {
    return <SuperadminSettings />;
  }
  
  return <RegularSettings />;
}
```

## Common Tasks

### Change a User's Role (via Database)
```sql
UPDATE users SET role = 'PROJECT_MANAGER' WHERE username = 'developer';
```
*(User must sign out and sign in again to see the change)*

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### Find All Admins
```sql
SELECT username, email, role 
FROM users 
WHERE role IN ('SUPERADMIN', 'PROJECT_MANAGER');
```

## Troubleshooting

### Role Badge Not Showing
1. Clear browser cache: Ctrl+Shift+Delete
2. Clear localStorage: `localStorage.clear()` in console
3. Sign in again

### Admin Menu Not Visible
1. Check your role: `localStorage.getItem('role')`
2. Should be `SUPERADMIN` or `PROJECT_MANAGER`
3. If wrong, sign out and sign in again

### Role Not Persisting
1. Check if token is saved: `localStorage.getItem('token')`
2. Check if role is saved: `localStorage.getItem('role')`
3. If not, check browser console for errors

## Success Indicators

✅ **Everything is working if:**
1. Can sign up with role selection
2. Role badge appears in navbar after signin
3. Admin menu shows for SUPERADMIN and PROJECT_MANAGER
4. Admin menu hidden for TEAM_MEMBER and SALES_FINANCE
5. Role persists after page refresh
6. Database shows correct roles for users

## Next Steps (Optional Enhancements)

1. **Implement page-level protection:**
   - Create admin-only pages
   - Redirect non-admins who try to access

2. **Add role-based project access:**
   - Project managers can only see their projects
   - Team members can only see assigned projects

3. **Financial dashboard for SALES_FINANCE:**
   - Revenue reports
   - Expense tracking
   - Only visible to SALES_FINANCE and SUPERADMIN

4. **User management page for SUPERADMIN:**
   - View all users
   - Change user roles
   - Deactivate users

## Your RBAC System is Ready! 🎉

You can now:
- ✅ Create users with different roles
- ✅ See role badges in the UI
- ✅ Show/hide content based on roles
- ✅ Build role-specific features
- ✅ Manage access control throughout your app

**Start by creating the 4 test users and experiencing each role!**


# 🧪 QUICK TEST - Admin User Management

## ⚡ INSTANT ACCESS

### Step 1: Sign In as Admin
```
URL: http://localhost:3000/signin
Login: Use SUPERADMIN account (username: "super")
```

### Step 2: Access Admin Panel
```
1. Look at top-right navbar
2. Click on your avatar/username
3. See dropdown menu
4. Click "👥 Manage Users" under "Admin" section
```

### Step 3: You Should See
```
✅ Page title: "Manage Users"
✅ Stats cards showing: Total Users, Admins, PMs, Team Members
✅ Search bar and role filter
✅ Table with 5 default users
✅ "+ Add User" button
```

---

## 📋 QUICK TESTS

### Test 1: View Users ✅
- [ ] See 5 users in table
- [ ] Each has avatar, username, email, role badge, hourly rate
- [ ] Stats cards show correct counts
- [ ] Role badges are color-coded

### Test 2: Search ✅
- [ ] Type "john" in search box
- [ ] See only john_manager
- [ ] Clear search
- [ ] All users return

### Test 3: Filter by Role ✅
- [ ] Select "Project Manager" from dropdown
- [ ] See only PMs
- [ ] Select "All Roles"
- [ ] All users return

### Test 4: Add User ✅
- [ ] Click "+ Add User"
- [ ] Modal opens
- [ ] Fill form (username, email, password, role, rate)
- [ ] Click "Add User"
- [ ] See success alert
- [ ] New user in table

### Test 5: Edit User ✅
- [ ] Click pencil icon (✏️) on any user
- [ ] Modal opens with current data
- [ ] Change role or hourly rate
- [ ] Click "Save Changes"
- [ ] See success alert
- [ ] Table updates

### Test 6: Delete User ✅
- [ ] Click trash icon (🗑️) on non-super user
- [ ] Confirmation dialog appears
- [ ] Click OK
- [ ] See success alert
- [ ] User removed from table

---

## 🎨 WHAT YOU'LL SEE

### Stats Dashboard
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Users  │ │   Admins     │ │Project Mgrs  │ │Team Members  │
│      5       │ │      1       │ │      1       │ │      2       │
│ All users    │ │ System admins│ │ Managing     │ │ Active team  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Users Table
```
┌────────────────────────────────────────────────────────────────┐
│ User          │ Email         │ Role          │ Rate  │ Actions│
├────────────────────────────────────────────────────────────────┤
│ [S] super     │ super@...     │ 🔑 SUPERADMIN│ $100  │ ✏️     │
│    ID: 1      │               │              │       │        │
├────────────────────────────────────────────────────────────────┤
│ [J] john      │ john@...      │ 👔 PROJECT   │ $80   │ ✏️ 🗑️  │
│    ID: 2      │               │   MANAGER    │       │        │
├────────────────────────────────────────────────────────────────┤
│ [J] jane      │ jane@...      │ 👤 TEAM      │ $50   │ ✏️ 🗑️  │
│    ID: 3      │               │   MEMBER     │       │        │
└────────────────────────────────────────────────────────────────┘
```

### Add User Modal
```
┌───────────────────────────────────┐
│ Add New User                      │
├───────────────────────────────────┤
│ Username: [____________]          │
│ Email:    [____________]          │
│ Password: [____________]          │
│ Role:     [▼ Team Member]         │
│ Rate:     [50__________]          │
│                                   │
│              [Cancel] [Add User]  │
└───────────────────────────────────┘
```

---

## ✅ PASS CRITERIA

**All tests passed if:**
1. ✅ Admin can access /admin/users
2. ✅ Non-admins are redirected
3. ✅ Can view all users
4. ✅ Search works
5. ✅ Filter works
6. ✅ Can add new user
7. ✅ Can edit user
8. ✅ Can delete user (except super)
9. ✅ Stats update correctly
10. ✅ Alerts show on actions

---

## 🚫 NON-ADMIN TEST

### Try as Non-Admin:
```
1. Sign out
2. Sign in as team member or PM
3. Try to access /admin/users directly
4. You should be redirected to /dashboard
5. Avatar dropdown should NOT show "Manage Users" option
```

---

## 📱 RESPONSIVE CHECK

### Desktop (1920x1080)
- [ ] Stats in row (4 cards)
- [ ] Table fully visible
- [ ] Modals centered

### Tablet (768x1024)
- [ ] Stats in 2x2 grid
- [ ] Table scrollable
- [ ] Modals fit screen

### Mobile (375x667)
- [ ] Stats stacked vertically
- [ ] Table horizontal scroll
- [ ] Modals full width

---

## 🎉 SUCCESS!

**If all tests pass, the Admin User Management is working perfectly!**

You can now:
- ✅ Manage all system users
- ✅ Control roles and permissions
- ✅ Set hourly rates
- ✅ Add/edit/delete users
- ✅ Search and filter efficiently

**Test it now at: http://localhost:3000/admin/users** (after signing in as admin)


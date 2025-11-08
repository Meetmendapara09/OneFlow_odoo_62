# 🔍 Frontend Signup Debugging Guide

## Issue
Signup works from console/API testing but not from the frontend form.

## Debugging Steps Added

### 1. ✅ Enhanced Frontend Logging
**File**: `frontend/app/signup/page.tsx`

Added detailed console logs:
- ✅ handleSubmit called
- 📝 Form data (username, email, password masked)
- ❌ Validation failed (with errors)
- ✅ Validation passed
- 🔄 Calling authAPI.signup
- ✅ Signup API response
- ❌ Signup error (with full details)
- 🏁 Signup process completed

### 2. ✅ Enhanced API Layer Logging
**File**: `frontend/lib/api.ts`

Added network request logging:
- 🌐 API Request URL and method
- 📤 Request headers
- 📤 Request body
- 📥 Response status and headers
- ✅ Success response data
- ❌ Error response details

### 3. ✅ Enhanced Backend Logging
**File**: `oneflow/src/main/java/com/example/oneflow/controller/AuthController.java`

Added server-side logging:
- 📝 Signup request received (username, email)
- ⚠️ Username already exists warning
- 💾 Saving user to database
- ✅ User saved successfully (ID, username)

### 4. ✅ Enabled SQL Logging
**File**: `oneflow/src/main/resources/application.properties`

Enabled:
- SQL query display
- SQL formatting
- Parameter binding trace
- Hibernate debug logs

## How to Test and Debug

### Step 1: Open Browser Developer Tools
1. Open your browser
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Keep it open during testing

### Step 2: Navigate to Signup Page
Go to: **http://localhost:3000/signup**

### Step 3: Fill the Form
Enter test data:
- Username: `frontend_test_user`
- Email: `frontend@test.com`
- Password: `password123`
- Confirm: `password123`

### Step 4: Submit and Watch Console
Click "Sign Up" and watch for these logs in order:

#### Expected Console Output:
```
✅ handleSubmit called
📝 Form data: {username: "frontend_test_user", email: "frontend@test.com", password: "***"}
✅ Validation passed, calling API...
🔄 Calling authAPI.signup...
🌐 API Request: POST http://localhost:8080/api/auth/signup
📤 Request headers: {Content-Type: "application/json"}
📤 Request body: {"username":"frontend_test_user","email":"frontend@test.com","password":"password123"}
📥 Response status: 200 OK
📥 Response headers: {...}
✅ API Success Response: {message: "User registered successfully!"}
✅ Signup API response: {message: "User registered successfully!"}
🎉 Signup successful! Redirecting to signin...
🏁 Signup process completed, submitting: false
```

### Step 5: Check Backend Logs
Look at the terminal running `mvn spring-boot:run`:

#### Expected Backend Output:
```
INFO  c.e.o.controller.AuthController : 📝 Signup request received for username: frontend_test_user, email: frontend@test.com
DEBUG c.e.o.controller.AuthController : 💾 Saving user to database: frontend_test_user
Hibernate: insert into users (email,password,username) values (?,?,?)
INFO  c.e.o.controller.AuthController : ✅ User saved successfully! ID: 2, Username: frontend_test_user
```

### Step 6: Verify in Database
```bash
mysql -u root -p471@Root -e "USE oneflow; SELECT * FROM users;"
```

Expected result:
```
+----+---------------------+--------------------+
| id | username            | email              |
+----+---------------------+--------------------+
|  1 | testuser123         | test@example.com   |
|  2 | frontend_test_user  | frontend@test.com  |
+----+---------------------+--------------------+
```

## Common Issues & Solutions

### Issue 1: No Console Logs Appear
**Problem**: JavaScript not executing
**Check**:
- Is the frontend running? (`npm run dev`)
- Are you on the right page? (http://localhost:3000/signup)
- Open Console tab in DevTools (F12)

### Issue 2: Validation Fails
**Symptoms**:
```
❌ Validation failed: {username: "Username is required"}
```
**Solution**: Make sure all fields are filled correctly

### Issue 3: Network Error / Failed to Fetch
**Symptoms**:
```
❌ Fetch error: TypeError: Failed to fetch
```
**Check**:
- Is backend running? `netstat -ano | findstr :8080`
- Is it on the right port? Should be 8080
- Restart backend if needed

### Issue 4: CORS Error
**Symptoms**:
```
Access to fetch at 'http://localhost:8080/api/auth/signup' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Backend already configured for CORS, but if you see this:
- Restart backend server
- Check SecurityConfig.java has proper CORS configuration

### Issue 5: 400 Bad Request
**Symptoms**:
```
📥 Response status: 400 Bad Request
❌ API Error Response: Error: Username is already taken!
```
**Solution**: Username already exists, use a different one or delete existing user:
```bash
mysql -u root -p471@Root -e "USE oneflow; DELETE FROM users WHERE username='frontend_test_user';"
```

### Issue 6: 500 Internal Server Error
**Check Backend Logs**:
- Look for ERROR or Exception in the terminal
- Check database connection
- Verify MySQL is running

### Issue 7: Data Saves but No Redirect
**Symptoms**: Console shows success but page doesn't redirect
**Check**: Look for this log:
```
🎉 Signup successful! Redirecting to signin...
```
If you see this but no redirect, it's a Next.js routing issue.

## What to Look For

### ✅ Everything Working:
1. All console logs appear in correct order
2. API request shown with 200 status
3. Backend logs show "User saved successfully"
4. Database query executes (visible in logs)
5. User appears in database
6. Redirect to signin page happens

### ❌ Not Working - Diagnose:
1. **Where do the logs stop?** That's where the problem is
2. **No "handleSubmit called"?** → Form not submitting (check HTML)
3. **Stops at validation?** → Form validation failing
4. **Stops at API call?** → Network/backend issue
5. **API returns error?** → Check error message
6. **Backend not receiving request?** → CORS or network issue

## Quick Test Commands

### Test from console (should work):
```javascript
// In browser console at http://localhost:3000
fetch('http://localhost:8080/api/auth/signup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'console_test',
    email: 'console@test.com',
    password: 'test123'
  })
}).then(r => r.json()).then(console.log)
```

### Check if backend is accessible:
```javascript
// In browser console
fetch('http://localhost:8080/api/health')
  .then(r => {
    console.log('Backend reachable:', r.status);
    return r.text();
  })
  .then(console.log)
  .catch(e => console.error('Backend not reachable:', e))
```

## Current System Status

| Component | Status | PID |
|-----------|--------|-----|
| Backend Server | ✅ Running | 10200 |
| Frontend Server | Need to verify | - |
| MySQL Database | ✅ Connected | - |
| Enhanced Logging | ✅ Enabled | - |

## Next Steps

1. **Start/Restart Frontend** (if not running):
   ```bash
   cd C:\Users\palak\OneDrive\Desktop\clone_1\frontend
   npm run dev
   ```

2. **Open Signup Page**: http://localhost:3000/signup

3. **Open DevTools Console**: F12 → Console tab

4. **Try to Sign Up** with new unique username

5. **Watch the Console Logs** - they will tell you exactly what's happening

6. **Check Backend Logs** in the terminal running `mvn spring-boot:run`

7. **Report What You See**:
   - Copy the console logs
   - Copy the backend logs
   - Tell me where the process stops

The enhanced logging will show us **exactly** where the problem is occurring!


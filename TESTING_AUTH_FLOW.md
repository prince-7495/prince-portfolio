# Authentication Flow Testing Guide

This guide walks you through testing the complete authentication system step-by-step.

## Prerequisites

1. Backend server running: `npm run dev`
2. Frontend dev server: `npm run dev` (in another terminal)
3. MongoDB connection properly configured in `.env`
4. `.env` file has `JWT_SECRET` set

## Complete Test Flow

### Step 1: Signup (Create New Account)

**Frontend:**
1. Open http://localhost:5173/signup
2. Fill in the form:
   - Name: "Test User"
   - Email: "testuser@example.com" (use a unique email)
   - Password: "TestPassword123!"
   - Confirm Password: "TestPassword123!"
3. Click "Create Account"

**Expected Results:**
- ✅ Form validates all fields
- ✅ Toast notification shows "Account created successfully"
- ✅ Page redirects to Login or Todo page
- ✅ Token saved to localStorage (check DevTools → Application → Local Storage → authToken)

**Backend Verification:**
1. Open MongoDB Atlas or MongoDB client
2. Check your database collection `users`
3. Verify new user is created with:
   - name: "Test User"
   - email: "testuser@example.com"
   - password: (hashed, not plaintext)

---

### Step 2: Login

**Frontend:**
1. If redirected to Login page, proceed to next step
2. If auto-logged in, skip to Step 3
3. Navigate to http://localhost:5173/login
4. Fill in the form:
   - Email: "testuser@example.com"
   - Password: "TestPassword123!"
5. Click "Sign In"

**Expected Results:**
- ✅ Form validates email and password
- ✅ Toast notification shows "Login successful"
- ✅ Navbar updates to show user name: "Test User"
- ✅ Navbar shows "Logout" button
- ✅ Page redirects to /todo
- ✅ Token saved to localStorage

**Test Invalid Credentials:**
1. Try logging in with wrong password
2. Expected: Error toast "Invalid email or password"
3. Try logging in with non-existent email
4. Expected: Error toast "Invalid email or password"

---

### Step 3: Access Protected Todo Page

**Frontend:**
1. Verify you're on http://localhost:5173/todo
2. Page should load tasks from database
3. Navbar shows your name and logout button

**Expected Results:**
- ✅ Todo tasks load successfully
- ✅ Can see "Loading tasks..." briefly if cache is cold
- ✅ Task list displays (empty if first login)
- ✅ "Add task" form is visible and enabled

**API Verification (DevTools → Network):**
1. Open DevTools (F12)
2. Go to Network tab
3. Look for request to `http://localhost:5000/tasks`
4. Check request headers:
   - `Authorization: Bearer eyJhb...` ✅ (should contain token)
5. Check response:
   - Status: 200 OK
   - Body: Array of task objects

---

### Step 4: Create Task

**Frontend:**
1. On Todo page, in the "What needs to be done?" input field
2. Type: "Test Task 1"
3. (Optional) Select a due date
4. Click "+ Add" button

**Expected Results:**
- ✅ Task appears immediately in list (optimistic update)
- ✅ Toast notification shows "✓ Task created successfully"
- ✅ Input field clears
- ✅ Task is saved to MongoDB

**Backend Verification:**
1. MongoDB client: Check tasks collection
2. Verify new task has:
   - title: "Test Task 1"
   - completed: false
   - createdAt: timestamp
   - _id: ObjectId

---

### Step 5: Edit Task

**Frontend:**
1. On Todo page, hover over a task title
2. Title should show as clickable (pointer cursor)
3. Click on task title to edit
4. Modify text: "Test Task 1" → "Updated Task 1"
5. Press Enter or click away

**Expected Results:**
- ✅ Inline edit input appears
- ✅ Changes are sent to backend
- ✅ Toast shows "✓ Task updated"
- ✅ Task title updates in UI
- ✅ Changes persist in MongoDB

---

### Step 6: Complete Task

**Frontend:**
1. Click checkbox next to a task
2. Task should appear struck-through
3. Active count in header should decrease

**Expected Results:**
- ✅ Checkbox toggles completed status
- ✅ UI updates immediately (optimistic)
- ✅ Backend receives update
- ✅ Task shows as completed in database
- ✅ Switching filters works (All/Active/Completed)

---

### Step 7: Delete Task

**Frontend:**
1. Hover over task and click "✕" delete button
2. Confirmation dialog appears
3. Click "Delete" to confirm

**Expected Results:**
- ✅ Confirmation dialog shows task name
- ✅ Task removed from UI
- ✅ Toast shows "✓ Task deleted successfully"
- ✅ Task deleted from MongoDB

---

### Step 8: Logout

**Frontend:**
1. Click "Logout" button in navbar
2. Or open browser DevTools and manually clear localStorage

**Expected Results:**
- ✅ Navbar updates: hides user name, hides logout, shows sign in link
- ✅ Redirect to /login page
- ✅ localStorage is cleared (authToken removed)
- ✅ Attempting to access /todo redirects to /login

---

### Step 9: Verify Token Expiration

**Test Token Expiry (Advanced):**
1. Login normally
2. Note JWT expires in 7 days (set in .env: JWT_EXPIRE=7d)
3. To test manually:
   - Edit `.env` and set `JWT_EXPIRE=1s`
   - Restart backend
   - Login again
   - Wait 2 seconds
   - Try to create/update task
   - Should see error: "Not authorized to access this route" or "Token has expired"

---

### Step 10: Test Protected Routes

**Unauthenticated Access:**
1. Clear localStorage manually:
   - DevTools → Application → Local Storage → Delete authToken
   - Or use DevTools Console: `localStorage.removeItem('authToken')`
2. Try to access http://localhost:5173/todo
3. Expected: Redirect to /login

**Verify API Protection:**
1. Open Postman or cURL
2. Try to call `/tasks` without token:
   ```bash
   curl http://localhost:5000/tasks
   ```
3. Expected Response:
   ```json
   {
     "success": false,
     "message": "Not authorized to access this route"
   }
   ```
4. Now try with token:
   ```bash
   curl -H "Authorization: Bearer {your-token}" http://localhost:5000/tasks
   ```
5. Expected: Tasks array returned

---

## Troubleshooting

### Issue: "Not authorized to access this route" on login

**Cause:** Backend not recognizing token format  
**Solution:**
1. Check token in localStorage format
2. Should be: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Verify `JWT_SECRET` matches frontend and backend

---

### Issue: Tasks don't load after login

**Cause:** Token not being sent with API request  
**Solution:**
1. Check Network tab for `/tasks` request
2. Look for `Authorization` header
3. Should show: `Bearer eyJhbGc...`
4. If missing, check `src/api.js` has `buildHeaders()` function

---

### Issue: "Email is already registered" on signup

**Cause:** Email exists in database  
**Solution:**
- Use a different email for testing
- Or manually delete user from MongoDB

---

### Issue: Backend server crashing on login

**Cause:** Missing bcryptjs or jsonwebtoken dependency  
**Solution:**
```bash
npm install bcryptjs jsonwebtoken
npm run dev
```

---

### Issue: CORS error when calling auth endpoints

**Cause:** CLIENT_URL mismatch  
**Solution:**
1. Check `.env` has correct `CLIENT_URL`
2. Verify frontend runs on that URL
3. Restart backend after changing .env

---

## Manual API Testing (Postman/cURL)

### Signup
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "passwordConfirm": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Tasks (with token)
```bash
curl -X GET http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Task (with token)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "completed": false
  }'
```

---

## Checklist

### Frontend Tests
- [ ] Signup form validates all fields
- [ ] Signup creates user and stores token
- [ ] Login with correct credentials works
- [ ] Login with wrong password shows error
- [ ] Login with non-existent email shows error
- [ ] Navbar shows user name when logged in
- [ ] Logout button visible when logged in
- [ ] Logout clears localStorage and redirects
- [ ] Can access /todo when logged in
- [ ] Accessing /todo without token redirects to /login
- [ ] Can create tasks
- [ ] Can edit task titles
- [ ] Can toggle task completion
- [ ] Can delete tasks
- [ ] Filter tasks by all/active/completed works
- [ ] Clear completed tasks works

### Backend Tests
- [ ] POST /auth/signup creates user in MongoDB
- [ ] POST /auth/login returns valid JWT token
- [ ] GET /auth/me returns current user (with token)
- [ ] GET /auth/me rejects request without token
- [ ] GET /tasks requires authentication
- [ ] POST /tasks requires authentication
- [ ] PUT /tasks/:id requires authentication
- [ ] PATCH /tasks/:id requires authentication
- [ ] DELETE /tasks/:id requires authentication
- [ ] Token expiration is handled correctly
- [ ] CORS headers allow Authorization header

---

## Performance Notes

- **Cache:** Tasks are cached for 60 seconds
- **Token Size:** JWT is ~500-700 bytes
- **Storage:** localStorage can hold tokens up to 5-10 MB
- **Network:** Each API request adds ~50-100ms overhead

## Success Criteria

✅ All tests pass  
✅ No console errors in DevTools  
✅ Tasks persist in MongoDB  
✅ Users created in database with hashed passwords  
✅ Cannot access /todo without being logged in  
✅ Token automatically attached to all API requests  
✅ Logout clears authentication  

---

**Last Updated:** October 27, 2024  
**Status:** ✅ Testing Guide Complete

# Authentication - Quick Start Guide

Get started with the authentication system in under 5 minutes.

## 🚀 Quick Setup

### 1. Configure Environment (.env)

```env
JWT_SECRET=your-secret-key-minimum-32-characters-long-for-production
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://your-mongodb-uri
```

### 2. Start Backend

```bash
npm install bcryptjs jsonwebtoken
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## ✅ Test Authentication (5-Minute Demo)

### Step 1: Signup (1 min)
1. Go to http://localhost:5173/signup
2. Enter:
   - Name: "Demo User"
   - Email: "demo@example.com"
   - Password: "DemoPassword123!"
3. Click "Create Account"
4. ✅ Redirected to Todo page

### Step 2: Create Task (1 min)
1. Type: "Test Task"
2. Click "+ Add"
3. ✅ Task appears in list

### Step 3: Logout (1 min)
1. Click "Logout" in navbar
2. ✅ Redirected to login page
3. ✅ Cannot access /todo

### Step 4: Login (1 min)
1. Go to http://localhost:5173/login
2. Enter email and password
3. Click "Sign In"
4. ✅ Access tasks

### Step 5: Protected Routes (1 min)
1. DevTools → Application → Local Storage
2. ✅ See `authToken` key with JWT value
3. DevTools → Network
4. Create/edit task
5. ✅ See request has `Authorization: Bearer {token}` header

---

## 📝 API Endpoints

### Signup
```bash
POST http://localhost:5000/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!"
}
```

### Login
```bash
POST http://localhost:5000/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Get Tasks (requires token)
```bash
GET http://localhost:5000/tasks
Header: Authorization: Bearer {your_token_here}
```

### Create Task (requires token)
```bash
POST http://localhost:5000/tasks
Header: Authorization: Bearer {your_token_here}
{
  "title": "My Task",
  "description": "Task description",
  "completed": false
}
```

---

## 🎯 Key URLs

| Page | URL | Requires Auth |
|------|-----|--------|
| Signup | http://localhost:5173/signup | No |
| Login | http://localhost:5173/login | No |
| Todo | http://localhost:5173/todo | ✅ Yes |
| Home | http://localhost:5173/ | No |

---

## 🔑 Token Management

### Token Location
- Stored in: `localStorage.authToken`
- Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Token Lifespan
- Default: 7 days (set in .env: `JWT_EXPIRE=7d`)
- Auto-attached to all API requests
- Cleared on logout

### Manual Token Test
```javascript
// In browser console:
localStorage.getItem('authToken')  // View token
localStorage.removeItem('authToken')  // Clear token
```

---

## 🐛 Common Issues & Fixes

### "Not authorized to access this route"
```
✓ Logout and login again
✓ Check localStorage has authToken
✓ Verify JWT_SECRET in .env
```

### Token not being sent to API
```
✓ Check Network tab for Authorization header
✓ Verify src/api.js has buildHeaders() function
✓ Restart backend after .env changes
```

### Cannot create account (email already registered)
```
✓ Use a different email
✓ Or delete user from MongoDB
```

### Server won't start
```
✓ Check: npm install bcryptjs jsonwebtoken
✓ Check: .env has JWT_SECRET
✓ Check: Port 5000 is available
```

---

## 📚 Full Documentation

- **Complete Guide:** `AUTH_IMPLEMENTATION.md`
- **Testing Procedures:** `TESTING_AUTH_FLOW.md`
- **Implementation Summary:** `AUTHENTICATION_SUMMARY.md`

---

## 💡 Tips

1. **Use Unique Emails** - Each signup needs unique email
2. **Browser DevTools** - Check Console for error messages
3. **Network Tab** - Verify Authorization header on requests
4. **MongoDB** - Check database for created users
5. **Clear Cache** - If issues persist, clear localStorage

---

## 🚦 What's Protected

✅ All task operations require login:
- GET /tasks
- POST /tasks
- PUT /tasks/:id
- PATCH /tasks/:id
- DELETE /tasks/:id

❌ Not protected:
- POST /auth/signup
- POST /auth/login
- GET /auth/logout

---

## 🔐 Security Notes

- Passwords are hashed before storage
- Tokens expire after 7 days
- Only authenticated users can modify tasks
- CORS prevents cross-origin abuse
- Each request validates token

---

## 📊 What You Get

✅ Signup form with validation  
✅ Login page with authentication  
✅ Protected todo list  
✅ User display in navbar  
✅ Logout functionality  
✅ Token auto-management  
✅ Error notifications  
✅ Full documentation  

---

## 🎓 Learning Path

1. **New to Auth?** Start here → Read `AUTH_IMPLEMENTATION.md`
2. **Ready to Test?** → Follow `TESTING_AUTH_FLOW.md`
3. **Need Details?** → Check `AUTHENTICATION_SUMMARY.md`
4. **Troubleshooting?** → See Common Issues above

---

## ✨ Features Included

| Feature | Included |
|---------|----------|
| User Registration | ✅ |
| User Login | ✅ |
| JWT Tokens | ✅ |
| Protected Routes | ✅ |
| Password Hashing | ✅ |
| Token Auto-Attach | ✅ |
| Auto Logout | ✅ |
| Error Handling | ✅ |
| Toast Notifications | ✅ |
| Form Validation | ✅ |

---

**Ready to test?** Start both servers and navigate to http://localhost:5173/signup!

**Have questions?** Check the documentation files or GitHub issues.

**Version:** 1.0.0  
**Status:** ✅ Production Ready

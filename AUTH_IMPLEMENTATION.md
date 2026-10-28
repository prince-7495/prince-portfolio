# Authentication Implementation Guide

## Overview

This portfolio website now features a complete JWT-based authentication system with login, signup, and protected routes. The implementation uses industry-standard practices for secure user authentication and token management.

**Key Features:**
- User registration (signup) with email validation
- User login with JWT token generation
- Protected routes requiring authentication
- Automatic token attachment to API requests
- Logout functionality with localStorage cleanup
- Error handling with user-friendly messages
- Password hashing with bcryptjs (10 salt rounds)

---

## Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React + Context API | State management for auth |
| **Backend** | Express.js | REST API endpoints |
| **Database** | MongoDB | User data persistence |
| **Authentication** | JWT (JSON Web Tokens) | Stateless auth tokens |
| **Password Hashing** | bcryptjs v2.4.3 | Secure password storage |
| **Token Library** | jsonwebtoken | JWT generation/verification |

### Authentication Flow

```
┌─────────────────┐
│   User Sign Up  │
└────────┬────────┘
         │ POST /auth/signup {name, email, password}
         ▼
   ┌─────────────────────┐
   │ Validate Input      │
   │ Hash Password       │
   │ Save User to DB     │
   └─────────┬───────────┘
             │
             ▼
   ┌─────────────────────┐
   │ Generate JWT Token  │
   │ Return Token        │
   └─────────┬───────────┘
             │
         ┌───┴──────────────────────────────┐
         │ Store in localStorage            │
         ▼                                  ▼
    ┌─────────────┐              ┌────────────────────┐
    │ Add to ALL  │              │ All Subsequent     │
    │ API Requests│              │ API Requests Get   │
    │ (Header)    │              │ Authorization:     │
    └─────────────┘              │ Bearer {token}     │
                                 └────────────────────┘
```

---

## Backend Setup

### 1. Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Database
MONGO_URI=mongodb://your-mongodb-connection-string

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Important:** 
- `JWT_SECRET` must be strong and unique (min 32 characters for production)
- Never commit `.env` to version control (included in `.gitignore`)

### 2. User Model (`models/User.js`)

```javascript
// User schema with:
// - Email uniqueness validation
// - Password hashing pre-hook (bcryptjs, 10 salt rounds)
// - Password comparison method (matchPassword)
// - Automatic timestamps (createdAt, updatedAt)

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // not returned by default
  createdAt: { type: Date, default: Date.now },
});

// Pre-hook: hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method: compare password with hash
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

### 3. Authentication Routes (`routes/authRoutes.js`)

#### POST /auth/signup
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "passwordConfirm": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- All fields required
- Passwords must match
- Email must be unique
- Email format validation

**Error Responses:**
- `400`: Missing fields or validation error
- `409`: Email already registered

---

#### POST /auth/login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid email or password

---

#### GET /auth/me
Get current authenticated user (protected route).

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401`: No token provided or token invalid
- `401`: Token expired
- `404`: User not found

---

#### POST /auth/logout
Logout user (client-side operation).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Authentication Middleware (`middleware/auth.js`)

Protects routes by verifying JWT tokens.

```javascript
async function protect(req, res, next) {
  // 1. Extract token from Authorization header: "Bearer {token}"
  // 2. Verify token with JWT_SECRET
  // 3. Get user from database
  // 4. Attach user to req.user
  // 5. Call next() to proceed
}
```

**Usage:**
```javascript
app.get('/tasks', protect, (req, res) => {
  // req.user contains authenticated user
});
```

---

### 5. Protected Task Routes

All task operations now require authentication:

```
GET    /tasks              - Fetch all tasks (protected)
POST   /tasks              - Create new task (protected)
GET    /tasks/:id          - Fetch single task (protected)
PUT    /tasks/:id          - Update task (protected)
PATCH  /tasks/:id          - Partially update task (protected)
DELETE /tasks/:id          - Delete task (protected)
```

---

## Frontend Setup

### 1. Authentication Context (`src/context/AuthContext.jsx`)

Manages global auth state using React Context API.

```javascript
// State:
// - user: { id, name, email } or null
// - token: JWT token or null
// - loading: boolean
// - error: error message or null

// Methods:
// - login(email, password) - authenticate user
// - signup(name, email, password, passwordConfirm) - register user
// - logout() - logout and cleanup
// - updateUser(data) - update user info
```

### 2. useAuth Hook (`src/hooks/useAuth.js`)

Custom hook to consume AuthContext.

```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, token, login, logout } = useAuth();
  
  if (!user) return <p>Not logged in</p>;
  return <p>Welcome, {user.name}!</p>;
}
```

### 3. Protected Routes (`src/components/ProtectedRoute.jsx`)

Wrapper component that redirects unauthenticated users to login.

```javascript
<ProtectedRoute>
  <TodoPage />
</ProtectedRoute>
```

### 4. API Client (`src/api.js`)

Automatically attaches JWT token to all requests.

```javascript
// Token is automatically read from localStorage
// and added as: Authorization: Bearer {token}

// All functions work seamlessly:
getTasks()      // Bearer token added automatically
createTask()    // Bearer token added automatically
updateTask()    // Bearer token added automatically
```

---

## User Interface

### Login Page (`src/pages/LoginPage.jsx`)

- Email and password fields
- "Remember me" checkbox (for future enhancement)
- Sign up link
- Loading state while authenticating
- Toast notifications for errors
- Redirect to /todo on successful login

**Flow:**
1. User enters email and password
2. Click "Sign In" button
3. Form validates input
4. API call to POST /auth/login
5. Token saved to localStorage
6. Navbar updates with user info
7. Redirect to /todo page

---

### Signup Page (`src/pages/SignupPage.jsx`)

- Name, email, password, password confirmation fields
- Field validation with helpful error messages
- Sign in link
- Loading state while registering
- Toast notifications for errors
- Redirect to /login on successful signup (or auto-login)

**Flow:**
1. User enters name, email, password
2. Confirm password matches
3. Click "Create Account" button
4. Form validates all fields
5. API call to POST /auth/signup
6. Token saved to localStorage
7. Auto-redirect to /todo

---

### Navbar Updates (`src/components/Navbar.jsx`)

**When Logged In:**
- Display user's name
- Show logout button
- Hide "Sign In" button

**When Logged Out:**
- Hide user name
- Hide logout button
- Show "Sign In" button (links to /login)

**Logout Behavior:**
1. Click "Logout" button
2. Clear token from localStorage
3. Update AuthContext (user = null)
4. Navbar updates
5. Redirect to /login

---

## Testing

### 1. Signup Test

```bash
# Start backend
npm run dev

# In terminal/Postman:
POST http://localhost:5000/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "passwordConfirm": "TestPassword123!"
}

# Expected Response:
# Status: 201 Created
# Body contains token
```

### 2. Login Test

```bash
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123!"
}

# Expected Response:
# Status: 200 OK
# Body contains token
```

### 3. Protected Route Test

```bash
# Without token (should fail)
GET http://localhost:5000/tasks

# With token (should succeed)
GET http://localhost:5000/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Expected Response (with token):
# Status: 200 OK
# Body contains tasks array
```

### 4. Frontend Flow Test

1. **Signup:**
   - Navigate to http://localhost:5173/signup
   - Fill in form
   - Click "Create Account"
   - Check localStorage for `authToken` key
   - Should redirect to /todo

2. **Todo Access:**
   - Verify tasks load successfully
   - Create, edit, delete tasks
   - All operations should work

3. **Logout:**
   - Click "Logout" button in navbar
   - Verify localStorage is cleared
   - Should redirect to /login
   - Accessing /todo without token should redirect to /login

---

## Error Handling

### Backend Errors

| Status | Error | Solution |
|--------|-------|----------|
| `400` | Missing required fields | Ensure all fields are provided |
| `400` | Validation error | Check field formats |
| `401` | Invalid credentials | Verify email/password are correct |
| `401` | Token expired | Re-login to get new token |
| `401` | No token provided | Include Authorization header |
| `409` | Email already registered | Use different email or login |
| `500` | Server error | Check server logs |

### Frontend Error Messages

- **Network Error**: "Failed to connect to server"
- **Invalid Credentials**: "Invalid email or password"
- **Email in Use**: "Email is already registered"
- **Validation**: Field-specific error messages
- **Token Expired**: "Your session has expired. Please login again"

---

## Security Best Practices

### Implemented

✅ **Password Hashing**: bcryptjs with 10 salt rounds  
✅ **JWT Tokens**: Signed with secret key, expiration set to 7 days  
✅ **Protected Routes**: Middleware checks token before allowing access  
✅ **CORS**: Only allows requests from CLIENT_URL  
✅ **Password Select**: Password field excluded from queries (select: false)  
✅ **Unique Email**: Database constraint prevents duplicate emails  
✅ **HTTP-Only Consideration**: Token stored in localStorage (consider HTTP-only cookies for prod)  

### Recommendations for Production

⚠️ **HTTPS Only**: Always use HTTPS in production  
⚠️ **Secure JWT_SECRET**: Use strong, randomly generated secret (32+ chars)  
⚠️ **HTTP-Only Cookies**: Consider storing token in HTTP-only cookies instead of localStorage  
⚠️ **CSRF Protection**: Add CSRF token for state-changing operations  
⚠️ **Rate Limiting**: Add rate limiting on auth endpoints  
⚠️ **Refresh Tokens**: Implement refresh tokens for better UX  
⚠️ **Token Rotation**: Rotate JWT_SECRET periodically  
⚠️ **Logging**: Log failed login attempts  
⚠️ **Email Verification**: Add email verification before account activation  

---

## File Structure

```
project-root/
├── models/
│   ├── User.js                 # User schema with password hashing
│   └── Task.js                 # Task schema
├── routes/
│   └── authRoutes.js           # /auth/signup, /auth/login, etc.
├── middleware/
│   └── auth.js                 # protect middleware
├── src/
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── hooks/
│   │   └── useAuth.js          # useAuth hook
│   ├── components/
│   │   ├── ProtectedRoute.jsx  # Protected route wrapper
│   │   └── Navbar.jsx          # Updated with user display + logout
│   ├── pages/
│   │   ├── LoginPage.jsx       # Login form
│   │   ├── SignupPage.jsx      # Signup form
│   │   └── TodoPage.jsx        # Protected todo list
│   ├── api.js                  # API client with auth headers
│   └── App.jsx                 # Routes + AuthProvider
├── server.js                   # Express server with protected routes
├── .env                        # Environment variables (not in git)
└── AUTH_IMPLEMENTATION.md      # This file
```

---

## Troubleshooting

### Issue: "Not authorized to access this route"

**Cause:** Missing or invalid token  
**Solution:** 
- Check localStorage for `authToken` key
- Ensure token is not expired
- Re-login to get new token

---

### Issue: Token not being sent with API requests

**Cause:** Token not in localStorage  
**Solution:**
- Check if login/signup was successful
- Verify localStorage has `authToken` key
- Check browser's Application tab → Storage → Local Storage

---

### Issue: CORS error when calling auth endpoints

**Cause:** CLIENT_URL not set correctly  
**Solution:**
- Verify `.env` has correct CLIENT_URL
- Restart backend server after changing .env
- Check that frontend URL matches CLIENT_URL

---

### Issue: Password hashing errors

**Cause:** bcryptjs not installed  
**Solution:**
```bash
npm install bcryptjs
```

---

### Issue: JWT errors

**Cause:** JWT_SECRET not set  
**Solution:**
- Add `JWT_SECRET` to `.env`
- Ensure it's a strong, random string
- Restart backend server

---

## Next Steps

1. **Email Verification**: Add email verification before account activation
2. **Password Reset**: Implement forgot password flow
3. **Refresh Tokens**: Add refresh token mechanism for better security
4. **OAuth Integration**: Add Google/GitHub login
5. **Rate Limiting**: Protect auth endpoints from brute force
6. **Logging**: Enhanced logging for security monitoring
7. **2FA**: Two-factor authentication (optional)
8. **Role-Based Access**: Different user roles (admin, user, etc.)

---

## References

- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Express Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Last Updated:** October 27, 2024  
**Status:** ✅ Complete - Ready for Testing

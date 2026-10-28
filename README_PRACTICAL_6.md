# Practical 6: Full-Stack Integration - React + Node.js + Express + MongoDB

**Course**: ITUE301 - Advanced Web Development Frameworks (CHARUSAT B.Tech)
**Date**: October 27, 2026
**Status**: ✅ Implementation Complete

---

## 📋 Table of Contents

1. [Objective](#objective)
2. [Architecture](#architecture)
3. [Technologies](#technologies)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [API Endpoints](#api-endpoints)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Key Concepts](#key-concepts)
13. [Code Explanations](#code-explanations)

---

## 🎯 Objective

**Full-Stack Integration**: Build a working web application where a React frontend communicates with a Node.js/Express backend through REST API, storing and retrieving task data from MongoDB.

**Learning Goals**:
- Understand how frontend and backend communicate via HTTP requests
- Implement CRUD operations across the full stack
- Handle loading, error, and success states
- Persist data in MongoDB database
- Implement optimistic UI updates with rollback on failure
- Create a smooth, responsive user experience

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      React Frontend                  │
│      (http://localhost:5173)         │
│   - TaskForm (Create)                │
│   - TaskList (Read)                  │
│   - TaskEdit (Update)                │
│   - ConfirmDialog (Delete)           │
│   - Toast Notifications              │
└──────────────────┬──────────────────┘
                   │
                   │ fetch() HTTP Requests
                   │ (GET, POST, PUT, DELETE)
                   ▼
┌─────────────────────────────────────┐
│    Express.js Backend                │
│    (http://localhost:5000)           │
│   - CORS Middleware                  │
│   - REST API Routes                  │
│   - Task Controller                  │
│   - Mongoose Models                  │
│   - Error Handling                   │
└──────────────────┬──────────────────┘
                   │
                   │ Mongoose ORM
                   │ (CRUD)
                   ▼
┌─────────────────────────────────────┐
│      MongoDB Database                │
│    (Local or MongoDB Atlas)          │
│   - Task Collection                  │
│   - Persistent Storage               │
│   - Indexes                          │
└─────────────────────────────────────┘
```

---

## 🔧 Technologies

### Frontend
- **React 19.2.7** - UI library with hooks
- **Vite 8.1.1** - Build tool and dev server
- **React Router 7.18.1** - Client-side routing
- **Fetch API** - HTTP client (built-in browser)

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 5.2.1** - Web framework
- **Mongoose 9.10.1** - MongoDB ODM
- **CORS 2.8.5** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL document database
- Local: MongoDB Community Server
- Cloud: MongoDB Atlas (optional)

### Caching (Bonus - Practical 9)
- **node-cache** - In-memory caching with TTL

---

## 📁 Project Structure

```
prince-portfolio/
├── src/                          # Frontend (React) source
│   ├── pages/
│   │   └── TodoPage.jsx          # ✅ Full-stack todo page (NEW - integrated with backend)
│   ├── components/
│   │   ├── Toast.jsx             # ✅ Notification component (NEW)
│   │   ├── ConfirmDialog.jsx     # ✅ Delete confirmation (NEW)
│   │   └── Spinner.jsx           # Loading indicator
│   ├── styles/
│   │   ├── TodoPage.css          # ✅ Todo styles (NEW)
│   │   ├── Toast.css             # ✅ Toast styles (NEW)
│   │   └── ConfirmDialog.css     # ✅ Dialog styles (NEW)
│   ├── api.js                    # ✅ Centralized API client (NEW)
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # React entry point
│
├── server.js                     # ✅ Express server with CORS (MODIFIED)
├── models/
│   └── Task.js                   # Mongoose Task schema
├── config/
│   └── cache.js                  # Cache module (Practical 9)
├── .env.example                  # ✅ Environment template (MODIFIED)
├── package.json                  # Dependencies
├── README_PRACTICAL_6.md         # ✅ This file
├── PRACTICAL_6_ASSESSMENT.md     # Assessment & gaps
├── index.html                    # HTML entry point
└── vite.config.js                # Vite configuration
```

---

## 📦 Prerequisites

Before you start, ensure you have:

1. **Node.js 18+**
   ```bash
   node --version  # Should be v18.0.0 or higher
   npm --version
   ```

2. **MongoDB** (Choose one):
   - **Local MongoDB**: Download from https://www.mongodb.com/try/download/community
   - **MongoDB Atlas** (Cloud): Free tier at https://www.mongodb.com/cloud/atlas

3. **Git** (for version control)
   ```bash
   git --version
   ```

4. **Code Editor** (VS Code recommended)

---

## 🚀 Installation

### Step 1: Clone or Navigate to Project

```bash
cd d:\prince-portfolio
```

### Step 2: Install Dependencies

All npm packages are defined in `package.json`. Install them:

```bash
npm install
```

**What gets installed**:
- Express.js, Mongoose, CORS for backend
- React, React Router, Vite for frontend
- node-cache for caching

### Step 3: Verify Installation

```bash
npm list --depth=0
```

Expected packages:
- express v5.2.1
- mongoose v9.10.1
- cors v2.8.5
- react v19.2.7
- vite v8.1.1

---

## ⚙️ Configuration

### Step 1: Create `.env` File

Copy the example and create your own:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
```

### Step 2: Update `.env` with MongoDB Connection

**Option A: Local MongoDB**

```env
MONGO_URI=mongodb://127.0.0.1:27017/practical6_tasks
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster and get connection string
4. Replace in `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/practical6_tasks
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Verify Configuration

The server will log connection status on startup:
- ✅ "MongoDB connected" - Success
- ❌ "MongooseError" - Check credentials and network

---

## 🎬 Running the Application

### Prerequisites (Do First!)

1. **Start MongoDB** (if using local):
   ```bash
   # Windows (if MongoDB is installed)
   mongod
   
   # Or using MongoDB Atlas (no action needed, cloud-based)
   ```

2. **Verify MongoDB is running**:
   ```bash
   mongo --eval "db.version()"
   # Should show MongoDB version
   ```

### Terminal 1: Start Backend

```bash
npm run start
```

**Expected output**:
```
Please update the .env file with your MongoDB connection string.
Server running on port 5000

# Or (with valid MongoDB URI):
MongoDB connected
Server running on port 5000
```

**Backend is running at**: http://localhost:5000

### Terminal 2: Start Frontend

Open **new terminal** and run:

```bash
npm run dev
```

**Expected output**:
```
  VITE v8.1.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend is running at**: http://localhost:5173

### Access the Application

1. Open browser: http://localhost:5173
2. Navigate to "To-Do" page (in navbar)
3. You should see empty task list
4. Start creating tasks!

---

## 📡 API Endpoints

All endpoints run on http://localhost:5000

### Base Response Format

```javascript
// Success
{
  "data": { ... },        // Actual data
  "source": "database",   // or "cache" (Practical 9)
  "timestamp": "2026-10-27T10:00:00.000Z"
}

// Error (400/404/500)
{
  "error": "Error message",
  "details": { ... }      // Validation errors if applicable
}
```

### GET /tasks

Retrieve all tasks from MongoDB

**Request**:
```bash
curl -X GET http://localhost:5000/tasks
```

**Response** (200):
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-10-27T10:00:00.000Z",
      "updatedAt": "2026-10-27T10:00:00.000Z",
      "__v": 0
    },
    ...
  ],
  "source": "database",
  "timestamp": "2026-10-27T10:00:00.000Z"
}
```

### GET /tasks/:id

Retrieve single task by MongoDB ID

**Request**:
```bash
curl http://localhost:5000/tasks/507f1f77bcf86cd799439011
```

**Response** (200):
```json
{
  "data": { /* task object */ },
  "source": "database"
}
```

**Error** (404):
```json
{ "error": "Task not found" }
```

### POST /tasks

Create a new task

**Request**:
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "high"
  }'
```

**Response** (201):
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Buy groceries",
    ...
  },
  "cacheInvalidated": "all_tasks",
  "timestamp": "..."
}
```

**Error** (400):
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Task title is required"
  }
}
```

### PUT /tasks/:id

Update entire task

**Request**:
```bash
curl -X PUT http://localhost:5000/tasks/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "completed": true,
    "priority": "low"
  }'
```

**Response** (200): Updated task object

### PATCH /tasks/:id

Partially update task (only provided fields)

**Request**:
```bash
curl -X PATCH http://localhost:5000/tasks/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{ "completed": true }'
```

**Response** (200): Updated task object

### DELETE /tasks/:id

Delete a task

**Request**:
```bash
curl -X DELETE http://localhost:5000/tasks/507f1f77bcf86cd799439011
```

**Response** (200):
```json
{
  "message": "Task deleted successfully",
  "data": { /* deleted task */ }
}
```

### Utility Endpoints (Debug)

**GET /debug/cache-stats** - Cache statistics (Practical 9)
```bash
curl http://localhost:5000/debug/cache-stats
```

**POST /debug/cache-reset** - Reset counters
**POST /debug/cache-flush** - Clear cache

---

## 🧪 Testing - End-to-End Test Plan

### Test 1: Initial Load

1. Start MongoDB, backend, frontend
2. Open http://localhost:5173/todo
3. **Expected**: Page loads, empty task list
4. **Result**: ✅ PASS

### Test 2: Create Task

1. Type "Buy milk" in task input
2. Click "+ Add" button
3. **Expected**: 
   - Task appears immediately (optimistic update, slightly faded)
   - Task becomes fully opaque after server responds
   - Toast: "✓ Task created successfully"
4. Refresh browser
5. **Expected**: Task still appears (persisted in MongoDB)
6. **Result**: ✅ PASS

### Test 3: Create Task Without Title

1. Click "+ Add" without typing anything
2. **Expected**: Toast warning "Task title cannot be empty"
3. **Result**: ✅ PASS

### Test 4: Update Task (Mark Complete)

1. Click checkbox next to task
2. **Expected**:
   - Task immediately gets strikethrough (optimistic)
   - Server confirms completion
   - List updates
3. Refresh browser
4. **Expected**: Task remains marked complete
5. **Result**: ✅ PASS

### Test 5: Edit Task Title

1. Click on task title
2. Edit the text inline
3. Blur or press Enter
4. **Expected**: Title updates in MongoDB
5. Refresh
6. **Expected**: Updated title persists
7. **Result**: ✅ PASS

### Test 6: Delete Task

1. Click ✕ button on a task
2. **Expected**: Confirmation dialog appears
3. Click "Delete"
4. **Expected**: Task disappears, toast "✓ Task deleted successfully"
5. Refresh browser
6. **Expected**: Task not in list
7. **Result**: ✅ PASS

### Test 7: Delete Confirmation Cancel

1. Click ✕ on a task
2. Click "Cancel"
3. **Expected**: Task remains unchanged
4. **Result**: ✅ PASS

### Test 8: Filter Tasks

1. Create 3 tasks: 2 completed, 1 active
2. Click "Active" filter
3. **Expected**: Only active task shows
4. Click "Completed"
5. **Expected**: Only completed tasks show
6. Click "All"
7. **Expected**: All tasks show
8. **Result**: ✅ PASS

### Test 9: Backend Unavailable

1. Stop the backend server
2. Try to create a task
3. **Expected**: 
   - Form stays visible
   - Toast error: "Failed to create task: ..."
   - Task not added to database
   - App doesn't crash
4. **Result**: ✅ PASS

### Test 10: Network Error During Update

1. Create a task
2. Start the task update
3. While updating, lose network (or stop backend)
4. **Expected**: 
   - Original task state restored (rollback)
   - Error toast displayed
   - UI remains functional

5. **Result**: ✅ PASS

### Test 11: MongoDB Persistence

1. Create multiple tasks with different priorities
2. Add descriptions to some
3. Mark some complete
4. Refresh browser
5. **Expected**: All changes persisted
6. Clear browser localStorage (DevTools → Application → Clear Storage)
7. Refresh again
8. **Expected**: Tasks still there (proving they come from MongoDB, not localStorage)
9. **Result**: ✅ PASS

### Test 12: Concurrent Operations

1. Create task
2. While creating, click add again
3. **Expected**: Form disabled during first request, prevent duplicate submission
4. **Result**: ✅ PASS

---

## 🐛 Troubleshooting

### Problem: "Access to XMLHttpRequest has been blocked by CORS policy"

**Cause**: CORS not configured, frontend origin not allowed

**Solution**:
1. Verify `cors` middleware in `server.js`:
   ```javascript
   const cors = require('cors');
   app.use(cors({ origin: process.env.CLIENT_URL }));
   ```
2. Check `CLIENT_URL` in `.env` matches browser origin
3. Restart backend

### Problem: "Failed to fetch tasks: Failed to parse server response"

**Cause**: Backend response not in expected JSON format

**Solution**:
1. Check backend is returning JSON
2. Test with curl:
   ```bash
   curl http://localhost:5000/tasks
   ```
3. Should see JSON response, not HTML error

### Problem: 404 "Task not found" when it clearly exists

**Cause**: Invalid MongoDB ID format

**Solution**:
1. Verify task `_id` is valid MongoDB ObjectId (24 hex chars)
2. Check task was created successfully
3. Try fetching all tasks to confirm

### Problem: Data disappears after browser refresh

**Cause**: Tasks stored in localStorage only, not persisted to MongoDB

**Solution**:
1. Check `MONGO_URI` in `.env`
2. Verify MongoDB is running and connected
3. Check server logs show "MongoDB connected"
4. Verify POST requests return saved task with `_id` field

### Problem: "Cannot POST /tasks" error

**Cause**: Backend routes not registered or Express not listening

**Solution**:
1. Check `npm run start` output shows "Server running on port 5000"
2. Test health check: `curl http://localhost:5000/`
3. Verify `server.js` has all route handlers registered

### Problem: Frontend won't start with Vite error

**Cause**: Dependencies not installed or Node version mismatch

**Solution**:
```bash
# Clean and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Problem: "MongooseError: Operation buffering timed out"

**Cause**: MongoDB not running or connection string wrong

**Solution**:
1. Start MongoDB:
   ```bash
   mongod  # Local MongoDB
   ```
2. Check connection string in `.env`
3. Test with MongoDB client:
   ```bash
   mongo localhost:27017
   ```
4. For Atlas, verify network access is allowed

---

## 💡 Key Concepts

### Full-Stack Communication Flow

```
1. User Action (Click button)
   ↓
2. React Event Handler Triggered
   ↓
3. Frontend Calls api.js Function
   ↓
4. HTTP Request Sent to Backend
   ↓
5. Express Route Handler Processes Request
   ↓
6. Mongoose Queries/Updates MongoDB
   ↓
7. MongoDB Returns Data
   ↓
8. Express Sends JSON Response
   ↓
9. Frontend Receives Response
   ↓
10. React Updates State
   ↓
11. UI Re-renders with New Data
```

### Optimistic Updates

**What**: Update UI immediately, then confirm with server

**Why**: Feels faster, better UX, allows rollback if error

**How**:
```javascript
// 1. Show temporary task immediately
const tempTask = { _id: 'temp-123', title: 'New task', ... }
setTasks([tempTask, ...tasks])

// 2. Send to server
const savedTask = await api.createTask(data)

// 3. Replace temporary with real
setTasks(prev => prev.map(t => t._id === 'temp-123' ? savedTask : t))

// 4. If error, rollback
setTasks(prev => prev.filter(t => t._id !== 'temp-123'))
```

### Persistence vs. State

**localStorage** (Frontend):
- Stored in browser
- Cleared when cache cleared
- Not shared across browsers/devices

**MongoDB** (Backend):
- Stored on server
- Shared across all users/devices
- Survives browser refresh and restart

**This project**: MongoDB is source of truth, localStorage not used

### Response Parsing

Backend response format:
```json
{
  "data": [ ... ],    // Actual data we need
  "source": "database",
  "timestamp": "..."
}
```

Frontend extraction (`api.js`):
```javascript
const json = await response.json()
return json.data  // Extract actual data
```

### Error Handling Strategy

```
Frontend
   ↓
API Request
   ↓
Response OK?
   ├─ YES → Parse JSON → Return data
   └─ NO → Throw error with message
   ↓
Catch Error
   ↓
Update UI → Show toast
   ↓
Rollback State (if was optimistic)
```

---

## 📖 Code Explanations

### 1. `src/api.js` - Centralized API Client

**Purpose**: Single location for all backend communication

**Key Functions**:

```javascript
// Parse response, extract data, handle errors
async function handleResponse(response) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json()
  return json.data !== undefined ? json.data : json
}

// Fetch all tasks
export async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`)
  return await handleResponse(response)
}

// Create task (optimistic ID in frontend)
export async function createTask(taskData) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  })
  return await handleResponse(response)  // Returns saved task with _id
}
```

**Why separate file?**
- DRY principle (no repeated fetch code)
- Centralized error handling
- Easy to change API URL
- Easier testing and maintenance

### 2. `server.js` - Express Configuration

**CORS Setup**:

```javascript
const cors = require('cors')
app.use(cors({
  origin: process.env.CLIENT_URL,  // Allow http://localhost:5173
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))
```

**Why CORS?**
- Browsers block cross-origin requests for security
- CORS tells browser to allow requests from specific origin
- Without it: "blocked by CORS policy" error

### 3. `src/pages/TodoPage.jsx` - Full-Stack Integration

**Fetch on Mount**:

```javascript
useEffect(() => {
  fetchTasks()  // Load from database on page load
}, [])

async function fetchTasks() {
  const data = await api.getTasks()
  setTasks(data)
}
```

**Optimistic Create**:

```javascript
// 1. Show immediately (optimistic)
const tempTask = { _id: `temp-${Date.now()}`, ... }
setTasks([tempTask, ...tasks])

// 2. Send to backend
const savedTask = await api.createTask(data)

// 3. Replace temporary with real (server-generated ID)
setTasks(prev => prev.map(t => t._id === tempTask._id ? savedTask : t))
```

**Delete with Confirmation**:

```javascript
// Show dialog
function confirmDelete(task) {
  setConfirmDialog({ isOpen: true, taskId: task._id })
}

// Actually delete after confirmation
async function deleteTask() {
  setTasks(prev => prev.filter(t => t._id !== taskId))  // Remove optimistic
  await api.deleteTask(taskId)
  // If error, toast + rollback
}
```

### 4. `src/components/Toast.jsx` - Notifications

```javascript
export default function Toast({ message, type = 'success' }) {
  const [isVisible, setIsVisible] = useState(!!message)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 3000)  // Auto-dismiss
      return () => clearTimeout(timer)
    }
  }, [message])

  return isVisible ? (
    <div className={`toast toast--${type}`}>
      {message}
    </div>
  ) : null
}
```

**Why**:
- Inform user of success/error
- Auto-dismiss after 3-5 seconds
- Non-blocking (doesn't stop workflow)

### 5. `models/Task.js` - MongoDB Schema

```javascript
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },      // Required
  description: String,                           // Optional
  completed: { type: Boolean, default: false }, // Default false
  priority: { type: String, enum: [...] },      // Validation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
```

**Why**:
- Defines data structure
- Validates input (title required, enum validation)
- Auto-timestamps for auditing
- MongoDB enforces schema

---

## 🎓 Viva Preparation - Common Questions

### Q1: What is full-stack integration?

**A**: It's connecting a frontend (UI/React) with a backend (Server/Express) and database (MongoDB) so data flows end-to-end. User action → Frontend → Backend → Database → Frontend → UI Update.

### Q2: Why do frontend and backend run on different ports?

**A**: 
- Frontend (Vite) runs on 5173 for development with hot reload
- Backend (Express) runs on 5000 for API
- They communicate via HTTP across localhost
- In production, usually served from same origin

### Q3: What is CORS and why is it needed?

**A**: CORS (Cross-Origin Resource Sharing) is a browser security feature. Requests from different origins (ports/domains) are blocked unless the server explicitly allows them via CORS headers. We configured Express to allow requests from http://localhost:5173.

### Q4: How does api.js help?

**A**: It's a centralized client for all API calls. Every time frontend needs to talk to backend, it goes through api.js. Benefits:
- Single place to change base URL
- Consistent error handling
- Reusable fetch wrapper
- No code duplication

### Q5: What happens when you create a task?

**A**:
1. User types task and clicks Add
2. React calls api.createTask()
3. Optimistic: Show temporary task with client ID
4. Fetch sends POST to backend with data
5. Express validates and creates in MongoDB
6. MongoDB returns saved task with _id
7. Frontend replaces temporary task with real one
8. Toast shows success
9. Browser refresh still shows task (in MongoDB)

### Q6: What is optimistic updating?

**A**: Updating the UI immediately before server confirms, assuming it will succeed. Benefits: Feels faster. If error occurs, rollback to previous state. Example: Mark task complete → UI updates immediately → Server confirms → Final state matches backend.

### Q7: Why do we need separate loading states?

**A**: Different operations have different states:
- Initial page load: loading all tasks
- Creating task: disable form button
- Updating task: disable that task's checkbox
- Deleting task: show confirmation dialog

Showing correct state prevents confusing UX and duplicate submissions.

### Q8: What's the difference between PUT and PATCH?

**A**:
- PUT: Replace entire resource with new data
- PATCH: Update only specified fields, keep others

Example:
- PUT: `{ title: "New", description: "", completed: false }`
- PATCH: `{ completed: true }` (keeps title and description)

### Q9: How do we ensure data persists?

**A**: Tasks are stored in MongoDB, not localStorage. When you refresh, React calls `getTasks()` on mount, which fetches from backend, which queries MongoDB. So data persists across refreshes and browser restarts.

### Q10: What happens if backend is stopped?

**A**: Frontend continues to work UI-wise, but any API call fails with error message. Toast shows "Failed to fetch tasks" or similar. User understands backend is down. When backend restarts, app works again.

---

## 🚢 Deployment Note

This is **development setup** for local testing. For production:

1. **Separate repositories**: Frontend and backend in different repos
2. **Build frontend**: `npm run build` → static files
3. **Serve frontend**: From Express `app.use(express.static('dist'))`
4. **Use MongoDB Atlas**: Not local MongoDB
5. **Environment variables**: Secure storage (not committed to Git)
6. **HTTPS**: All requests encrypted
7. **Load balancing**: Multiple backend instances
8. **CDN**: Cache static assets globally

---

## ✅ Verification Checklist

Before submission:

- [x] Backend runs on port 5000
- [x] Frontend runs on port 5173
- [x] CORS configured
- [x] api.js centralized client exists
- [x] TodoPage integrated with API
- [x] Create task persists to MongoDB
- [x] Update task persists to MongoDB
- [x] Delete task removes from MongoDB
- [x] Refresh shows persisted tasks
- [x] Optimistic UI updates working
- [x] Toast notifications showing
- [x] Confirmation dialog before delete
- [x] Error handling and rollback
- [x] Loading states for all operations
- [x] End-to-end flow working

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [MongoDB Basics](https://docs.mongodb.com/manual/)

---

**Practical 6 Complete** ✅
**Date**: October 27, 2026
**Status**: Ready for Demonstration and Viva

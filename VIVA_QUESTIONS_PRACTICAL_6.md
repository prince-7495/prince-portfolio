# Practical 6 Viva Questions & Answers

**Course**: ITUE301 - Advanced Web Development Frameworks  
**Practical**: Full-Stack Integration (React + Node.js + Express + MongoDB)  
**Date**: October 27, 2026

This document contains likely viva questions with detailed, beginner-friendly answers based on the actual implementation.

---

## PART 1: Conceptual Questions

### Q1: What is full-stack integration?

**A**: Full-stack integration means connecting all layers of a web application:
- **Frontend** (React): User interface running in browser
- **Backend** (Express.js): Server that processes requests
- **Database** (MongoDB): Persistent data storage

Data flows: User → React → HTTP Request → Express → MongoDB → HTTP Response → React → UI Update

### Q2: What is the purpose of this practical?

**A**: To learn how to build a complete working application where:
1. Frontend (React) communicates with backend via HTTP
2. Backend (Express) handles API requests and database operations
3. MongoDB stores data persistently
4. User can create, read, update, delete tasks
5. All changes persist across browser refreshes

### Q3: Why do frontend and backend run on different ports?

**A**: 
- **Port 5173 (Frontend)**: Vite dev server serves React with hot reload
- **Port 5000 (Backend)**: Express server listens for API requests
- Different ports isolate concerns and allow independent development
- In production, usually served from same origin, but backend and frontend can scale independently

### Q4: What is HTTP and how is it used here?

**A**: HTTP (HyperText Transfer Protocol) is how browsers and servers communicate:
- **Client (React)** sends HTTP requests to **Server (Express)**
- **Server** processes and responds with JSON data
- **Common HTTP methods**:
  - GET: Retrieve data (fetch all tasks)
  - POST: Create new data (add task)
  - PUT: Replace entire resource (update task)
  - PATCH: Partial update (mark complete)
  - DELETE: Remove data (delete task)

### Q5: What is an API and why do we need one?

**A**: API (Application Programming Interface) is the contract between frontend and backend:
- Defines endpoints (URLs) for operations
- Specifies request format (JSON) and response format
- Example: `POST /tasks` creates a new task
- **Why**: Frontend doesn't directly access database, ensures security and consistency

### Q6: What is REST API?

**A**: REST (Representational State Transfer) is an architectural style for APIs:
- Uses HTTP methods (GET, POST, PUT, DELETE) for operations
- Resources identified by URLs (`/tasks`, `/tasks/:id`)
- Stateless: each request is independent
- Responses are JSON (structured data format)
- Example: `DELETE /tasks/123` deletes task with ID 123

---

## PART 2: Frontend (React) Questions

### Q7: How does the React frontend fetch data from backend?

**A**:
1. When page loads, `useEffect` hook triggers
2. Calls `api.getTasks()` function
3. `getTasks()` sends HTTP GET request to `http://localhost:5000/tasks`
4. Express server responds with JSON array of tasks
5. React receives response and updates state with `setTasks(data)`
6. UI re-renders showing fetched tasks

### Q8: What is the purpose of api.js?

**A**: `api.js` is a centralized API client module:
- **Single location** for all backend communication
- **Exports functions**: `getTasks()`, `createTask()`, `updateTask()`, `deleteTask()`
- **Handles**:
  - Constructing HTTP requests
  - Parsing JSON responses
  - Extracting actual data from response (`response.data`)
  - Error handling with meaningful messages
- **Benefits**:
  - If API URL changes, update only one place
  - Code reuse (no repeated fetch calls)
  - Consistent error handling
  - Easy testing

### Q9: What is React state and how is it used?

**A**: React state is data that can change and trigger UI re-renders:
- Created with `useState` hook: `const [tasks, setTasks] = useState([])`
- `tasks`: current value
- `setTasks`: function to update value
- When state changes, component re-renders with new data
- Example: When task is created, `setTasks([newTask, ...tasks])` updates UI

### Q10: What are React hooks?

**A**: Hooks are functions that "hook into" React features:
- **useState**: Manage state
- **useEffect**: Run code on component mount/update
- **useCallback**: Memoize functions
- **useRef**: Access DOM elements directly

Example:
```javascript
useEffect(() => {
  fetchTasks()  // Runs when component mounts
}, [])         // Empty dependency array = run once
```

### Q11: How does useEffect work?

**A**: `useEffect` runs side effects after render:
```javascript
useEffect(() => {
  console.log('Component mounted or dependencies changed')
}, [dependency])
```
- **No dependencies**: Runs after every render
- **Empty []**: Runs once when component mounts
- **With dependencies [tasks]**: Runs when `tasks` changes

In this project, we use it to:
- Fetch tasks on component mount
- Sync active count to parent when tasks change

### Q12: What is "optimistic updating"?

**A**: Update UI immediately, assume server will succeed, rollback if it fails:

```javascript
// Step 1: Show task immediately (optimistic)
setTasks([tempTask, ...tasks])

// Step 2: Send to server
const savedTask = await api.createTask(data)

// Step 3: Replace temporary with real (server response)
setTasks(prev => prev.map(t => t._id === tempTask._id ? savedTask : t))

// Step 4: If error, rollback
setTasks(prev => prev.filter(t => t._id !== tempTask._id))
```

**Why**: UI feels responsive, rollback protects against errors

### Q13: What is conditional rendering in React?

**A**: Show/hide components based on conditions:
```javascript
{loading ? <Spinner /> : <TaskList />}
{tasks.length === 0 ? <EmptyMessage /> : <List />}
{updatingId === task._id && <DisabledStyle />}
```

In this project:
- Show loading spinner while fetching tasks
- Show empty message if no tasks
- Show disabled button while creating task

### Q14: How do toast notifications work?

**A**: Toast component displays temporary messages:
```javascript
<Toast
  message="Task created!"
  type="success"
  duration={3000}
  onDismiss={() => setToast({...})}
/>
```

Features:
- Appears at bottom-right
- Auto-dismisses after 3-5 seconds
- Different colors for success (green) / error (red)
- User can manually close
- Doesn't block workflow

### Q15: What is a confirmation dialog and why is it needed?

**A**: Modal dialog confirming destructive action (delete):
```javascript
<ConfirmDialog
  isOpen={showConfirm}
  message="Delete this task?"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>
```

**Why**:
- Prevents accidental deletion
- User must explicitly confirm
- Displays task name so they know what will be deleted

---

## PART 3: Backend (Express.js) Questions

### Q16: What is Express.js?

**A**: Express.js is a web framework for Node.js:
- Simplifies building web servers
- Handles HTTP requests and responses
- Provides routing (connecting URLs to handlers)
- Middleware support (processing pipeline)
- Lightweight compared to other frameworks

### Q17: What is CORS and why is it configured?

**A**: CORS (Cross-Origin Resource Sharing) is a security feature:
- Browsers block requests to different origins (port/domain) by default
- Configuration tells browser to allow requests from specific origin
- In our case, allow React (port 5173) to request from Express (port 5000)

```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
```

**Without CORS**: "Access to XMLHttpRequest blocked by CORS policy" error

### Q18: How are API endpoints structured in Express?

**A**: Endpoints are defined as routes:
```javascript
app.get('/tasks', (req, res) => { ... })          // GET all
app.get('/tasks/:id', (req, res) => { ... })      // GET one
app.post('/tasks', (req, res) => { ... })         // CREATE
app.put('/tasks/:id', (req, res) => { ... })      // FULL UPDATE
app.patch('/tasks/:id', (req, res) => { ... })    // PARTIAL UPDATE
app.delete('/tasks/:id', (req, res) => { ... })   // DELETE
```

- URL path + HTTP method identifies endpoint
- `req`: Request object (contains data from frontend)
- `res`: Response object (send data back)

### Q19: What is the difference between PUT and PATCH?

**A**:
- **PUT `/tasks/:id`**: Replace entire task with new data
  - Frontend must send all fields
  - Any missing fields are cleared
- **PATCH `/tasks/:id`**: Update only specified fields
  - Frontend can send partial data
  - Other fields remain unchanged

**Example**:
```javascript
// PUT: Must include all fields
{ "title": "New title", "completed": true, "priority": "high" }

// PATCH: Can be partial
{ "completed": true }  // Only mark complete, keep title/priority
```

### Q20: How does error handling work in Express?

**A**: Errors are caught and handled consistently:
```javascript
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', ... })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid MongoDB ObjectId' })
  }
  res.status(500).json({ error: 'Internal server error' })
})
```

**Why**:
- Prevents server crashes
- Sends consistent error format to frontend
- Frontend can show meaningful error messages

### Q21: What is middleware in Express?

**A**: Middleware is functions that process requests:
```javascript
app.use(cors(...))              // CORS middleware
app.use(express.json())         // Parse JSON middleware
app.use(asyncHandler)           // Error catching middleware
app.use(errorHandler)           // Error handling middleware
```

**Execution order**:
1. Request comes in
2. Passes through middleware in order
3. Reaches route handler
4. Response sent back

### Q22: What does express.json() middleware do?

**A**: Parses JSON request bodies:
```javascript
// Without middleware: req.body is undefined
// With middleware: req.body is parsed JSON object

POST /tasks with body: { "title": "Buy milk" }
// Express automatically parses to JavaScript object
req.body = { title: "Buy milk" }
```

### Q23: What is async/await in Express routes?

**A**: Async/await handles asynchronous database operations:
```javascript
app.post('/tasks', async (req, res) => {
  const task = await Task.create(req.body)  // Wait for DB
  res.json(task)
})
```

**Why**: MongoDB queries are async, must wait for result

---

## PART 4: Database (MongoDB & Mongoose) Questions

### Q24: What is MongoDB?

**A**: MongoDB is a NoSQL database:
- Stores data as JSON documents (not tables)
- Flexible schema (fields can vary between documents)
- Scalable and easy to work with
- Collections (like tables) contain documents (like rows)

**Example task document**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Buy milk",
  "description": "From Dairy",
  "completed": false,
  "createdAt": "2026-10-27T10:00:00Z"
}
```

### Q25: What is Mongoose?

**A**: Mongoose is an ODM (Object Data Model) for MongoDB:
- Provides schema validation (defines structure)
- Simplifies queries
- Adds methods to interact with database
- Bridges Node.js and MongoDB

**Benefits over raw MongoDB driver**:
- Enforces schema (prevents bad data)
- Automatic timestamps
- Validation rules
- Middleware hooks

### Q26: What is a Mongoose schema?

**A**: Schema defines the structure of documents:
```javascript
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true  // Must have value
  },
  completed: {
    type: Boolean,
    default: false  // Default value
  },
  createdAt: {
    type: Date,
    default: Date.now  // Auto-set to current time
  }
})
```

**Validation**: Prevents invalid data from being saved

### Q27: What is MongoDB persistence?

**A**: Data persists (stays) in MongoDB across:
- Browser refreshes
- Server restarts
- Application restarts
- Across different devices

**How it works**:
1. Task saved to MongoDB
2. Data written to disk
3. Browser closes, app restarts
4. New React session calls `getTasks()`
5. Express queries MongoDB
6. Old tasks returned and displayed

### Q28: How is a task created and saved to MongoDB?

**A**:
1. React sends POST request with task data
2. Express receives request
3. Mongoose validates data against schema
4. If valid, calls `Task.create(data)`
5. MongoDB inserts document with auto-generated `_id`
6. MongoDB returns saved document
7. Express sends back to frontend with `_id`
8. React stores this `_id` for future updates

---

## PART 5: Integration & Full-Stack Flow Questions

### Q29: Explain the complete flow when creating a task

**A**:
1. **User Action**: Types "Buy milk" and clicks Add button
2. **Frontend (React)**:
   - Validates input (title not empty)
   - Creates temporary task with `_id: 'temp-123'`
   - Updates state: `setTasks([tempTask, ...tasks])`
   - UI immediately shows faded temporary task
3. **HTTP Request**:
   - Calls `api.createTask({ title: 'Buy milk' })`
   - Sends POST request to `http://localhost:5000/tasks`
   - Headers: `Content-Type: application/json`
   - Body: `{ "title": "Buy milk" }`
4. **Backend (Express)**:
   - Route handler receives request
   - Extracts `req.body`
   - Calls `Task.create(req.body)`
5. **Database (MongoDB)**:
   - Validates against schema
   - Generates unique `_id`
   - Saves document
   - Returns saved task with `_id`
6. **Backend (Express)**:
   - Receives task from MongoDB
   - Sends HTTP response with status 201
   - Returns: `{ data: { _id: "507f...", title: "Buy milk", ... } }`
   - Invalidates cache
7. **Frontend (React)**:
   - Receives response with saved task
   - Extracts `_id` from response
   - Replaces temporary task with real one
   - UI becomes fully opaque
   - Toast shows "Task created successfully"
8. **User Experience**: Task appeared immediately, became real after ~200ms

### Q30: Explain the complete flow when updating a task

**A**:
1. **User Action**: Clicks task title, edits text, presses Enter
2. **Frontend**:
   - Calls `editTitle(taskId, "New title")`
   - Optimistic: immediately updates state
   - UI shows new title
   - Sets `updatingId` to disable further edits
3. **HTTP Request**:
   - Sends PATCH request to `/tasks/{id}`
   - Body: `{ "title": "New title" }`
4. **Backend**:
   - Route handler finds task by ID
   - Calls `Task.findByIdAndUpdate(id, data, { new: true })`
   - Updates MongoDB document
   - Invalidates both list cache and task cache
5. **Database**:
   - Finds document by `_id`
   - Updates `title` field
   - Updates `updatedAt` timestamp
   - Returns updated document
6. **Frontend**:
   - Receives updated task from server
   - Updates state with server response
   - Clears `updatingId`
   - Toast shows "Task updated"
7. **Persistence**: Refresh browser still shows new title

### Q31: Explain the complete flow when deleting a task

**A**:
1. **User Action**: Clicks ✕ button on task
2. **Frontend**:
   - Shows confirmation dialog
   - Displays task title: "Delete 'Buy milk'?"
   - "Cancel" or "Delete" buttons
3. **User Confirms**: Clicks Delete
4. **Frontend**:
   - Optimistic remove: `setTasks(prev => prev.filter(t => t._id !== id))`
   - UI immediately hides task
   - Set `deletingId` (disable interactions)
5. **HTTP Request**:
   - Sends DELETE request to `/tasks/{id}`
6. **Backend**:
   - Route handler calls `Task.findByIdAndDelete(id)`
   - Removes document from MongoDB
   - Invalidates caches
   - Returns success response
7. **Database**:
   - Deletes document
8. **Frontend**:
   - Receives success response
   - Task remains removed (already removed optimistic)
   - Toast shows "Task deleted successfully"
9. **Persistence**: Refresh browser, task is gone

### Q32: How does error handling work end-to-end?

**A**: If something fails:
1. **Frontend sends request**
2. **Backend operation fails**:
   - Mongoose validation error (title required)
   - MongoDB error (connection lost)
   - Express error handler catches it
   - Sends error response with status 400/500
3. **Frontend receives error**:
   - `handleResponse()` checks `response.ok`
   - If not ok, throws error with message
   - Catch block catches error
   - For optimistic update, rollback state
   - Toast shows error message
4. **UI remains consistent**: User knows what failed and can retry

---

## PART 6: Practical Troubleshooting Questions

### Q33: "Access to XMLHttpRequest has been blocked by CORS policy" - Why?

**A**: Browser security prevents cross-origin requests by default.
- Frontend (localhost:5173) trying to request from backend (localhost:5000)
- Different ports = different origins
- Browser blocks request unless server sends CORS headers

**Solution**: Add CORS middleware to Express:
```javascript
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5173' }))
```

### Q34: Tasks disappear after refresh - What's wrong?

**A**: Tasks were using localStorage only, not MongoDB.
- **Fix**: Ensure:
  - `MONGO_URI` is correct in `.env`
  - MongoDB is running: `mongod`
  - Backend logging "MongoDB connected"
  - API POST request includes `_id` in response
  - Frontend stores task with real `_id`, not temporary one

### Q35: "Failed to fetch: TypeError - fetch is not a function"

**A**: Usually means fetch syntax error or network issue.
- **Check**:
  - Backend is running: `npm run start`
  - Backend port is 5000
  - API base URL in `api.js` is correct
  - Network tab shows requests being sent
  - Browser console for CORS errors

### Q36: "Task not found" for valid task ID

**A**: MongoDB ID format might be invalid.
- MongoDB IDs must be 24 hex characters: `507f1f77bcf86cd799439011`
- Check if frontend is using temporary ID like `temp-123`
- After server responds, replace with real `_id`

---

## PART 7: Architecture & Design Questions

### Q37: Why is state stored in React, not backend?

**A**: Different purposes:
- **React State**: Temporary UI state (form input, loading flags, which task is editing)
- **MongoDB**: Persistent data (tasks, their content)
- React state lost on refresh (fine for temporary)
- MongoDB persists (fine for permanent)

### Q38: Why are there different loading states?

**A**: Different operations need different UI feedback:
- **Initial load**: Show spinner over entire list
- **Creating task**: Disable form button
- **Updating task**: Disable that task's checkbox
- **Deleting task**: Show confirmation

**Why**: Clear feedback prevents confusion and duplicate submissions

### Q39: Why do we separate api.js from components?

**A**: Separation of concerns:
- **api.js**: How to communicate with backend (HTTP details)
- **Components**: What to show and how (React/UI)
- **Benefits**:
  - Easy to mock for testing
  - Backend URL in one place
  - Reusable across multiple components
  - Clear responsibility

### Q40: What happens in production?

**A**: Different setup than development:
- Frontend built to static files
- Both served from same origin (no CORS needed)
- Backend and frontend can scale independently
- Database on secure cloud (MongoDB Atlas)
- Environment variables for secrets
- HTTPS encryption
- Multiple servers with load balancer

---

## PART 8: Practical Submission Checklist

When preparing for viva, ensure:

- [x] Can explain full-stack flow end-to-end
- [x] Can run frontend and backend together
- [x] Can create/update/delete tasks via UI
- [x] Tasks persist after browser refresh
- [x] Can show MongoDB database with saved tasks
- [x] Can explain api.js and how it works
- [x] Can explain React state and hooks
- [x] Can explain Express routes and middleware
- [x] Can explain MongoDB schema and persistence
- [x] Can troubleshoot CORS errors
- [x] Can show network tab with HTTP requests
- [x] Can explain optimistic updates
- [x] Can explain error handling

---

## PART 9: Exam Tips

1. **Understand flow**: Practice explaining create/update/delete flows
2. **Know your code**: Can you explain every important line?
3. **Show practical work**: Be ready to run app and demonstrate
4. **Handle questions**: Don't memorize, understand concepts
5. **Admit unknowns**: "I'm not sure, but..." is better than guessing
6. **Ask for clarification**: If question unclear, ask before answering
7. **Show debugging**: Open DevTools, show network tab, browser console
8. **Relate to project**: Answer using your actual code/implementation

---

**Total Questions**: 40+
**Difficulty**: Beginner-friendly with technical depth
**Format**: Based on actual implementation

Good luck! 🚀

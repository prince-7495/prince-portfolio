const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');
const cacheModule = require('./config/cache');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const mongoUri = process.env.MONGO_URI;

if (!mongoUri || mongoUri === 'YOUR_MONGODB_CONNECTION_STRING') {
  console.log('Please update the .env file with your MongoDB connection string.');
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/', (req, res) => {
  res.json({ message: 'Task API is running' });
});

app.get('/tasks', asyncHandler(async (req, res) => {
  // Check cache first using cache-aside pattern
  let tasks = cacheModule.get('all_tasks');
  
  if (tasks !== undefined) {
    // Cache hit - return cached data
    return res.status(200).json({
      data: tasks,
      source: 'cache',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Cache miss - fetch from MongoDB
  tasks = await Task.find();
  
  // Store in cache for future requests (even if empty array)
  cacheModule.set('all_tasks', tasks);
  
  // Return with cache miss indication
  res.status(200).json({
    data: tasks,
    source: 'database',
    timestamp: new Date().toISOString(),
  });
}));

app.post('/tasks', asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  
  // Invalidate the all_tasks cache on successful creation
  cacheModule.del('all_tasks');
  
  res.status(201).json({
    data: task,
    cacheInvalidated: 'all_tasks',
    timestamp: new Date().toISOString(),
  });
}));

app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const cacheKey = `task_${req.params.id}`;
  
  // Check cache first
  let task = cacheModule.get(cacheKey);
  
  if (task !== undefined) {
    // Cache hit - return cached data
    return res.status(200).json({
      data: task,
      source: 'cache',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Cache miss - fetch from MongoDB
  task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Store in cache for future requests
  cacheModule.set(cacheKey, task);
  
  // Return with cache miss indication
  res.status(200).json({
    data: task,
    source: 'database',
    timestamp: new Date().toISOString(),
  });
}));

app.put('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Invalidate both all_tasks and individual task cache on successful update
  cacheModule.del('all_tasks');
  cacheModule.del(`task_${req.params.id}`);
  
  res.status(200).json({
    data: task,
    cacheInvalidated: ['all_tasks', `task_${req.params.id}`],
    timestamp: new Date().toISOString(),
  });
}));

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Invalidate both all_tasks and individual task cache on successful update
  cacheModule.del('all_tasks');
  cacheModule.del(`task_${req.params.id}`);
  
  res.status(200).json({
    data: task,
    cacheInvalidated: ['all_tasks', `task_${req.params.id}`],
    timestamp: new Date().toISOString(),
  });
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Invalidate both all_tasks and individual task cache on successful deletion
  cacheModule.del('all_tasks');
  cacheModule.del(`task_${req.params.id}`);
  
  res.status(200).json({
    message: 'Task deleted successfully',
    data: task,
    cacheInvalidated: ['all_tasks', `task_${req.params.id}`],
    timestamp: new Date().toISOString(),
  });
}));

// Debug endpoint: Cache statistics
app.get('/debug/cache-stats', (req, res) => {
  const stats = cacheModule.getStats();
  res.status(200).json({
    message: 'Cache Statistics',
    cacheStats: stats,
    ttlSeconds: 60,
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint: Reset cache statistics (for testing purposes)
app.post('/debug/cache-reset', (req, res) => {
  cacheModule.resetStats();
  res.status(200).json({
    message: 'Cache statistics reset',
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint: Clear all cache (for testing purposes)
app.post('/debug/cache-flush', (req, res) => {
  cacheModule.flush();
  res.status(200).json({
    message: 'Cache flushed',
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const details = {};

    Object.keys(err.errors).forEach((field) => {
      details[field] = err.errors[field].message;
    });

    return res.status(400).json({
      error: 'Validation failed',
      details,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid MongoDB ObjectId' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');

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
  const tasks = await Task.find();
  res.status(200).json(tasks);
}));

app.post('/tasks', asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
}));

app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
}));

app.put('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
}));

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({
    message: 'Task deleted successfully',
    task,
  });
}));

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

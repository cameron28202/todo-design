const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());

// in memory data store
let tasks = [
  {
    id: 1,
    description: "Create TAMU Formula Electric to-do app",
    completed: false
  }
];

// Routes
// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { description } = req.body;
  
  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Task description is required' });
  }
  
  const newTask = {
    id: Date.now(),
    description,
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH a task
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { completed } = req.body;
  
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed: completed !== undefined ? completed : tasks[taskIndex].completed
  };
  
  res.json(tasks[taskIndex]);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== taskId);
  
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json({ message: 'Task deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
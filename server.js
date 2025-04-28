const express = require('express');
const path = require('path');
const db = require('./db'); // import the database connection
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await db.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// GET a specific todo
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await db.getTodoById(req.params.id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo' });
  }
});

// POST a new todo
app.post('/todos', async (req, res) => {
  try {
    const { name, priority = 'low', isFun = 'true' } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newTodo = await db.addTodo(name, priority, isFun);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding todo' });
  }
});

// DELETE a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const success = await db.deleteTodo(req.params.id);
    if (success) {
      res.json({ message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

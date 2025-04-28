const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

// Initialize the table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT DEFAULT 'low',
      isFun TEXT DEFAULT 'true',
      isComplete BOOLEAN DEFAULT 0
    )
  `);
});

// Fetch all todos
function getAllTodos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Fetch one todo
function getTodoById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Add a new todo
function addTodo(name, priority, isFun) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO todos (name, priority, isFun) VALUES (?, ?, ?)',
      [name, priority, isFun],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name, priority, isFun, isComplete: 0 });
      }
    );
  });
}

// Delete a todo
function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
}

module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  deleteTodo
};


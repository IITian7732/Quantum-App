const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
      // Create users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        avatar TEXT,
        streak INTEGER DEFAULT 0,
        lastActive TEXT
      )`);

      // Create sessions table
      db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        title TEXT,
        tag TEXT,
        duration INTEGER,
        points INTEGER,
        completedAt TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // Create quotes table
      db.run(`CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        text TEXT,
        author TEXT,
        savedAt TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // Ensure a default user exists for this single-user app demo
      db.get("SELECT * FROM users LIMIT 1", (err, row) => {
        if (!row) {
          db.run(`INSERT INTO users (name, email, avatar, streak) VALUES (?, ?, ?, ?)`, 
            ['New Explorer', 'explorer@quantum.app', '/profile.webp', 0]);
        }
      });
    });
  }
});

module.exports = db;

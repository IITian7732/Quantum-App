const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DEFAULT_USER_ID = 1; // Simplify to single-user mode for now

// 1. Get User Profile & Stats
app.get('/api/user', (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [DEFAULT_USER_ID], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.put('/api/user', (req, res) => {
  const { name, email } = req.body;
  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, DEFAULT_USER_ID], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, name, email });
  });
});

// 2. Get Progress Stats
app.get('/api/progress', (req, res) => {
  db.all("SELECT * FROM sessions WHERE userId = ? ORDER BY completedAt DESC", [DEFAULT_USER_ID], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const totalMinutes = rows.reduce((acc, curr) => acc + curr.duration, 0);
    const totalPoints = rows.reduce((acc, curr) => acc + curr.points, 0);
    const sessionsDone = rows.length;
    
    // Group by category
    const categoryCounts = {
      'MEDITATION': 0,
      'FOCUS': 0,
      'BREATHE': 0,
      'BREAK': 0
    };
    rows.forEach(r => {
      if (categoryCounts[r.tag] !== undefined) categoryCounts[r.tag]++;
    });

    res.json({
      totalMinutes,
      totalPoints,
      sessionsDone,
      recentSessions: rows.slice(0, 3), // return last 3
      allSessions: rows,
      categoryCounts
    });
  });
});

// 3. Complete a Session
app.post('/api/sessions', (req, res) => {
  const { title, tag, duration, points } = req.body;
  const completedAt = new Date().toISOString();
  
  db.run(`INSERT INTO sessions (userId, title, tag, duration, points, completedAt) VALUES (?, ?, ?, ?, ?, ?)`, 
    [DEFAULT_USER_ID, title, tag, duration, points, completedAt], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Update streak and last active logic can be simplified here
      db.run("UPDATE users SET lastActive = ? WHERE id = ?", [completedAt, DEFAULT_USER_ID]);

      res.json({ id: this.lastID, title, tag, duration, points, completedAt });
  });
});

// 4. Get Saved Quotes
app.get('/api/quotes', (req, res) => {
  db.all("SELECT * FROM quotes WHERE userId = ? ORDER BY savedAt DESC", [DEFAULT_USER_ID], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 5. Save Quote
app.post('/api/quotes', (req, res) => {
  const { text, author } = req.body;
  const savedAt = new Date().toISOString();
  db.run(`INSERT INTO quotes (userId, text, author, savedAt) VALUES (?, ?, ?, ?)`, 
    [DEFAULT_USER_ID, text, author, savedAt], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, text, author, savedAt });
  });
});

// 6. Delete Quote
app.delete('/api/quotes/:id', (req, res) => {
  db.run("DELETE FROM quotes WHERE id = ? AND userId = ?", [req.params.id, DEFAULT_USER_ID], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

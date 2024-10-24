// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./beeAdoptions.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create the table for bee adoptions
db.run(`CREATE TABLE IF NOT EXISTS adoptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  beehiveName TEXT
)`);

// Route to get all adoptions
app.get('/api/adoptions', (req, res) => {
  db.all('SELECT * FROM adoptions', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Route to add a new adoption
app.post('/api/adoptions', (req, res) => {
  const { name, email, beehiveName } = req.body;
  db.run(`INSERT INTO adoptions (name, email, beehiveName) VALUES (?, ?, ?)`, [name, email, beehiveName], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, name, email, beehiveName });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

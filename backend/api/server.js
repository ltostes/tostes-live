// backend/server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// API test route (e.g., '/api/bananas')
app.get('/api/bananas', (req, res) => {
  res.json({ message: 'Bananas are great!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

module.exports = app;
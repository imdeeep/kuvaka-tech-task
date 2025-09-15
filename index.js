require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api.routes');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Scoring Engine is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
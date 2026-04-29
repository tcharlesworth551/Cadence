const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const tradesRouter = require('./routes/trades');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Cadence API is running',
      database: 'Connected successfully'
    });
  } catch (err) {
    res.json({ 
      message: 'Cadence API is running',
      database: 'Connection failed',
      error: err.message
    });
  }
});

app.use('/api/trades', tradesRouter);

app.listen(PORT, () => {
  console.log(`Cadence backend running on port ${PORT}`);
});
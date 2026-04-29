const express = require('express');
const router = express.Router();
const pool = require('../db');

// Log a new trade
router.post('/', async (req, res) => {
  const { user_id, pair, direction, outcome, emotion, screenshot_url, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO trades 
        (user_id, pair, direction, outcome, emotion, screenshot_url, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [user_id, pair, direction, outcome, emotion, screenshot_url, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all trades for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM trades 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trade stats for a user
router.get('/:user_id/stats', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_trades,
        SUM(CASE WHEN outcome = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN outcome = 'loss' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN outcome = 'breakeven' THEN 1 ELSE 0 END) as breakevens,
        ROUND(
          SUM(CASE WHEN outcome = 'win' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1
        ) as win_rate
       FROM trades 
       WHERE user_id = $1`,
      [user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
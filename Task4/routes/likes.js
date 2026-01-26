const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/* LIKE POST */
router.post('/', async (req, res) => {
  const { user_id, post_id } = req.body;

  await pool.query(
    'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
    [user_id, post_id]
  );

  res.json({ message: 'Post liked' });
});

/* UNLIKE POST */
router.delete('/', async (req, res) => {
  const { user_id, post_id } = req.body;

  await pool.query(
    'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
    [user_id, post_id]
  );

  res.json({ message: 'Like removed' });
});

module.exports = router;

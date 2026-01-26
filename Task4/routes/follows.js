const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/* FOLLOW USER */
router.post('/', async (req, res) => {
  const { follower_id, following_id } = req.body;

  if (follower_id === following_id) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  await pool.query(
    'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
    [follower_id, following_id]
  );

  res.json({ message: 'User followed' });
});

/* UNFOLLOW USER */
router.delete('/', async (req, res) => {
  const { follower_id, following_id } = req.body;

  await pool.query(
    'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
    [follower_id, following_id]
  );

  res.json({ message: 'Unfollowed successfully' });
});

module.exports = router;

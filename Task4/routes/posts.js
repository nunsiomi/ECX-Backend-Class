const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/* CREATE POST */
router.post('/', async (req, res) => {
  const { user_id, content } = req.body;

  const result = await pool.query(
    'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
    [user_id, content]
  );

  res.json(result.rows[0]);
});

/* GET ALL POSTS WITH AUTHOR (JOIN) */
router.get('/', async (req, res) => {
  const result = await pool.query(`
    SELECT p.id, p.content, u.username
    FROM posts p
    JOIN users u ON p.user_id = u.id
  `);

  res.json(result.rows);
});

/* GET SINGLE POST */
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM posts WHERE id = $1',
    [req.params.id]
  );

  res.json(result.rows[0]);
});

module.exports = router;

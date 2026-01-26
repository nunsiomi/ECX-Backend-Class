const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/* ADD COMMENT */
router.post('/', async (req, res) => {
  const { post_id, user_id, content } = req.body;

  const result = await pool.query(
    'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
    [post_id, user_id, content]
  );

  res.json(result.rows[0]);
});

/* GET COMMENTS FOR A POST (JOIN) */
router.get('/post/:id', async (req, res) => {
  const result = await pool.query(`
    SELECT c.content, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
  `, [req.params.id]);

  res.json(result.rows);
});

module.exports = router;

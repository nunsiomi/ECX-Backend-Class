// index.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // parse JSON bodies

// ====================
// PostgreSQL connection
// ====================
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'socialmedia',
  password: '123456',  // your password
  port: 5432
});

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error', err);
  } else {
    console.log('PostgreSQL connected at:', res.rows[0].now);
  }
});

// ====================
// Make pool accessible in routes via app.locals
// ====================
app.locals.pool = pool;

// ====================
// Import routes
// ====================
const userRoutes = require('./routes/users');
// Similarly, if you have these files later, you can uncomment them
// const postRoutes = require('./routes/posts');
// const commentRoutes = require('./routes/comments');
// const likeRoutes = require('./routes/likes');
// const followRoutes = require('./routes/follows');

app.use('/users', userRoutes);
// app.use('/posts', postRoutes);
// app.use('/comments', commentRoutes);
// app.use('/likes', likeRoutes);
// app.use('/follows', followRoutes);

// ====================
// Root route
// ====================
app.get('/', (req, res) => {
  res.send('Welcome to Social Media API!');
});

// ====================
// Start server
// ====================
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

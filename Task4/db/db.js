// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           // your postgres username
  host: 'localhost',          // usually localhost
  database: 'socialmedia',    // your database name
  password: '123456',  // make sure this is correct
  port: 5432                  // default postgres port
});

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Database connection error', err));

module.exports = pool;

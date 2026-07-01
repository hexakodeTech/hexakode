require('dotenv').config();
const pg = require('pg');
const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
});
pool.query('SELECT id, title, featured, status, slug FROM "portfolio_projects"', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
  pool.end();
});

require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log(res.rows.map(r => r.table_name));
  await client.end();
}
run();

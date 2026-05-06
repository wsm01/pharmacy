require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
});
client.connect()
    .then(() => client.query("ALTER TABLE sale_history ADD COLUMN total_price NUMERIC(10, 2) DEFAULT 0, ADD COLUMN sold_by VARCHAR(255) DEFAULT 'Unknown'"))
    .then(() => {
        console.log('Migration successful');
        process.exit(0);
    })
    .catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });

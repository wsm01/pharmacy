require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupFeedbackDB() {
    try {
        await client.connect();
        console.log('Connected to Postgres.');

        await client.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                username VARCHAR(255),
                category VARCHAR(50),
                subject VARCHAR(255),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Checked/Created feedback table.');

    } catch (err) {
        console.error('Error creating feedback table:', err);
    } finally {
        await client.end();
    }
}

setupFeedbackDB();

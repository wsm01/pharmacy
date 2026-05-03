require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupDB() {
    try {
        await client.connect();
        console.log('Connected to Postgres.');

        // 1. Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email VARCHAR(255),
                display_name VARCHAR(255)
            );
        `);
        console.log('Checked/Created users table.');

        // 2. Create medicines table
        await client.query(`
            CREATE TABLE IF NOT EXISTS medicines (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2),
                expiry_date DATE,
                prescription BOOLEAN DEFAULT FALSE,
                stock INTEGER DEFAULT 0
            );
        `);
        console.log('Checked/Created medicines table.');

        // 3. Create sale_history table
        await client.query(`
            CREATE TABLE IF NOT EXISTS sale_history (
                id SERIAL PRIMARY KEY,
                buyer_name VARCHAR(255),
                medicine_name VARCHAR(255),
                quantity INTEGER,
                sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Checked/Created sale_history table.');

        // 4. Create pharmacy_details table
        await client.query(`
            CREATE TABLE IF NOT EXISTS pharmacy_details (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                address TEXT,
                contact_number VARCHAR(50)
            );
        `);
        console.log('Checked/Created pharmacy_details table.');

        // Initialize pharmacy_details with an empty row if it doesn't exist
        const result = await client.query('SELECT COUNT(*) FROM pharmacy_details');
        if (parseInt(result.rows[0].count) === 0) {
            await client.query("INSERT INTO pharmacy_details (name, address, contact_number) VALUES ('', '', '')");
            console.log('Inserted default empty pharmacy details row.');
        }

        // 5. Create feedback table
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

        console.log('Database setup complete. All tables are ready! 🚀');
    } catch (err) {
        console.error('Error setting up DB:', err);
    } finally {
        await client.end();
    }
}

setupDB();


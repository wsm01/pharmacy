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

        // Create pharmacy_details table
        await client.query(`
            CREATE TABLE IF NOT EXISTS pharmacy_details (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                address TEXT,
                contact_number VARCHAR(50)
            );
        `);
        console.log('Checked/Created pharmacy_details table.');

        // Initialize with an empty row if it doesn't exist
        const result = await client.query('SELECT COUNT(*) FROM pharmacy_details');
        if (parseInt(result.rows[0].count) === 0) {
            await client.query("INSERT INTO pharmacy_details (name, address, contact_number) VALUES ('', '', '')");
            console.log('Inserted default empty pharmacy details row.');
        }

        // Alter users table safely
        // Add email
        try {
            await client.query('ALTER TABLE users ADD COLUMN email VARCHAR(255);');
            console.log('Added email column to users table.');
        } catch (e) {
            if (e.code === '42701') console.log('email column already exists.');
            else throw e;
        }

        // Add display_name
        try {
            await client.query('ALTER TABLE users ADD COLUMN display_name VARCHAR(255);');
            console.log('Added display_name column to users table.');
        } catch (e) {
            if (e.code === '42701') console.log('display_name column already exists.');
            else throw e;
        }

        console.log('Database setup complete.');
    } catch (err) {
        console.error('Error setting up DB:', err);
    } finally {
        await client.end();
    }
}

setupDB();

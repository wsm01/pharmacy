import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg'; // Import the client class
import express, { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // Import the req handler

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

app.use(express.json());
app.use(cors());        // after const app = express();


// 1. Tell the Driver how to find your Kitchen (Postgres)
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD, // Safely pulled from .env!
    port: parseInt(process.env.DB_PORT || '5432'),
});

// 2. Connect to the Sea of Data
client.connect()
    .then(() => console.log('Connected to Postgres! 🚀'))
    .catch(err => console.error('Connection error', err.stack));


app.get('/', (req, res) => {
    res.send('Welcome to the Pharmacy API!');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Scramble the password! 
        // The number 10 is the "Salt Rounds" (how hard it is to crack)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Save the USERNAME and the HASHED password to Postgres
        const result = await client.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(400).json({ message: "User not found" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            // Give them a "Wristband" (Token) that lasts for 1 hour
            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

            // Send the token back to the browser
            res.json({ message: "Login successful!", token: token });
        } else {
            res.status(400).json({ message: "Wrong password!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});

const authenticateToken = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer TOKEN"

    if (!token) return res.status(401).send("Please login first");

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).send("Session expired, login again");
        req.user = user;
        next(); // Let them pass!
    });
};

app.use(authenticateToken);
// view medicine

app.get('/medicines', async (req, res) => {
    const result = await client.query('SELECT * FROM medicines');
    res.json(result.rows); // Send the data to the browser
});


app.post('/add-medicine', async (req, res) => { //listen to add-medicine
    const { name, description, price, expiry_date, prescription, stock } = req.body;

    try {
        const result = await client.query(
            `INSERT INTO medicines (name, description, price,expiry_date,prescription,stock)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, description, price, expiry_date, prescription, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Error creating medicine");
    }
});

//search medicine by id
app.put('/medicines/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, expiry_date, prescription, stock } = req.body;

    try {
        const result = await client.query(
            `UPDATE medicines
       SET name = $1,
           description = $2,
           price = $3,
           expiry_date = $4,
           prescription = $5,
           stock = $6
       WHERE id = $7
       RETURNING *`,
            [name, description, price, expiry_date, prescription, stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Medicine not found");
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).send("Error updating medicine");
    }
});

app.post('/sell-medicine', async (req, res) => {
    const { name, med, quantity } = req.body;
    try {
        await client.query(
            'UPDATE medicines SET stock = stock - $1 WHERE name = $2',
            [quantity, med]);

        const result = await client.query(
            `INSERT INTO sale_history (buyer_name, medicine_name, quantity)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, med, quantity]
        );

        res.status(201).json({ message: "Sale successful!", data: result.rows[0] });
    } catch (err) {
        res.status(500).send("Error processing sale");
    }

});


// delete medicine
app.delete('/medicines/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query(
            'DELETE FROM medicines WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Medicine not found");
        }

        res.json({ message: "Medicine deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting medicine");
    }
});


// --- Settings API Endpoints ---

// Pharmacy Details
app.get('/pharmacy-details', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM pharmacy_details LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        res.status(500).send("Error fetching pharmacy details");
    }
});

app.post('/pharmacy-details', async (req, res) => {
    const { name, address, contact_number } = req.body;
    try {
        const result = await client.query(
            'UPDATE pharmacy_details SET name = $1, address = $2, contact_number = $3 RETURNING *',
            [name, address, contact_number]
        );
        res.json({ message: "Pharmacy details updated successfully", data: result.rows[0] });
    } catch (err) {
        res.status(500).send("Error updating pharmacy details");
    }
});

// User Profile
app.get('/user-profile', async (req: any, res) => {
    try {
        // req.user comes from authenticateToken
        const result = await client.query('SELECT id, username, email, display_name FROM users WHERE id = $1', [req.user.userId]);
        if (result.rows.length === 0) return res.status(404).send("User not found");
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Error fetching user profile");
    }
});

app.put('/user-profile', async (req: any, res) => {
    const { email, display_name } = req.body;
    try {
        const result = await client.query(
            'UPDATE users SET email = $1, display_name = $2 WHERE id = $3 RETURNING id, username, email, display_name',
            [email, display_name, req.user.userId]
        );
        res.json({ message: "Profile updated successfully", data: result.rows[0] });
    } catch (err) {
        res.status(500).send("Error updating user profile");
    }
});

// Change Password
app.put('/user-password', async (req: any, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const result = await client.query('SELECT password_hash FROM users WHERE id = $1', [req.user.userId]);
        if (result.rows.length === 0) return res.status(404).send("User not found");
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });
        
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedNewPassword, req.user.userId]);
        
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).send("Error updating password");
    }
});

// Feedback
app.post('/feedback', async (req: any, res) => {
    const { category, subject, description } = req.body;
    try {
        const result = await client.query('SELECT username FROM users WHERE id = $1', [req.user.userId]);
        const username = result.rows[0]?.username || 'Unknown';

        await client.query(
            'INSERT INTO feedback (user_id, username, category, subject, description) VALUES ($1, $2, $3, $4, $5)',
            [req.user.userId, username, category, subject, description]
        );
        res.json({ message: "Feedback submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error submitting feedback");
    }
});

// Sales History for Export
app.get('/sales-history', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM sale_history ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Error fetching sales history");
    }
});

export { app };

/*app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});*/

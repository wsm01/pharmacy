# Pharmacy Management System

A full-stack application for managing pharmacy inventory, sales, and user profiles.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd pharmacy-backend
```

### 2. Setup the Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a file named `.env` in the root directory.
   - Copy the contents from `.env.example` into `.env`.
   - Update the `DB_PASSWORD` and other variables with your local PostgreSQL credentials.

3. **Initialize the Database:**
   - Ensure PostgreSQL is running.
   - Create a database named `pharmacy_db` (or whatever you named it in `.env`).
   - Run the setup script to create all tables:
     ```bash
     node db-setup.js
     ```


4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`.

### 3. Setup the Frontend (Client)

1. **Navigate to the client folder:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will usually run on `http://localhost:5173` (or the port shown in your terminal).

## Tech Stack
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcryptjs
- **Frontend:** React, Vite, TypeScript

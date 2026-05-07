# 🏥 Pulse Pharmacy Management System

A professional, enterprise-grade Pharmacy Management System built with a modern full-stack architecture. This application is designed to streamline pharmacy operations, including secure inventory management, localized point-of-sale terminals, and advanced barcode scanning.

## 🌟 Key Features
- **Secure Authentication**: JWT-based security with password encryption.
- **Inventory Control**: Real-time stock tracking with "Low Stock" visual alerts.
- **QR/Barcode Terminal**: Integrated scanning for UPC, EAN, and GS1 DataMatrix codes.
- **Multi-lingual Support**: Fully localized in **English, French, and Arabic**.
- **Admin Analytics**: Comprehensive dashboard for revenue tracking and sales history.
- **Modern UI**: High-performance Glassmorphism design with **Dark Mode** support.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Environment Configuration
Create a file named `.env` in the root directory and add your PostgreSQL credentials:
```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=pharmacy_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=pulse_pharmacy_secret_2026
```

### 3. Database Initialization (The "Magic" Step)
Follow these steps to set up the database and populate it with 15 real medicines and barcodes for immediate testing:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Initialize Tables:**
   ```bash
   node db-setup.js
   ```
3. **Seed Demo Data:**
   ```bash
   # This is crucial to see the "Inventory" and "Scanner" in action!
   node seed-medicines.js
   ```

### 4. Running the Project
**Start the Backend:**
```bash
# In the root directory
npm run dev
```

**Start the Frontend:**
```bash
# In the /client directory
cd client
npm install
npm run dev
```

---

## 🔐 Evaluation Access (Default Admin)
Once the database is seeded, use these credentials to access the full system:
- **Username**: `admin`
- **Password**: `123456`

## 📸 How to Test Scanning
1. Go to the **Scan Medicine** tab.
2. Either use a webcam or click **"Choose File"** to upload a barcode image.
3. For a quick test, use the code `123` (assigned to Paracetamol 500mg in the demo data).

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, TypeScript, Vanilla CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Scanning**: html5-qrcode
- **Security**: Bcryptjs, JSONWebToken
- **I18n**: Custom Localization Engine

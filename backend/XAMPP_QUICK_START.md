# XAMPP Quick Start Guide

## ⚡ Quick Setup (5 Steps)

### 1. Start XAMPP
- Open **XAMPP Control Panel**
- Click **Start** for **MySQL** (and Apache if you want phpMyAdmin)

### 2. Create Database
- Go to: **http://localhost/phpmyadmin**
- Click **"New"** → Database name: `africa_db` → **Create**
- Click **"SQL"** tab → Paste SQL from `backend/config/dbSchema.sql` → **Go**

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Create .env File
Create `backend/.env` with this content:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=africa_db
DB_PORT=3306

JWT_SECRET=change_this_to_random_string
JWT_EXPIRE=7d
```
**Important**: Leave `DB_PASSWORD` empty (blank) for XAMPP default!

### 5. Start Server
```bash
npm run dev
```

Server runs on: **http://localhost:5000**

## 🧪 Test It

### Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

## 👤 Create Admin User

**Method 1: Using Script**
```bash
node config/createAdmin.js
```

**Method 2: Via phpMyAdmin**
1. Register a user through API
2. Go to phpMyAdmin → `africa_db` → `users` table
3. Find your user → Edit → Change `role` to `admin` → Save

## ❌ Common Issues

**"Access denied"**
- MySQL not running in XAMPP
- `DB_PASSWORD` should be empty (not `""`)

**"Unknown database"**
- Create `africa_db` in phpMyAdmin first

**"Can't connect"**
- Check MySQL is running (green in XAMPP)
- Verify port 3306

---

📖 **Full Guide**: See `SETUP_XAMPP.md` for detailed instructions


# Backend Setup Guide for XAMPP

## XAMPP Default Configuration
- **MySQL Host**: `localhost`
- **MySQL Port**: `3306`
- **MySQL Username**: `root`
- **MySQL Password**: (empty/blank)
- **phpMyAdmin**: http://localhost/phpmyadmin

## Quick Start with XAMPP

### Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
2. **Start Apache** (optional, for phpMyAdmin)
3. **Start MySQL** (required for database)

### Step 2: Create Database via phpMyAdmin

1. **Open phpMyAdmin**: http://localhost/phpmyadmin
2. **Click "New"** in the left sidebar
3. **Database name**: `africa_db`
4. **Collation**: `utf8mb4_general_ci`
5. **Click "Create"**

### Step 3: Create Tables

**Option A: Using phpMyAdmin SQL Tab**
1. Select `africa_db` database
2. Click **"SQL"** tab
3. Copy and paste the SQL from `backend/config/dbSchema.sql`
4. Click **"Go"**

**Option B: Using Command Line**
```bash
# Navigate to backend folder
cd backend

# Run SQL file (password is empty for XAMPP default)
mysql -u root -p < config/dbSchema.sql
# When prompted for password, just press Enter (empty password)
```

**Option C: Manual SQL in phpMyAdmin**
```sql
USE africa_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 5: Configure Environment Variables

1. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** (it should look like this for XAMPP):
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=africa_db
   DB_PORT=3306
   
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   ```

   **Important**: Leave `DB_PASSWORD` empty (blank) for XAMPP default!

### Step 6: Create Admin User

**Option A: Using the script**
```bash
node config/createAdmin.js
```
Enter:
- Username: `admin`
- Email: `admin@africa.com`
- Password: `admin123` (or your choice)

**Option B: Using phpMyAdmin**
1. Go to phpMyAdmin → `africa_db` → `users` table
2. Click **"Insert"** tab
3. Fill in:
   - `username`: `admin`
   - `email`: `admin@africa.com`
   - `password`: (use bcrypt hash - see below)
   - `role`: `admin`

**To generate password hash:**
```bash
# In Node.js console or create a quick script
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

**Option C: Register then update role**
1. Start the server: `npm run dev`
2. Register a user via API
3. In phpMyAdmin, update the user's role to `admin`:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
   ```

### Step 7: Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5000**

## Testing the API

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Or use Postman/Thunder Client:
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Body** (JSON):
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- **Solution**: Check if MySQL is running in XAMPP Control Panel
- Make sure `DB_PASSWORD` in `.env` is empty (not `""` or `null`, just blank)

### "Unknown database 'africa_db'"
- **Solution**: Create the database in phpMyAdmin first (Step 2)

### "Can't connect to MySQL server"
- **Solution**: 
  1. Check XAMPP Control Panel - MySQL must be running (green)
  2. Verify port 3306 is not blocked
  3. Check `DB_HOST` in `.env` is `localhost`

### Port 5000 already in use
- **Solution**: Change `PORT` in `.env` to another port (e.g., `5001`)

### Module not found errors
- **Solution**: Run `npm install` again in the `backend` folder

## XAMPP File Locations

- **XAMPP Installation**: Usually `C:\xampp\`
- **MySQL Data**: `C:\xampp\mysql\data\`
- **phpMyAdmin**: `C:\xampp\phpMyAdmin\` or http://localhost/phpmyadmin

## Next Steps

1. ✅ Database setup complete
2. ✅ Backend server running
3. ⏭️ Test API endpoints
4. ⏭️ Connect React frontend to backend
5. ⏭️ Add CRUD operations

---

**Note**: For production deployment, change the default MySQL password and use strong JWT_SECRET!


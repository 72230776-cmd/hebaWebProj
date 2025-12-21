# Backend Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up MySQL Database

1. **Start MySQL Server** (if not running)

2. **Create Database and Tables:**
   ```bash
   mysql -u root -p < config/dbSchema.sql
   ```
   
   Or manually:
   - Open MySQL command line or MySQL Workbench
   - Run the SQL commands from `config/dbSchema.sql`

### Step 3: Configure Environment Variables

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your settings:**
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=africa_db
   
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   ```

### Step 4: Create Admin User

**Option A: Using the script (Recommended)**
```bash
node config/createAdmin.js
```

**Option B: Using SQL directly**
```sql
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@africa.com', '$2a$10$...', 'admin');
```
*Note: You need to hash the password using bcrypt first*

**Option C: Register through API, then update role**
1. Register a user through `/api/auth/register`
2. Update the role in database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
   ```

### Step 5: Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on: `http://localhost:5000`

## Testing the API

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route (Get Profile)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Ensure database `africa_db` exists

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

## Next Steps

1. ✅ Backend setup complete
2. ⏭️ Connect frontend to backend API
3. ⏭️ Add CRUD operations
4. ⏭️ Deploy to Render/Railway


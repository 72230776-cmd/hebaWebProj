# Backend API - Africa Website

## Overview
Node.js/Express backend with MySQL database for authentication (Login/Register) with Admin and User roles.

## Features
- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication
- ✅ Role-based Access (Admin/User)
- ✅ MySQL Database Integration

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
1. Make sure MySQL is installed and running
2. Create the database and tables:
   ```bash
   mysql -u root -p < config/dbSchema.sql
   ```
   Or manually run the SQL commands in `config/dbSchema.sql`

### 3. Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=africa_db
   JWT_SECRET=your_super_secret_jwt_key
   ```

### 4. Create Admin User
After setting up the database, you can create an admin user by:
- Registering through the API and manually updating the role in the database
- Or using a SQL script to insert an admin user

### 5. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2025-12-21T..."
    }
  }
}
```

## User Roles

- **admin**: Full access to all features
- **user**: Regular user access (default)

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MySQL connection
│   └── dbSchema.sql      # Database schema
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── authMiddleware.js  # JWT verification & role checks
├── models/
│   └── User.js           # User model
├── routes/
│   └── authRoutes.js     # Authentication routes
├── .env.example          # Environment variables template
├── package.json
├── README.md
└── server.js             # Main server file
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation
- SQL injection protection (using parameterized queries)

## Error Handling

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error message",
  "error": {} // Only in development mode
}
```


# Deployment Guide

This guide explains how to deploy the Africa Website application to production.

## Architecture

- **Frontend**: React app deployed to GitHub Pages
- **Backend**: Node.js/Express API deployed to Render/Railway
- **Database**: MySQL (can use Render's MySQL, Railway's MySQL, or external service)

## Prerequisites

1. GitHub account with repository access
2. Render or Railway account (for backend hosting)
3. MySQL database (provided by hosting service or external)

## Step 1: Deploy Backend to Render/Railway

### Option A: Render (Recommended)

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `africa-website-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying only backend folder)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=africa_db
   DB_PORT=3306
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   FRONTEND_URL=https://72230776-cmd.github.io
   ```

6. Create MySQL Database on Render:
   - Go to "New +" → "PostgreSQL" (or MySQL if available)
   - Note the connection details
   - Update environment variables with database credentials

7. Deploy and note the backend URL (e.g., `https://africa-website-backend.onrender.com`)

### Option B: Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add MySQL service
5. Configure environment variables (same as Render)
6. Deploy and note the backend URL

## Step 2: Set Up Database

1. SSH into your server or use database management tool
2. Run the database setup:
   ```bash
   node backend/setupDatabase.js
   ```
   Or manually run `backend/config/dbSchema.sql`

## Step 3: Configure Frontend

1. Update `frontend/src/config/api.js` or set environment variable:
   ```bash
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

2. Update GitHub Secrets:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add secret: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

## Step 4: Deploy Frontend to GitHub Pages

### Automatic Deployment (GitHub Actions)

1. The workflow file `.github/workflows/deploy-frontend.yml` is already created
2. Go to repository Settings → Pages
3. Set source to "GitHub Actions"
4. Push to `main` branch - deployment will trigger automatically

### Manual Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm install
   REACT_APP_API_URL=https://your-backend-url.onrender.com npm run build
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json`:
   ```json
   "homepage": "https://72230776-cmd.github.io/hebaWebProj",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Step 5: Update CORS in Backend

The backend CORS is already configured to allow GitHub Pages origin. If your frontend URL is different, update `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://72230776-cmd.github.io',
  'https://your-custom-domain.com'
];
```

## Step 6: Verify Deployment

1. Frontend: Visit `https://72230776-cmd.github.io/hebaWebProj`
2. Backend: Test API endpoint `https://your-backend-url.onrender.com`
3. Test login/register functionality
4. Test admin panel (if logged in as admin)

## Troubleshooting

### Frontend can't connect to backend
- Check CORS configuration in backend
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for errors

### Database connection errors
- Verify database credentials in environment variables
- Check if database is accessible from hosting service
- Ensure database is created and tables are set up

### Authentication not working
- Verify JWT_SECRET is set in backend
- Check cookie settings (httpOnly, sameSite, secure)
- Ensure CORS allows credentials

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=10000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=africa_db
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=https://72230776-cmd.github.io
```

### Frontend (GitHub Secrets)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Notes

- GitHub Pages serves static files only - backend must be on a separate service
- Free tier services may have cold starts (first request after inactivity is slow)
- Consider using a custom domain for production
- Keep environment variables secure - never commit `.env` files


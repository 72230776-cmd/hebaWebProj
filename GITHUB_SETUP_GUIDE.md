# GitHub Setup and Deployment Guide

## Step 1: Initialize Git Repository

### 1.1 Initialize Git in your project
```bash
git init
```

### 1.2 Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Create .gitignore File
✅ Already created - includes node_modules, .env files, build outputs, etc.

## Step 3: Create Initial Commit

### 3.1 Stage all files
```bash
git add .
```

### 3.2 Create initial commit
```bash
git commit -m "Initial commit: Project setup with React frontend"
```

## Step 4: Create GitHub Repository

### 4.1 Create a new repository on GitHub
1. Go to https://github.com/new
2. Repository name: `africa-full-website` (or your preferred name)
3. Description: "Full-stack web application for [your project description]"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 4.2 Connect local repository to GitHub
```bash
# Add remote origin (replace with your GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/africa-full-website.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Set Up Branching Strategy

### 5.1 Create development branch
```bash
git checkout -b develop
git push -u origin develop
```

### 5.2 Create feature branches for new features
```bash
git checkout -b feature/backend-setup
git checkout -b feature/authentication
git checkout -b feature/crud-operations
```

## Step 6: Commit History Best Practices

### Good Commit Messages
- Use clear, descriptive messages
- Start with a verb (Add, Fix, Update, Remove)
- Examples:
  - `Add: User authentication endpoints`
  - `Fix: Database connection issue`
  - `Update: README with setup instructions`
  - `Remove: Unused dependencies`

### Commit Frequently
- Commit after completing each feature or fix
- Don't wait until everything is done
- Small, frequent commits are better than large ones

## Step 7: Frontend Deployment (GitHub Pages)

### Option A: Using gh-pages package
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update package.json scripts:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy:
```bash
npm run deploy
```

### Option B: Using GitHub Actions
1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

2. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions

## Step 8: Backend Deployment (Render)

### 8.1 Prepare for Render Deployment
1. Create `render.yaml` in root (optional):
```yaml
services:
  - type: web
    name: africa-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
```

2. Ensure backend has proper start script in `package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 8.2 Deploy on Render
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" > "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: africa-backend
   - **Root Directory**: backend (if backend is in subfolder)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` (from your MySQL provider)
   - `PORT` (usually auto-assigned)
   - `JWT_SECRET` (for authentication)
7. Click "Create Web Service"

## Step 9: Backend Deployment (Railway - Alternative)

### 9.1 Deploy on Railway
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project" > "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in the Variables tab
6. Railway will auto-detect Node.js and deploy

## Step 10: Database Setup

### 10.1 MySQL Database Options
- **Free Tier Options**:
  - Render PostgreSQL (free tier)
  - Railway PostgreSQL (free tier)
  - PlanetScale MySQL (free tier)
  - Aiven MySQL (free tier)

### 10.2 Connection String Format
```
mysql://username:password@host:port/database
```

## Step 11: Environment Variables Setup

### 11.1 Create .env.example files
Create `.env.example` in root and backend:
```
# .env.example
REACT_APP_API_URL=http://localhost:5000
```

```
# backend/.env.example
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=africa_db
JWT_SECRET=your-secret-key
```

### 11.2 Never commit .env files
✅ Already in .gitignore

## Step 12: Continuous Integration (Optional but Recommended)

### 12.1 Add GitHub Actions for Testing
Create `.github/workflows/test.yml`:
```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Step 13: Project Documentation

### 13.1 Update README.md
- Add project description
- Add setup instructions
- Add screenshots
- Add API documentation

### 13.2 Create CONTRIBUTING.md (if group project)
Document how group members should contribute

## Checklist Before Submission

- [ ] Git repository initialized
- [ ] GitHub repository created and connected
- [ ] .gitignore file created and working
- [ ] README.md updated with all required information
- [ ] Multiple commits with clear commit messages
- [ ] Frontend deployed to GitHub Pages
- [ ] Backend deployed to Render/Railway
- [ ] Environment variables configured
- [ ] Database connected and working
- [ ] Screenshots added to README
- [ ] All code pushed to GitHub

## Common Git Commands Reference

```bash
# Check status
git status

# Add files
git add .
git add specific-file.js

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# View commit history
git log --oneline

# View remote repositories
git remote -v
```

## Troubleshooting

### If you get "fatal: not a git repository"
- Make sure you're in the project root directory
- Run `git init`

### If push is rejected
- Pull first: `git pull origin main --rebase`
- Then push again: `git push origin main`

### If you need to update remote URL
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/africa-full-website.git
```


# Africa Website - Full Stack Web Application

## Project Description

This is a full-stack web application built for [describe your project purpose here]. The project includes a React frontend and Node.js backend with MySQL database integration.

## Technologies Used

### Frontend
- React 18.2.0
- React Router DOM 6.22.1
- React Scripts 5.0.1

### Backend
- Node.js
- Express.js (to be added)
- MySQL

### Deployment
- GitHub Pages (Frontend)
- Render/Railway (Backend)

## Features

- [ ] User Authentication (Login/Signup)
- [ ] CRUD Operations
- [ ] Database Integration (MySQL)
- [ ] Responsive UI

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd africa_full_website
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Create a `.env` file in the backend directory
   - Add your database credentials and other environment variables

5. Set up the database:
   - Create a MySQL database
   - Run the database schema scripts

6. Start the development servers:
```bash
# Option 1: Use the startup scripts (recommended)
# Windows:
START_SERVERS.bat
# Or PowerShell:
.\START_SERVERS.ps1

# Option 2: Manual start
# Frontend (in one terminal)
cd frontend
npm start

# Backend (in another terminal)
cd backend
npm run dev
```

## Project Structure

```
africa_full_website/
├── frontend/              # React frontend application
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts (Auth, Cart)
│   │   └── styles/      # CSS styles
│   ├── package.json
│   └── node_modules/
├── backend/              # Node.js/Express API
│   ├── config/          # Database & admin config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   ├── setupDatabase.js # Database setup script
│   ├── package.json
│   └── node_modules/
├── START_SERVERS.bat     # Windows batch script to start both servers
├── START_SERVERS.ps1     # PowerShell script to start both servers
└── README.md
```

## Screenshots

[Add screenshots of your application here]

## Deployment

### Frontend (GitHub Pages)
1. Build the React app: 
```bash
cd frontend
npm run build
```
2. Deploy to GitHub Pages using GitHub Actions or gh-pages

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build and start commands
4. Deploy

## Database Schema

[Add your database schema description here]

## API Endpoints

[Add your API endpoints documentation here]

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information]

## Authors

- [Your Name/Group Members]

## Future Scope

[Add future improvements and features]


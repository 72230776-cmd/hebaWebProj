# Africa Website - Full Stack Web Application

## Project Description

This is a full-stack e-commerce web application for an African market/store. The project includes a React frontend deployed on GitHub Pages and a Node.js/Express backend deployed on Render with PostgreSQL database integration. The application features user authentication, product management, shopping cart, order processing, and an admin panel for managing products, users, orders, contacts, and bookings.

## Technologies Used

### Frontend
- React 18.2.0
- React Router DOM 6.22.1
- React Scripts 5.0.1

### Backend
- Node.js
- Express.js
- PostgreSQL (production) / MySQL (development support)
- JWT Authentication
- Resend (Email service)

### Deployment
- GitHub Pages (Frontend)
- Render/Railway (Backend)

## Features

- [x] **User Authentication** - Login/Register with JWT tokens and role-based access
- [x] **Product Management** - View products, add to cart, admin CRUD operations
- [x] **Shopping Cart** - Add/remove items, user-specific cart persistence
- [x] **Checkout & Orders** - Address management, order creation, order tracking
- [x] **Admin Panel** - Manage products, users (password change), orders, contacts, bookings
- [x] **Contact & Booking** - Contact form and appointment booking system
- [x] **Email Notifications** - Invoice and delivery confirmation emails via Resend
- [x] **Database Integration** - PostgreSQL/MySQL with automatic table creation
- [x] **Responsive UI** - Modern, card-based design with consistent styling

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

## Live Deployment

- **Frontend**: https://72230776-cmd.github.io/hebaWebProj
- **Backend API**: https://hebawebproj.onrender.com

## Screenshots

[Screenshots can be added here showing the homepage, products page, cart, checkout, admin panel, etc.]

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

The application uses the following main tables:
- **users** - User accounts with authentication (id, username, email, password_hash, role, is_active)
- **products** - Product catalog (id, name, price, description, image)
- **orders** - Customer orders (id, user_id, total_amount, shipping_cost, status, shipping_address)
- **order_items** - Order line items (id, order_id, product_id, quantity, price)
- **addresses** - User shipping addresses (id, user_id, full_name, street_address, city, state, zip_code, country, phone)
- **contacts** - Contact form submissions (id, name, email, message, created_at)
- **bookings** - Appointment bookings (id, name, phone, email, order_type, appointment_date, appointment_time, description)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)

### Orders
- `POST /api/checkout` - Create order
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/password` - Change user password (admin only)
- `GET /api/admin/contacts` - Get all contact submissions (admin only)
- `DELETE /api/admin/contacts/:id` - Delete contact (admin only)
- `GET /api/admin/bookings` - Get all bookings (admin only)
- `DELETE /api/admin/bookings/:id` - Delete booking (admin only)

### Contact & Booking
- `POST /api/contact` - Submit contact form
- `POST /api/booking` - Book appointment

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information]

## Authors

- Heba (72230776@students.liu.edu.lb)

## Future Scope

- Payment gateway integration
- Product image upload functionality
- User profile management
- Order tracking for customers
- Product reviews and ratings
- Email notifications for order status updates
- Advanced search and filtering
- Wishlist functionality


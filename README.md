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
git clone https://github.com/72230776-cmd/hebaWebProj.git
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
   - Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=africa_db
   DB_TYPE=mysql  # or 'postgres' for PostgreSQL
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key
   
   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=onboarding@resend.dev
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

5. Set up the database:
   - Create a MySQL database named `africa_db`
   - Run the database schema: `mysql -u root -p < backend/config/dbSchema.sql`
   - Or manually execute the SQL commands in `backend/config/dbSchema.sql`

6. Start the development servers:
```bash
# Frontend (in one terminal)
cd frontend
npm start

# Backend (in another terminal)
cd backend
npm run dev
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

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
│   └── build/            # Production build
├── backend/              # Node.js/Express API
│   ├── config/          # Database & admin config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Email service
│   ├── server.js         # Main server file
│   └── package.json
├── screenshots/          # Application screenshots
├── PROJECT_PRESENTATION.md  # Project presentation document
├── PROJECT_PRESENTATION.pdf # PDF version of presentation
├── PROJECT_COMPLIANCE_REPORT.md  # Compliance checklist
└── README.md             # This file
```

## Live Deployment

- **Frontend**: https://72230776-cmd.github.io/hebaWebProj
- **Backend API**: https://hebawebproj.onrender.com

## Screenshots

### Application Screenshots

1. **Homepage**
   <img src="screenshots/homepage.png" alt="Homepage" width="800"/>
   *Main landing page with hero section and navigation*

2. **Products Page**
   <img src="screenshots/products.png" alt="Products Page" width="800"/>
   *Product catalog displaying available items with images, descriptions, and prices*

3. **Shopping Cart**
   <img src="screenshots/cart.png" alt="Shopping Cart" width="800"/>
   *Shopping cart interface showing items, quantities, and order summary*

4. **Checkout Page**
   <img src="screenshots/checkout.png" alt="Checkout" width="800"/>
   *Checkout process with shipping address selection and order summary*

5. **Login/Register Page**
   <img src="screenshots/login.png" alt="Login/Register" width="800"/>
   *User authentication page with login and registration options*

6. **Admin Panel - Products Management**
   <img src="screenshots/admin-products.png" alt="Admin Products" width="800"/>
   *Admin interface for managing products with CRUD operations*

7. **Admin Panel - Orders Management**
   <img src="screenshots/admin-orders.png" alt="Admin Orders" width="800"/>
   *Admin view of all orders with status management and delivery tracking*

8. **Admin Panel - Users Management**
   <img src="screenshots/admin-users.png" alt="Admin Users" width="800"/>
   *Admin interface for viewing users and managing passwords*

### Email Notifications (Bonus Feature)

9. **Order Invoice Email**
   <img src="screenshots/email-invoice.png" alt="Order Invoice Email" width="800"/>
   *Automated invoice email sent when order is created*

10. **Order Delivered Email**
    <img src="screenshots/email-delivered.png" alt="Order Delivered Email" width="800"/>
    *Delivery confirmation email sent when order status changes to delivered*

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

This is an academic project for CSCI426: Advanced Web Programming. Contributions and improvements are welcome.

## License

This project is created for educational purposes as part of the CSCI426 course at Lebanese International University.

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


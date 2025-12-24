# Checkout Feature Implementation

## Overview
This document describes the checkout feature implementation including address management, shipping costs, order creation, and email notifications.

## Features Implemented

### 1. Address Management
- **Address Table**: Created `addresses` table to store user shipping addresses
- **Address Model**: Full CRUD operations for addresses
- **Address Controller**: API endpoints for managing addresses
- **Address Reuse**: Users can save addresses and reuse them for future orders

### 2. Checkout Process
- **Checkout Page**: Full checkout flow with address selection/entry
- **Shipping Cost**: Fixed shipping cost of $5.00 (configurable)
- **Order Creation**: Orders are created with status "delivering"
- **Payment Method**: Cash on Delivery (COD)
- **Order Total**: Subtotal + Shipping Cost

### 3. Email Notifications
- **Invoice Email**: Sent when order is created (status: delivering)
- **Delivery Email**: Sent when admin changes order status to "delivered"
- **Email Service**: Uses nodemailer with SMTP configuration

### 4. Admin Panel Updates
- **Order Status Management**: Admins can view and change order status
- **Order Details**: Shows shipping address, items, totals, and status
- **Status Options**: pending, processing, shipped, delivering, delivered, cancelled
- **Status Change**: Automatically sends delivery email when status changes to "delivered"

## Database Changes

### Address Table
```sql
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) NOT NULL DEFAULT 'Lebanon',
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Orders Table Updates
- Added `shipping_cost DECIMAL(10, 2) DEFAULT 5.00`
- Added `address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL`
- Added "delivering" to status enum

## API Endpoints

### User Endpoints (Authenticated)
- `GET /api/user/addresses` - Get user's saved addresses
- `POST /api/user/addresses` - Create new address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address
- `PUT /api/user/addresses/:id/default` - Set address as default
- `POST /api/user/checkout` - Create order from checkout
- `GET /api/user/orders` - Get user's orders

### Admin Endpoints (Authenticated + Admin)
- `PUT /api/admin/orders/:id/status` - Update order status (triggers delivery email if status = "delivered")

## Frontend Routes
- `/checkout` - Checkout page
- `/order-success` - Order confirmation page

## Environment Variables Required

### Email Configuration (for Render)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=72230776@students.liu.edu.lb
SMTP_PASSWORD=your_email_password_or_app_password
```

**Note**: If using Gmail, you may need to:
1. Enable "Less secure app access" OR
2. Use an App Password (recommended)
3. For Gmail App Password: Go to Google Account → Security → 2-Step Verification → App passwords

## Workflow

### User Checkout Flow
1. User adds items to cart
2. User clicks "Proceed to Checkout"
3. User selects saved address OR enters new address
4. User can choose to save new address for future use
5. Order summary shows: Subtotal + Shipping ($5.00) = Total
6. User confirms order (Cash on Delivery)
7. Order is created with status "delivering"
8. User receives invoice email
9. Cart is cleared
10. User is redirected to order success page

### Admin Order Management Flow
1. Admin views orders in admin panel
2. Admin can view order details (items, address, totals)
3. Admin can change order status via dropdown or "Mark as Delivered" button
4. When status changes to "delivered":
   - Order status is updated in database
   - Delivery confirmation email is sent to user

## Files Created/Modified

### Backend
- `backend/models/Address.js` - Address model
- `backend/models/Order.js` - Updated to include shipping_cost and address_id
- `backend/controllers/addressController.js` - Address CRUD operations
- `backend/controllers/checkoutController.js` - Checkout logic
- `backend/controllers/orderController.js` - Updated to send delivery emails
- `backend/services/emailService.js` - Email service with templates
- `backend/routes/userRoutes.js` - User routes (addresses, checkout, orders)
- `backend/config/addAddressTable.js` - Database migration script

### Frontend
- `frontend/src/pages/Checkout.js` - Checkout page component
- `frontend/src/pages/OrderSuccess.js` - Order success page
- `frontend/src/pages/Cart.js` - Updated to show shipping cost and link to checkout
- `frontend/src/pages/AdminPanel.js` - Updated OrdersManagement component
- `frontend/src/styles/checkout.css` - Checkout page styles
- `frontend/src/styles/orderSuccess.css` - Order success page styles
- `frontend/src/styles/admin.css` - Updated with order management styles

## Testing Checklist

- [ ] Create order with new address
- [ ] Create order with saved address
- [ ] Save address during checkout
- [ ] Verify invoice email is sent on order creation
- [ ] Verify order appears in admin panel
- [ ] Admin changes order status to "delivered"
- [ ] Verify delivery email is sent
- [ ] Verify shipping cost is calculated correctly
- [ ] Verify order total (subtotal + shipping)


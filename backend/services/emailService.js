const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter with timeout settings
// Try port 465 (SSL) first, fallback to 587 (TLS)
const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
const useSSL = smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: useSSL, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'mayaamhaz2022@gmail.com',
    pass: process.env.SMTP_PASSWORD || ''
  },
  // Timeout settings to handle slow connections
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 300000,    // 5 minutes
  // Retry settings
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  // Additional options for better reliability
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates if needed
  }
});

// Verify transporter (non-blocking, don't fail if email service is unavailable)
transporter.verify((error, success) => {
  if (error) {
    console.error('⚠️ Email service verification failed (emails may not work):', error.message);
    console.error('   This is non-critical - the app will continue to work without emails');
  } else {
    console.log('✅ Email service ready');
  }
});

// Email service functions
const emailService = {
  // Send invoice email when order is created
  async sendInvoiceEmail(order, user, items) {
    try {
      const fromEmail = process.env.SMTP_USER || 'mayaamhaz2022@gmail.com';
      
      const orderTotal = parseFloat(order.total_amount) + parseFloat(order.shipping_cost || 5.00);
      
      const mailOptions = {
        from: `"Africa Market" <${fromEmail}>`,
        to: user.email,
        subject: `Order Invoice #${order.id} - Status: Delivering`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f4a261; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
              .item { padding: 10px; border-bottom: 1px solid #eee; }
              .total { font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #333; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Africa Market</h1>
                <h2>Order Invoice #${order.id}</h2>
              </div>
              <div class="content">
                <p>Dear ${user.username},</p>
                <p>Thank you for your order! Your order has been confirmed and is now <strong>delivering</strong>.</p>
                
                <div class="order-info">
                  <h3>Order Details</h3>
                  <p><strong>Order ID:</strong> #${order.id}</p>
                  <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span style="color: #e76f51; font-weight: bold;">DELIVERING</span></p>
                  <p><strong>Payment Method:</strong> Cash on Delivery</p>
                </div>

                <div class="order-info">
                  <h3>Shipping Address</h3>
                  <p>${order.shipping_address || 'Address not provided'}</p>
                </div>

                <div class="order-info">
                  <h3>Order Items</h3>
                  ${items.map(item => `
                    <div class="item">
                      <p><strong>${item.product_name || 'Product'}</strong></p>
                      <p>Quantity: ${item.quantity} × $${parseFloat(item.price).toFixed(2)} = $${(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
                    </div>
                  `).join('')}
                  <div class="item">
                    <p><strong>Subtotal:</strong> $${parseFloat(order.total_amount).toFixed(2)}</p>
                    <p><strong>Shipping:</strong> $${parseFloat(order.shipping_cost || 5.00).toFixed(2)}</p>
                  </div>
                  <div class="total">
                    <p>Total: $${orderTotal.toFixed(2)}</p>
                  </div>
                </div>

                <p>You will receive your order soon. Payment will be collected upon delivery.</p>
                <p>Thank you for shopping with Africa Market!</p>
              </div>
              <div class="footer">
                <p>Africa Market</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Add timeout wrapper for email sending
      const emailPromise = transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );
      
      const info = await Promise.race([emailPromise, timeoutPromise]);
      console.log('📧 Invoice email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending invoice email:', error.message);
      console.error('   Order will still be created - email is non-critical');
      // Don't throw - email failure shouldn't break order creation
      return { success: false, error: error.message };
    }
  },

  // Send delivery confirmation email
  async sendDeliveryEmail(order, user, items) {
    try {
      const fromEmail = process.env.SMTP_USER || 'mayaamhaz2022@gmail.com';
      
      const orderTotal = parseFloat(order.total_amount) + parseFloat(order.shipping_cost || 5.00);
      
      const mailOptions = {
        from: `"Africa Market" <${fromEmail}>`,
        to: user.email,
        subject: `Order #${order.id} Has Been Delivered`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2a9d8f; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .success-badge { background-color: #2a9d8f; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Africa Market</h1>
                <h2>Order Delivered</h2>
              </div>
              <div class="content">
                <p>Dear ${user.username},</p>
                
                <div class="success-badge">
                  <strong>✅ Your order has been delivered!</strong>
                </div>
                
                <div class="order-info">
                  <h3>Order #${order.id}</h3>
                  <p><strong>Delivery Date:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Total Amount:</strong> $${orderTotal.toFixed(2)}</p>
                </div>

                <p>We hope you enjoy your purchase! Thank you for shopping with Africa Market.</p>
                <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
              </div>
              <div class="footer">
                <p>Africa Market</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Add timeout wrapper for email sending
      const emailPromise = transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );
      
      const info = await Promise.race([emailPromise, timeoutPromise]);
      console.log('📧 Delivery email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending delivery email:', error.message);
      console.error('   Order status will still be updated - email is non-critical');
      // Don't throw - email failure shouldn't break status update
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;


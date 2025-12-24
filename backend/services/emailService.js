const { Resend } = require('resend');
require('dotenv').config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_V7ahoZi2_4A39G9ckjsUoqfP63NXgrZ7j');

// Get from email - must be from verified domain for production
// For testing, can use onboarding@resend.dev but only to account owner email
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

// Verify Resend is configured
if (process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_V7ahoZi2_4A39G9ckjsUoqfP63NXgrZ7j') {
  console.log('✅ Resend email service configured');
  console.log(`   From email: ${FROM_EMAIL}`);
  console.log('   ⚠️  Note: To send to all recipients, verify a domain at resend.com/domains');
} else {
  console.warn('⚠️ Resend API key not found - emails may not work');
}

// Email service functions
const emailService = {
  // Send invoice email when order is created
  async sendInvoiceEmail(order, user, items) {
    try {
      const orderTotal = parseFloat(order.total_amount) + parseFloat(order.shipping_cost || 5.00);
      
      // Check if we can send to this recipient (Resend free tier limitation)
      // For now, we'll try to send and handle the error gracefully
      
      const emailHtml = `
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
                <p><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Delivering</span></p>
                
                <h4>Items:</h4>
                ${items.map(item => `
                  <div class="item">
                    <p><strong>${item.product_name || 'Product'}</strong> x${item.quantity}</p>
                    <p>Price: $${parseFloat(item.price).toFixed(2)} each</p>
                    <p>Subtotal: $${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
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
      `;

      const { data, error } = await resend.emails.send({
        from: `Africa Market <${FROM_EMAIL}>`,
        to: user.email,
        subject: `Order Invoice #${order.id} - Status: Delivering`,
        html: emailHtml
      });

      if (error) {
        console.error('❌ Resend error:', error);
        
        // Check if it's a domain verification error
        if (error.statusCode === 403 && error.message && error.message.includes('verify a domain')) {
          console.error('   ⚠️  Domain verification required for Resend');
          console.error('   📝 To fix: Verify a domain at https://resend.com/domains');
          console.error('   📝 Then update EMAIL_FROM in environment variables');
          return { 
            success: false, 
            error: 'Email service requires domain verification. Order was created successfully.',
            requiresDomainVerification: true
          };
        }
        
        return { success: false, error: error.message };
      }

      console.log('📧 Invoice email sent via Resend:', data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('❌ Error sending invoice email:', error.message);
      console.error('   Order will still be created - email is non-critical');
      return { success: false, error: error.message };
    }
  },

  // Send delivery confirmation email
  async sendDeliveryEmail(order, user, items) {
    try {
      const orderTotal = parseFloat(order.total_amount) + parseFloat(order.shipping_cost || 5.00);
      
      const emailHtml = `
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
      `;

      const { data, error } = await resend.emails.send({
        from: `Africa Market <${FROM_EMAIL}>`,
        to: user.email,
        subject: `Order #${order.id} Has Been Delivered`,
        html: emailHtml
      });

      if (error) {
        console.error('❌ Resend error:', error);
        
        // Check if it's a domain verification error
        if (error.statusCode === 403 && error.message && error.message.includes('verify a domain')) {
          console.error('   ⚠️  Domain verification required for Resend');
          console.error('   📝 To fix: Verify a domain at https://resend.com/domains');
          console.error('   📝 Then update EMAIL_FROM in environment variables');
          return { 
            success: false, 
            error: 'Email service requires domain verification. Order status was updated successfully.',
            requiresDomainVerification: true
          };
        }
        
        return { success: false, error: error.message };
      }

      console.log('📧 Delivery email sent via Resend:', data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('❌ Error sending delivery email:', error.message);
      console.error('   Order status will still be updated - email is non-critical');
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;

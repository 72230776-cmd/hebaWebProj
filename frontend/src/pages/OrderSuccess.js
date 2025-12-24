import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/orderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  const total = parseFloat(order.total_amount || 0) + parseFloat(order.shipping_cost || 5.00);

  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order. You will receive an invoice email shortly.
        </p>

        <div className="order-details">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Order Number:</span>
            <strong>#{order.id}</strong>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-badge delivering">Delivering</span>
          </div>
          <div className="detail-row">
            <span>Subtotal:</span>
            <span>${parseFloat(order.total_amount || 0).toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Shipping:</span>
            <span>${parseFloat(order.shipping_cost || 5.00).toFixed(2)}</span>
          </div>
          <div className="detail-row total">
            <span>Total:</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;




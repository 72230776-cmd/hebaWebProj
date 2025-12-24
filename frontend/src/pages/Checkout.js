import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState('');

  // Address form state
  const [addressForm, setAddressForm] = useState({
    full_name: user?.username || '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'Lebanon',
    phone: ''
  });

  // API URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/user`;

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const fallbackToken = sessionStorage.getItem('auth_token');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
    return headers;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, cartItems.length, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAddresses(data.data.addresses || []);
          // Select default address if exists
          const defaultAddress = data.data.addresses?.find(addr => addr.is_default);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setUseNewAddress(false);
          } else if (data.data.addresses?.length > 0) {
            setSelectedAddressId(data.data.addresses[0].id);
            setUseNewAddress(false);
          } else {
            setUseNewAddress(true);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare address data
      let addressData = null;
      if (useNewAddress) {
        // Validate new address
        if (!addressForm.full_name || !addressForm.street_address || !addressForm.city || !addressForm.country) {
          setError('Please fill in all required address fields');
          setLoading(false);
          return;
        }
        addressData = addressForm;
      } else if (!selectedAddressId) {
        setError('Please select a shipping address');
        setLoading(false);
        return;
      }

      // Calculate totals
      const subtotal = getTotalPrice();
      const shippingCost = 5.00; // Fixed shipping cost
      const total = subtotal + shippingCost;

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        address: addressData,
        address_id: selectedAddressId,
        save_address: saveAddress && useNewAddress,
        shipping_cost: shippingCost
      };

      // Create order
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart
        clearCart();
        // Redirect to order confirmation
        navigate('/order-success', { state: { order: data.data.order } });
      } else {
        setError(data.message || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = 5.00;
  const total = subtotal + shippingCost;

  if (loadingAddresses) {
    return <div className="checkout-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-content">
          {/* Address Section */}
          <div className="checkout-section">
            <h2>Shipping Address</h2>

            {addresses.length > 0 && (
              <div className="address-selection">
                <label>
                  <input
                    type="radio"
                    name="addressOption"
                    checked={!useNewAddress}
                    onChange={() => setUseNewAddress(false)}
                  />
                  Use saved address
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressOption"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                  />
                  Use new address
                </label>
              </div>
            )}

            {!useNewAddress && addresses.length > 0 && (
              <div className="saved-addresses">
                {addresses.map((address) => (
                  <label key={address.id} className="address-option">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => setSelectedAddressId(parseInt(e.target.value))}
                    />
                    <div className="address-details">
                      <strong>{address.full_name}</strong>
                      <p>{address.street_address}</p>
                      <p>{address.city}, {address.state} {address.zip_code}</p>
                      <p>{address.country}</p>
                      {address.phone && <p>Phone: {address.phone}</p>}
                      {address.is_default && <span className="default-badge">Default</span>}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {useNewAddress && (
              <div className="address-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={addressForm.full_name}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="street_address"
                    value={addressForm.street_address}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={addressForm.zip_code}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                  />
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                  Save this address for future use
                </label>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span>{item.name} × {item.quantity}</span>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-info">
              <h3>Payment Method</h3>
              <p className="payment-method">Cash on Delivery</p>
              <p className="payment-note">Payment will be collected when your order is delivered.</p>
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;


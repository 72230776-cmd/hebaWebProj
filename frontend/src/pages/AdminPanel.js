import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated() || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Welcome, {user?.username}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          📦 View Products
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 View Users
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          📋 View Orders
        </button>
        <button
          className={activeTab === 'contacts' ? 'active' : ''}
          onClick={() => setActiveTab('contacts')}
        >
          📧 View Contacts
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          📅 View Bookings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && <ProductsManagement />}
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'contacts' && <ContactsManagement />}
        {activeTab === 'bookings' && <BookingsManagement />}
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '' });

  // API URL - use production backend when deployed, localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/admin`;

  // Helper function to get headers with fallback token
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const fallbackToken = sessionStorage.getItem('auth_token');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
    return headers;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Get token from sessionStorage as fallback if cookies are blocked
      const fallbackToken = sessionStorage.getItem('auth_token');
      const headers = { 'Content-Type': 'application/json' };
      
      // Add Authorization header if we have a fallback token
      if (fallbackToken) {
        headers['Authorization'] = `Bearer ${fallbackToken}`;
        console.log('🔑 Using fallback token from sessionStorage');
      }
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        credentials: 'include', // Important: send cookies
        headers: headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('API Error:', response.status, errorData);
        alert(`Error fetching products: ${errorData.message || response.statusText}`);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Products API Response:', data);
      
      if (data.success) {
        setProducts(data.data.products || []);
        console.log('Products loaded:', data.data.products?.length || 0);
      } else {
        console.error('API returned success:false', data);
        alert(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      // Clean and validate form data
      const cleanFormData = {
        name: (formData.name || '').trim(),
        price: formData.price ? parseFloat(formData.price) : 0,
        description: (formData.description || '').trim(),
        image: (formData.image || '').trim()
      };

      // Validate required fields
      if (!cleanFormData.name) {
        alert('Product name is required');
        setLoading(false);
        return;
      }

      if (!cleanFormData.price || cleanFormData.price <= 0) {
        alert('Valid price is required (must be greater than 0)');
        setLoading(false);
        return;
      }

      console.log('📤 Submitting product:', { url, method, cleanFormData });

      const response = await fetch(url, {
        method,
        credentials: 'include', // Important: send cookies
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanFormData)
      });

      console.log('📥 Response status:', response.status, response.statusText);
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        alert(errorData.message || 'Error saving product');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      if (data.success) {
        alert(editingProduct ? 'Product updated!' : 'Product added!');
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', description: '', image: '' });
        fetchProducts();
      } else {
        alert(data.message || 'Error saving product');
      }
    } catch (error) {
      console.error('❌ Network/Parse error:', error);
      alert('Error saving product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Important: send cookies
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        alert('Product deleted!');
        fetchProducts();
      }
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image: product.image || ''
    });
    setShowAddForm(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
  };

  if (loading && products.length === 0) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Products Management</h2>
        <button onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); setFormData({ name: '', price: '', description: '', image: '' }); }}>
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAddForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL or filename (e.g., img1.jpg)"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <button type="submit" disabled={loading}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {viewingProduct && (
        <div className="view-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setViewingProduct(null)}>&times;</span>
            <h2>{viewingProduct.name}</h2>
            <img src={viewingProduct.image} alt={viewingProduct.name} />
            <p><strong>Price:</strong> ${viewingProduct.price}</p>
            <p><strong>Description:</strong> {viewingProduct.description || 'No description'}</p>
            <div className="modal-actions">
              <button onClick={() => { handleEdit(viewingProduct); setViewingProduct(null); }}>Edit</button>
              <button onClick={() => { handleDelete(viewingProduct.id); setViewingProduct(null); }} className="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 && !loading ? (
        <p>No products found. Add your first product above!</p>
      ) : (
        <div className="items-grid">
        {products.map((product) => (
          <div key={product.id} className="item-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <div className="item-actions">
              <button onClick={() => handleView(product)}>View</button>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

// Users Management Component
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // API URL - use production backend when deployed, localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/admin`;

  // Helper function to get headers with fallback token
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const fallbackToken = sessionStorage.getItem('auth_token');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
    return headers;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        credentials: 'include', // Important: send cookies
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (userId) => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}/password`, {
        method: 'PUT',
        credentials: 'include', // Important: send cookies
        headers: getAuthHeaders(),
        body: JSON.stringify({ password: newPassword })
      });
      const data = await response.json();
      if (data.success) {
        alert('Password updated!');
        setEditingUser(null);
        setNewPassword('');
      }
    } catch (error) {
      alert('Error updating password');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/toggle-active`, {
        method: 'PUT',
        credentials: 'include', // Important: send cookies
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchUsers();
      }
    } catch (error) {
      alert('Error updating user status');
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="management-section">
      <h2>Users Management</h2>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? '✅ Active' : '❌ Disabled'}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>Edit Password</button>
                  <button onClick={() => handleToggleActive(user.id)}>
                    {user.is_active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="view-modal">
          <div className="modal-content">
            <span className="close" onClick={() => { setEditingUser(null); setNewPassword(''); }}>&times;</span>
            <h2>Edit Password for {editingUser.username}</h2>
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => handleUpdatePassword(editingUser.id)}>Update Password</button>
              <button onClick={() => { setEditingUser(null); setNewPassword(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Orders Management Component
const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // API URL - use production backend when deployed, localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/admin`;

  // Helper function to get headers with fallback token
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const fallbackToken = sessionStorage.getItem('auth_token');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
    return headers;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        credentials: 'include', // Important: send cookies
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) {
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Order status updated to "${newStatus}"`);
        fetchOrders(); // Refresh orders
        if (viewingOrder && viewingOrder.id === orderId) {
          setViewingOrder(data.data.order);
        }
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivering': 'status-delivering',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const calculateTotal = (order) => {
    const subtotal = parseFloat(order.total_amount || 0);
    const shipping = parseFloat(order.shipping_cost || 5.00);
    return subtotal + shipping;
  };

  return (
    <div className="management-section">
      <h2>Orders Management</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const orderTotal = calculateTotal(order);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p><strong>User:</strong> {order.username} ({order.email})</p>
                <p><strong>Subtotal:</strong> ${parseFloat(order.total_amount || 0).toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${parseFloat(order.shipping_cost || 5.00).toFixed(2)}</p>
                <p><strong>Total:</strong> ${orderTotal.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <div className="order-actions">
                  <button onClick={() => setViewingOrder(order)}>View Details</button>
                  {order.status === 'delivering' && (
                    <button 
                      className="btn-deliver"
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                      disabled={updatingStatus}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewingOrder && (
        <div className="view-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setViewingOrder(null)}>&times;</span>
            <h2>Order #{viewingOrder.id} Details</h2>
            <div className="order-details-modal">
              <p><strong>User:</strong> {viewingOrder.username} ({viewingOrder.email})</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${getStatusBadgeClass(viewingOrder.status)}`} style={{marginLeft: '10px'}}>
                  {viewingOrder.status.toUpperCase()}
                </span>
              </p>
              <p><strong>Shipping Address:</strong> {viewingOrder.shipping_address || 'Not provided'}</p>
              <p><strong>Subtotal:</strong> ${parseFloat(viewingOrder.total_amount || 0).toFixed(2)}</p>
              <p><strong>Shipping Cost:</strong> ${parseFloat(viewingOrder.shipping_cost || 5.00).toFixed(2)}</p>
              <p><strong>Total:</strong> ${calculateTotal(viewingOrder).toFixed(2)}</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
              <p><strong>Date:</strong> {new Date(viewingOrder.created_at).toLocaleString()}</p>
              
              {viewingOrder.items && viewingOrder.items.length > 0 && (
                <div className="order-items-modal">
                  <h3>Items:</h3>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>${parseFloat(item.price).toFixed(2)}</td>
                          <td>${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="status-change-section">
                <h3>Change Status</h3>
                <select
                  value={viewingOrder.status}
                  onChange={(e) => handleStatusChange(viewingOrder.id, e.target.value)}
                  disabled={updatingStatus}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Contacts Management Component
const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingContact, setViewingContact] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/admin`;

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const fallbackToken = sessionStorage.getItem('auth_token');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
    return headers;
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact submission?')) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        fetchContacts();
      }
    } catch (error) {
      alert('Error deleting contact');
    }
  };

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="management-section">
      <h2>Contact Submissions</h2>
      {contacts.length === 0 ? (
        <p>No contact submissions yet.</p>
      ) : (
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-header">
                <h3>Contact #{contact.id}</h3>
              </div>
              <p><strong>Name:</strong> {contact.name}</p>
              <p><strong>Email:</strong> {contact.email}</p>
              <p><strong>Date:</strong> {new Date(contact.created_at).toLocaleDateString()}</p>
              <div className="contact-actions">
                <button onClick={() => setViewingContact(contact)}>View Details</button>
                <button onClick={() => handleDelete(contact.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingContact && (
        <div className="view-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setViewingContact(null)}>&times;</span>
            <h2>Contact Details</h2>
            <div className="contact-details">
              <p><strong>ID:</strong> {viewingContact.id}</p>
              <p><strong>Name:</strong> {viewingContact.name}</p>
              <p><strong>Email:</strong> {viewingContact.email}</p>
              <p><strong>Date:</strong> {new Date(viewingContact.created_at).toLocaleString()}</p>
              <p><strong>Message:</strong></p>
              <div className="message-box">{viewingContact.message}</div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setViewingContact(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Bookings Management Component
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingBooking, setViewingBooking] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/admin`;

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const fallbackToken = sessionStorage.getItem('auth_token');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
    return headers;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;

    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (error) {
      alert('Error deleting booking');
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="management-section">
      <h2>Booking Appointments</h2>
      {bookings.length === 0 ? (
        <p>No booking appointments yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.id}</h3>
              </div>
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Email:</strong> {booking.email || 'N/A'}</p>
              <p><strong>Order Type:</strong> {booking.order_type}</p>
              <p><strong>Appointment Date:</strong> {new Date(booking.appointment_date).toLocaleDateString()}</p>
              <p><strong>Appointment Time:</strong> {booking.appointment_time}</p>
              <div className="booking-actions">
                <button onClick={() => setViewingBooking(booking)}>View Details</button>
                <button onClick={() => handleDelete(booking.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingBooking && (
        <div className="view-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setViewingBooking(null)}>&times;</span>
            <h2>Booking Details</h2>
            <div className="booking-details">
              <p><strong>ID:</strong> {viewingBooking.id}</p>
              <p><strong>Name:</strong> {viewingBooking.name}</p>
              <p><strong>Phone:</strong> {viewingBooking.phone}</p>
              <p><strong>Email:</strong> {viewingBooking.email || 'N/A'}</p>
              <p><strong>Order Type:</strong> {viewingBooking.order_type}</p>
              <p><strong>Appointment Date:</strong> {new Date(viewingBooking.appointment_date).toLocaleDateString()}</p>
              <p><strong>Appointment Time:</strong> {viewingBooking.appointment_time}</p>
              <p><strong>Description:</strong></p>
              <div className="message-box">{viewingBooking.description || 'No description provided'}</div>
              <p><strong>Submitted:</strong> {new Date(viewingBooking.created_at).toLocaleString()}</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setViewingBooking(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


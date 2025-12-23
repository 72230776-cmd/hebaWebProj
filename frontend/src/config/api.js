// API Configuration
// Use environment variable in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_URL = {
  AUTH: `${API_BASE_URL}/api/auth`,
  ADMIN: `${API_BASE_URL}/api/admin`,
  PRODUCTS: `${API_BASE_URL}/api/products`
};

export default API_URL;


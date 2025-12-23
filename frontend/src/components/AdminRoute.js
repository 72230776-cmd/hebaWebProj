import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to redirect admins away from regular pages
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() && user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // If admin, don't render children (will redirect)
  if (isAuthenticated() && user?.role === 'admin') {
    return null;
  }

  return children;
};

export default AdminRoute;



import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // API URL - use production backend when deployed, localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/auth`;

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated via cookies
  const checkAuth = async () => {
    try {
      // Get fallback token from sessionStorage
      const fallbackToken = sessionStorage.getItem('auth_token');
      const headers = {};
      if (fallbackToken) {
        headers['Authorization'] = `Bearer ${fallbackToken}`;
      }
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        credentials: 'include', // Important: send cookies
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          setUser(data.data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: send/receive cookies
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // User data is in the response
        // Token might be in httpOnly cookie OR in response (fallback for blocked cookies)
        setUser(data.data.user);
        
        // Store token in sessionStorage as fallback if cookies are blocked
        if (data.data.token) {
          sessionStorage.setItem('auth_token', data.data.token);
        }
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: send/receive cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // User data is in the response
        // Token might be in httpOnly cookie OR in response (fallback for blocked cookies)
        setUser(data.data.user);
        
        // Store token in sessionStorage as fallback if cookies are blocked
        if (data.data.token) {
          sessionStorage.setItem('auth_token', data.data.token);
          console.log('💾 Token stored in sessionStorage as fallback');
        }
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Important: send cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear fallback token
      sessionStorage.removeItem('auth_token');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    authLoading,
    register,
    login,
    logout,
    isAuthenticated,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

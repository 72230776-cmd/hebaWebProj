import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, loading } = useAuth(); // Wait for auth to finish loading

  // Get cart key based on user
  const getCartKey = (userId) => {
    return userId ? `cart_${userId}` : 'cart_guest';
  };

  // Load cart from localStorage when user changes (login/logout)
  // Wait for auth to finish loading before checking user state
  useEffect(() => {
    // Don't load cart until auth check is complete
    if (loading) {
      return;
    }
    
    if (user?.id) {
      // User is logged in - load their saved cart
      const cartKey = getCartKey(user.id);
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          setCartItems([]);
        }
      } else {
        // If no saved cart for this user, start with empty cart
        setCartItems([]);
      }
    } else {
      // User is logged out (guest) - FORCE clear cart immediately
      // Clear any guest cart from localStorage
      localStorage.removeItem('cart_guest');
      // Clear all cart-related localStorage entries
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cart_')) {
          localStorage.removeItem(key);
        }
      });
      // Force clear cart state
      setCartItems([]);
    }
  }, [user?.id, loading]); // Reload cart when user changes or auth finishes loading

  // Additional effect: Clear cart whenever user becomes null (safety net)
  useEffect(() => {
    // Wait for auth to finish loading, then clear if no user
    if (!loading && !user) {
      setCartItems([]);
      // Also clear all cart localStorage entries
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cart_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [user, loading]);

  // Save cart to localStorage whenever it changes (only for logged-in users)
  useEffect(() => {
    if (user?.id) {
      // Only save cart for logged-in users
      const cartKey = getCartKey(user.id);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } else {
      // If user is not logged in, make sure we don't save anything
      // and clear any existing guest cart
      localStorage.removeItem('cart_guest');
    }
  }, [cartItems, user?.id]);

  // Add item to cart (only if user is logged in)
  const addToCart = (product) => {
    // Prevent adding items when not logged in
    if (!user?.id) {
      console.warn('Cannot add to cart: User must be logged in');
      return;
    }
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart (but keep it saved for the user)
  const clearCart = () => {
    setCartItems([]);
    // The useEffect will save the empty cart
  };

  // Clear cart and remove from localStorage (used on logout)
  const clearCartOnLogout = () => {
    // Save current cart to user's ID before clearing (if user is logged in)
    if (user?.id) {
      const cartKey = getCartKey(user.id);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
    // Clear ALL guest cart entries from localStorage
    localStorage.removeItem('cart_guest');
    // Also clear any other potential cart keys (cleanup)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cart_guest')) {
        localStorage.removeItem(key);
      }
    });
    // Clear the current state immediately
    setCartItems([]);
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCartOnLogout,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


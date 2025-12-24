import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/Navbar.css";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems, clearCartOnLogout } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCartOnLogout(); // Save cart for user, then clear current state
    logout();
    navigate("/");
  };

  // If admin, show minimal navbar with only admin panel and logout
  if (isAuthenticated() && user?.role === 'admin') {
    return (
      <nav className="navbar">
        <h2 className="logo">Admin Panel</h2>
        <div className="links">
          <span className="user-name">Hello, {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  // Regular navbar for non-admin users
  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <h2 className="logo">Africa Market</h2>
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/booking">Booking</Link>
        {user && (
          <Link to="/cart" className="cart-link" title="Shopping Cart">
            <svg 
              className="cart-icon" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
        )}
        {isAuthenticated() ? (
          <>
            <span className="user-name">Hello, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

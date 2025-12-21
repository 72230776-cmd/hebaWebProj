import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Africa Market</h2>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/booking">Booking</Link>
      </div>
    </nav>
  );
};

export default NavBar;

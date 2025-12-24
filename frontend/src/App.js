import React from "react";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminRoute><Home /></AdminRoute>} />
          <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="/about" element={<AdminRoute><About /></AdminRoute>} />
          <Route path="/contact" element={<AdminRoute><Contact /></AdminRoute>} />
          <Route path="/booking" element={<AdminRoute><Booking /></AdminRoute>} />
          <Route path="/cart" element={<AdminRoute><Cart /></AdminRoute>} />
          <Route path="/checkout" element={<AdminRoute><Checkout /></AdminRoute>} />
          <Route path="/order-success" element={<AdminRoute><OrderSuccess /></AdminRoute>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

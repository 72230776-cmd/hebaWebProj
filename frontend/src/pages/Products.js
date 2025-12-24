import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
      } else {
        // Fallback to static JSON if API fails
        fetch("/products.json")
          .then((res) => res.json())
          .then((data) => setProducts(data));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static JSON if API fails
      fetch("/products.json")
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      // Redirect to login page with current location for redirect after login
      navigate("/login", { state: { from: { pathname: "/products" } } });
      return;
    }

    // Add to cart if authenticated
    addToCart(product);
    // Optional: Show a success message
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>

      <div className="products-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img className="product-img" src={item.image} alt={item.name} />

            <h3>{item.name}</h3>
            <p>{item.description || item.desc || ''}</p>
            <div className="product-price">${item.price}</div>

            <button 
              className="buy-btn" 
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

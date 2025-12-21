import { useEffect, useState } from "react";
import "../styles/products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>

      <div className="products-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img className="product-img" src={item.image} alt={item.name} />

            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <div className="product-price">${item.price}</div>

            <button className="buy-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/products");
  };

  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <div className="hero-section">
        <h1>Welcome to Africa Market</h1>
        <p>
          Discover authentic African handmade crafts, clothing, jewelry,
          décor and natural skincare — all made by talented artisans across Africa.
        </p>
        <button className="hero-btn" onClick={handleShopNow}>Shop Now</button>
      </div>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <h2>About Africa Market</h2>
        <p>
          We partner with over <b>200+ African artisans</b> across Ghana, Ethiopia,
          Kenya, Morocco, Nigeria, Uganda, and Senegal. Our products are ethically sourced,
          eco-friendly, and handcrafted with love.
        </p>

        <p>
          Every purchase helps support African families, empowers small villages,
          and preserves traditional craft techniques passed down through generations.
        </p>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <h2>Why Choose Us?</h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>✔ Handmade Products</h3>
            <p>Authentic items crafted by real African artisans.</p>
          </div>

          <div className="why-card">
            <h3>✔ Supports Local Communities</h3>
            <p>Each purchase helps families and local economies.</p>
          </div>

          <div className="why-card">
            <h3>✔ Worldwide Shipping</h3>
            <p>Fast delivery to over 60 countries worldwide.</p>
          </div>

          <div className="why-card">
            <h3>✔ Unique Cultural Collections</h3>
            <p>Every item carries a piece of African heritage.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

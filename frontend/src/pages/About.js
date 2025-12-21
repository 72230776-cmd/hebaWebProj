import "../styles/aboutus.css";

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Africa Market</h1>

      <p className="about-intro">
        Africa Market is a marketplace that brings the heart of Africa’s culture,
        spices, craftsmanship, and traditions to your home.  
        We work directly with creators, farmers, spice producers, herbal specialists,
        and artisans across Ghana, Kenya, Ethiopia, Rwanda, Nigeria, and Mali.
      </p>

      {/* BANNER IMAGE (Middle East friendly) */}
      <div
        className="about-banner"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b')",
        }}
      ></div>

      <h2 className="about-section-title">Our Mission</h2>
      <p className="about-intro">
        To empower African communities, support sustainable farming,
        preserve cultural traditions, and offer the world the finest
        African spices, herbs, handcrafted items, and natural products.
      </p>

      <h2 className="about-section-title">What We Offer</h2>

      <div className="offer-grid">
        <div className="offer-card">
          <h3>🌶 Authentic African Spices</h3>
          <p>
            Ethiopian Berbere, Nigerian suya spice, Ras el Hanout, East African curry blends,
            dried herbs, and premium seasoning mixes.
          </p>
        </div>

        <div className="offer-card">
          <h3>🫘 Natural Foods & Tea</h3>
          <p>
            Organic coffee beans, African herbal teas, dried hibiscus, moringa,
            baobab powder, and traditional natural health products.
          </p>
        </div>

        <div className="offer-card">
          <h3>🧺 Handmade Crafts</h3>
          <p>
            Hand-carved wooden items, woven baskets, masks, cultural souvenirs,
            and traditional African art.
          </p>
        </div>

        <div className="offer-card">
          <h3>👗 Clothing & Fabrics</h3>
          <p>
            Kente cloth, Ankara designs, tribal jewelry, beaded accessories,
            and authentic handmade fashion.
          </p>
        </div>

        <div className="offer-card">
          <h3>🧴 Organic Skincare</h3>
          <p>
            Shea butter, black soap, natural oils, and African wellness products
            sourced directly from local producers.
          </p>
        </div>
      </div>

      {/* SECOND BANNER */}
      <div
        className="about-banner"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        }}
      ></div>
    </div>
  );
};

export default About;

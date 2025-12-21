import { useState } from "react";
import "../styles/contactus.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>

      <p className="contact-intro">
        Have a question, feedback, or need assistance? We'd love to hear from you!
        Reach out to us and we'll get back to you as soon as possible.
      </p>

      <div className="contact-content">
        {/* Contact Information Cards */}
        <div className="contact-info-section">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email Us</h3>
            <p>support@africamarket.com</p>
            <p>info@africamarket.com</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p>+233 55 123 4567</p>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p>Accra, Ghana</p>
            <p>West Africa</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2 className="form-title">Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="contact-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="contact-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                className="contact-textarea"
                placeholder="Tell us what's on your mind..."
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button className="contact-btn" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

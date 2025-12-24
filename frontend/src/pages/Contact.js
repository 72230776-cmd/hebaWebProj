import { useState } from "react";
import "../styles/contactus.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // API URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/contact`;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        alert(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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

            <button className="contact-btn" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {submitted && (
            <div className="success-message" style={{ marginTop: '20px', padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '5px' }}>
              ✓ Thank you for your message! We'll get back to you soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

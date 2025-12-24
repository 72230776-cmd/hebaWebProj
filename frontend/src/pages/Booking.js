import React, { useState } from "react";
import "../styles/Book.css";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    orderType: "",
    date: "",
    time: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // API URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hebawebproj.onrender.com');
  const API_URL = `${API_BASE_URL}/api/booking`;

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
      console.log('Submitting booking to:', API_URL);
      console.log('Form data:', formData);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          orderType: formData.orderType,
          date: formData.date,
          time: formData.time,
          description: formData.description || null
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Check if response is ok before parsing
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }
      console.log('Response data:', data);

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: "",
            phone: "",
            email: "",
            orderType: "",
            date: "",
            time: "",
            description: "",
          });
        }, 5000);
      } else {
        alert(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Error submitting booking: ' + (error.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <h1 className="booking-title">Book a Special Order Appointment</h1>

      <p className="booking-description">
        Do you want African spices, handmade food items, or custom-prepared
        packages? Book an appointment with our team and we'll prepare your
        special order.
      </p>

      {/* Info Box */}
      <div className="info-box">
        <h2 className="info-title">How is this different from our Contact Page?</h2>
        <div className="info-content">
          <div className="info-item">
            <h3>📧 Contact Page</h3>
            <p>
              For general questions, customer support, or simple inquiries. 
              Perfect for quick messages or product questions.
            </p>
          </div>
          <div className="info-item">
            <h3>📅 Booking Page</h3>
            <p>
              Specifically for <strong>special orders</strong> related to African food,
              spices, herbs, or custom-prepared packages. We'll schedule a proper meeting.
            </p>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="booking-form-wrapper">
          <h2 className="form-section-title">Book Your Appointment</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+233 55 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="orderType">Type of Special Order *</label>
              <select
                id="orderType"
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
                required
              >
                <option value="">Choose an option...</option>
                <option value="spices-mix">African Spices Mix</option>
                <option value="seasoning">Traditional Seasoning</option>
                <option value="food-package">Custom Food Package</option>
                <option value="herbs">Dried Herbs Order</option>
                <option value="imported">Imported African Products</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Preferred Appointment Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Preferred Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Describe your Special Order</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Tell us what you need in detail..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="booking-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      ) : (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Appointment Request Submitted!</h2>
          <p className="success-message">
            Thank you for your booking request. Our team will contact you shortly 
            to confirm your appointment and discuss your special order details.
          </p>
        </div>
      )}
    </div>
  );
};

export default Booking;

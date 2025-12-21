import React, { useState } from "react";
import "../styles/Book.css";

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="booking-container">
      <h1 className="booking-title">Book a Special Order Appointment</h1>

      {/* NEW SECTION: Difference between Contact and Booking */}
      <div className="info-box">
        <h2 className="info-title">How is this different from our Contact Page?</h2>
        <p className="info-text">
          Our contact page is used for general questions, customer support, or
          simple inquiries. It is meant for anyone who wants to send us a quick
          message or ask about our products.
        </p>
        <p className="info-text">
          This appointment page, however, is specifically designed for customers
          who want to request a <strong>special order</strong> related to African food,
          spices, herbs, or custom-prepared packages. We ask for more detailed
          information here so our team can prepare your order and schedule a
          proper meeting with you.
        </p>
      </div>

      <p className="booking-description">
        Do you want African spices, handmade food items, or custom-prepared
        packages? Book an appointment with our team and we’ll prepare your
        special order.
      </p>

      {!submitted && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>Your Full Name:</label>
          <input type="text" placeholder="Enter your name" required />

          <label>Phone Number:</label>
          <input type="tel" placeholder="+961 70 123 456" required />

          <label>Email Address:</label>
          <input type="email" placeholder="your@email.com" />

          <label>Type of Special Order:</label>
          <select required>
            <option value="">Choose...</option>
            <option>African Spices Mix</option>
            <option>Traditional Seasoning</option>
            <option>Custom Food Package</option>
            <option>Dried Herbs Order</option>
            <option>Imported African Products</option>
          </select>

          <label>Preferred Appointment Date:</label>
          <input type="date" required />

          <label>Preferred Time:</label>
          <input type="time" required />

          <label>Describe your Special Order:</label>
          <textarea rows="4" placeholder="Tell us what you need..."></textarea>

          <button type="submit">Book Appointment</button>
        </form>
      )}

      {submitted && (
        <p className="success-message">
          ✔ Your appointment request has been submitted!  
          Our team will contact you shortly.
        </p>
      )}
    </div>
  );
};

export default Booking;

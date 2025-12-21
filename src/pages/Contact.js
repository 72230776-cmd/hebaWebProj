import "../styles/contactus.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>

      <div className="contact-info">
        <p>Email: support@africamarket.com</p>
        <p>Phone: +233 55 123 4567</p>
        <p>Location: Accra, Ghana</p>
      </div>

      <h2 className="contact-section-title">Send Us a Message</h2>

      <form className="contact-form">
        <input className="contact-input" placeholder="Your Name" />
        <input className="contact-input" placeholder="Your Email" />
        <textarea
          className="contact-textarea"
          placeholder="Your Message"
          rows={4}
        ></textarea>

        <button className="contact-btn" type="button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;

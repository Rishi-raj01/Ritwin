import React from "react";
import '../../index.css';
import whatsappIcon from '../../images/icons8-whatsapp-48.png';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <h1 className="text-center">All Rights Reserved &copy; Rishi Raj</h1>
      <p className="text-center mt-3">
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link> | 
        <Link to="/policy">Terms & Policies</Link> | 
        <a 
          href="https://wa.me/+918949254441?text=hey%20I%20wanted%20to%20ask%20about%20your%20products%20and%20its%20details%20" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          WhatsApp 
          <img 
            src={whatsappIcon} 
            alt="WhatsApp Icon" 
            style={{ marginLeft: "5px", width: "24px", verticalAlign: "middle" }} 
          />
        </a>
      </p>
    </div>
  );
};

export default Footer;

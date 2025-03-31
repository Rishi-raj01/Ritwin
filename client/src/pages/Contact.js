import React from 'react'
import Layout from '../components/Layout/Layout'
import aboutImage from "../images/contact_us.jpg"; // Ensure the image path is correct
import whatsappIcon from '../images/icons8-whatsapp-48.png';
import { BiPhoneCall } from "react-icons/bi";
import { FaInstagram } from "react-icons/fa"; // Import Instagram icon

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 mb-auto">
          <img
            src={aboutImage}
            alt="Ritwin About Us"
            className="img-fluid rounded shadow-sm"
            style={{maxHeight:"100%",
              height:"60vh"
            }}
          />
        </div>
        <div className="col-md-4 mb-2 mb-auto">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            Any query and info about products, feel free to call anytime. We are available 24x7.
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 8949254441
          </p>

          {/* Contact Links */}
          <div className="d-flex flex-column align-items-start mt-3">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/+918949254441?text=hey%20I%20wanted%20to%20ask%20about%20your%20products%20and%20its%20details%20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="d-flex align-items-center mb-2"
              style={{ textDecoration: "none", color: "black" }}
            >
              <img 
                src={whatsappIcon} 
                alt="WhatsApp Icon" 
                style={{ width: "24px", marginRight: "8px" }} 
              />
              WhatsApp
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/_ritwin_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "black" }}
            >
              <FaInstagram size={24} style={{ marginRight: "8px" }} />
              Instagram
            </a>
          </div>

          <br />
          <h5>Address :</h5>
          <h5>5G34, Chandra Shekhar Azad Nagar</h5>
          <h5>Bhilwara</h5>
          <h5>Rajasthan, India</h5>
          <h5>Pin-code: 311001</h5>
        </div >
      </div>
    </Layout>
  );
};

export default Contact;

import React from "react";
import Layout from "./../components/Layout/Layout";

import aboutImage from "../images/about.jpeg"; // Ensure the image path is correct

const About = () => {
  return (
    <Layout title={"About Us - Ritwins shopsphere"}>
      <div className="container mt-4">
        <div className="row align-items-center">
          {/* About Image Section */}
          <div className="col-md-6 mb-4">
            <img
              src={aboutImage}
              alt="About Us"
              className="img-fluid rounded shadow-sm"
            />
          </div>

          {/* About Content Section */}
          <div className="col-md-6">
            <article className="text-justify mb-4"  >
              <h1 className="mb-3">About Us</h1>
              <p>
                Welcome to <strong>Ritwin's Handcrafted elegance </strong>, your go-to destination for unique, handmade crochets and artisanal items. Every piece we offer is a labor of love, crafted with precision and care to bring beauty and functionality into your life.
              </p>

              <h2 className="mt-4 mb-3">Our Story</h2>
              <p>
                What started as a small passion for creating beautiful crochet designs has blossomed into a thriving space where artistry meets purpose. Each product reflects our commitment to preserving the timeless tradition of handcrafting while adding a modern touch.
              </p>

              <h2 className="mt-4 mb-3">Why Choose Handmade?</h2>
              <p>
                Every handmade item carries a story—it’s not just a product; it’s a piece of art. Choosing handmade means valuing quality over mass production, supporting skilled artisans, and embracing the charm of unique, one-of-a-kind creations.
              </p>

              <h2 className="mt-4 mb-3">What We Offer</h2>
              <ul>
                <li><strong>Exquisite Crochets:</strong> From home décor to wearable art, explore our range of beautifully crafted crochet items.</li>
                <li><strong>Personalized Gifts:</strong> Make your gifts unforgettable with custom-designed creations.</li>
                <li><strong>Artisanal Accessories:</strong> Discover our selection of handmade items designed to enhance your everyday life.</li>
              </ul>

              <h2 className="mt-4 mb-3">Our Mission</h2>
              <p>
                At <strong>Ritwin</strong>, our mission is to inspire joy through handmade artistry. We aim to create pieces that not only add beauty to your life but also celebrate the skill and dedication of craftsmanship.
              </p>

              
              <h2 className="mt-4 ">Follow us on instagram </h2>
              <a href="https://www.instagram.com/_ritwin_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" style={{textDecoration:"none" ,marginBottom:"2rem"}} className="mb-3">click here to visit our instagram account</a>
              
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Success = () => {
  const location = useLocation();
  const { cart, total } = location.state || { cart: [], total: 0 }; // Default values

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="alert alert-success text-center">
              <h4 className="alert-heading">Payment Successful</h4>
              <p>Thank you for your purchase!</p>
            </div>

            <h3>Order Summary:</h3>
            <ul className="list-group">
              {cart.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>Product:</strong> {item.name} <br />
                  <strong>Quantity:</strong> {item.quantity} <br />
                  <strong>Price:</strong> ₹{item.price.toFixed(2)} <br />
                </li>
              ))}
            </ul>
            <h4 className="mt-3">Total Amount: ₹{total.toFixed(2)}</h4>

            <a href="/" className="btn btn-primary mt-3">Back to Home</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Success;

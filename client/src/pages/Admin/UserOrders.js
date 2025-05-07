import React, { useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

const UserOrders = () => {
  const { userId} = useParams(); // Get the user ID from the URL
  const location = useLocation();
  const { name } = location.state || {};
  //console.log("name is ",name)
  const [orders, setOrders] = useState([]);
  

  const fetchOrders = async () => {
    try {
     // console.log("Fetching orders for userId:", userId);
      const { data } = await axios.get(`/api/v1/user/orders/${userId}`);
      //console.log(data.orders)
      setOrders(data.orders || []); // Fallback to empty array if no orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <Layout title={`Orders for User ${name}`}>
    <div
      style={{
        backgroundImage: "url('https://via.placeholder.com/1920x1080')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px 0",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <h3 className="text-center mb-4" style={{ color: "#ffffff" }}>
          Orders for User <span className="text-info">{name}</span>
        </h3>
        {orders.length > 0 ? (
          <div className="row mx-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="card mx-3 my-3"
                style={{
                  width: "18rem",
                  background: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order._id}</h5>
                  <p>Total Amount: ₹{order.totalAmount?.toFixed(2) || "N/A"}</p>
                  <p>Items:</p>
                  <ul>
                    {Array.isArray(order.products) &&
                    order.products.length > 0 ? (
                      order.products.map((product, index) => (
                        <li key={index}>
                          {product.name} - ₹{product.price?.toFixed(2) || "N/A"}
                        </li>
                      ))
                    ) : (
                      <li>No products found</li>
                    )}
                  </ul>
                  <p>Transactions:</p>
                  {order.payment?.razorpay_payment_id ? (
                    <div>
                      <strong>Payment Details:</strong> <br />
                      <span className="badge bg-success">Method: Razorpay</span>
                      <br />
                      Transaction ID:{" "}
                      <span className="text-muted">
                        {order.payment.razorpay_payment_id || "N/A"}
                      </span>{" "}
                      <br />
                      Order ID:{" "}
                      <span className="text-muted">
                        {order.payment.razorpay_order_id || "N/A"}
                      </span>{" "}
                      <br />
                      Amount: ₹{order.totalAmount || "N/A"} <br />
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString() || "N/A"}
                      <br />
                      Status:{" "}
                      <span
                        className={`badge ${
                          order.payment.success ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {order.payment.success ? "Successful" : "Failed"}
                      </span>
                    </div>
                  ) : (
                    <p>No transaction found</p>
                  )}
  
                  <p>
                    Placed on:{" "}
                    {new Date(order.createdAt).toLocaleDateString() || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-light">
            No orders found for this user.
          </p>
        )}
      </div>
    </div>
    <style>{`
      /* General Styles */
      .container {
        padding: 20px;
      }
  
      /* Card Styles */
      .card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s, box-shadow 0.3s;
        max-height: 350px; /* Limit height */
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Prevent content overflow */
      }
  
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
      }
  
      .card-body {
        flex-grow: 1; /* Expand to available space */
        overflow-y: auto; /* Enable vertical scrolling */
        padding-right: 10px;
      }
  
      .card-body::-webkit-scrollbar {
        width: 8px; /* Scrollbar width */
      }
  
      .card-body::-webkit-scrollbar-thumb {
        background-color: rgb(29, 196, 211); /* Scrollbar thumb color */
        border-radius: 4px;
      }
  
      .card-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: rgb(27, 121, 134);
      }
  
      /* Badge Styles */
      .badge {
        font-size: 0.9rem;
        padding: 5px 10px;
        margin-top: 5px;
      }
  
      /* Responsive Design */
      @media (max-width: 768px) {
        .card {
          width: calc(50% - 20px);
        }
      }
  
      @media (max-width: 480px) {
        .card {
          width: 100%;
        }
      }
    `}</style>
  </Layout>
  
  );
};

export default UserOrders;

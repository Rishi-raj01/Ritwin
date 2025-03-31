import React, { useState, useEffect } from "react";
import Layout from "../../../src/components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [notProcessedOrders, setNotProcessedOrders] = useState([]);

  // Fetch orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/all-orders");
      setOrders(data);
     // console.log("all order from backend is ", data);
      // Filter orders with status "Not processed"
      const filteredOrders = data.filter(
        (order) => order.status === "Not Processed"
      );
     // console.log("filtered order is ", filteredOrders);
      setNotProcessedOrders(filteredOrders);
    } catch (error) {
      toast.error("Error fetching orders!");
      console.error(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const backgroundImageUrl =
    "https://asset.gecdesigns.com/img/wallpapers/fairytale-valley-at-night-glowing-flowers-nature-wallpaper-sr10012422-1706504489805-cover.webp";

  const dashboardStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  const cardStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.001)", // semi-transparent white background
    color: "white", // default text color
    borderRadius: "8px", // rounded corners
    flexGrow: 1, 
    backdropFilter: "blur(10px)", // apply blur effect
    WebkitBackdropFilter: "blur(10px)", // for Safari
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // subtle shadow for depth
    border: "1px solid rgba(255, 255, 255, 0.3)", // light border for glass effect
  
  };

  return (
    <Layout title={`${auth.user.name} Dashboard`}>
      <div
        className="container-fluid m-0.4 p-1 dashboard text-center"
        style={dashboardStyle}
      >
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
         
            <div className="card w-80 mb-4 mt-5" style={cardStyle}>
            <h3>Admin Name: {auth?.user?.name || "Loading..."}</h3>
              <h3>Admin Email: {auth?.user?.email || "Loading..."}</h3>
              <h3>Admin Contact: {auth?.user?.phone || "Loading..."}</h3>
            </div>

            {/* Display the count of "Not processed" orders */}
            <div className="card w-80 mb-4" style={cardStyle}>
              <h3>Total "Not processed" Orders: {notProcessedOrders.length}</h3>
            </div>

            {/* List all "Not processed" orders */}
            {notProcessedOrders.length > 0 ? (
              <div className="card w-80 text-black d-flex flex-column flex-grow-1" style={{ ...cardStyle, minHeight: "100vh" }} >
                <h3>Orders with Status: "Not processed"</h3>
                <ul>
                  {notProcessedOrders.map((order, index) => (
                    <li key={order._id}>
                      <strong>Order {index + 1}:</strong> <br />
                      <strong>Customer Name:</strong>{" "}
                      {order.buyer.name || "Customer name not available"} <br />
                      <strong>Products:</strong>
                      <ul>
                        {order.products && order.products.length > 0 ? (
                          order.products.map((product, productIndex) => (
                            <li key={productIndex}>
                              {product.name || "Product name not available"}
                            </li>
                          ))
                        ) : (
                          <li>No products available</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="card w-80" style={cardStyle}>
                <h3>No "Not processed" orders found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminMenu.css";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Successfully Logged Out");
    navigate("/"); // Navigate to the home page after logout
  };

  return (
    <div className="admin-menu-container text-center" style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "white" }}>
      <button className="menu-toggle" onClick={toggleMenu}>
        Admin Menu {isMenuOpen ? "▲" : "▼"}
      </button>

      {/* Corrected className syntax */}
      <div className={`menu-links ${isMenuOpen ? "show" : ""}`}>
        <h4>Admin Panel</h4>
        <Link to="/dashboard/admin">Profile</Link>
        <Link to="/dashboard/admin/create-category">Create Category</Link>
        <Link to="/dashboard/admin/create-product">Create Product</Link>
        <Link to="/dashboard/admin/products">Manage Products</Link>
        <Link to="/dashboard/admin/orders">Orders</Link>
        <Link to="/dashboard/admin/users">Users</Link>

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={handleLogout}
            style={{
              textAlign: "left",
              color: "white",
              width: "12rem",
              display: "inline-block",
              textDecoration: "none",
              background: "none",
              border: "none",
              padding: "2px",
              marginTop: "1rem",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

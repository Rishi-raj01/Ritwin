import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const UserMenu = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Toggle state

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Successfully Logged Out");
    navigate("/");
  };

  return (
    <div>
      <div className="text-center dashboard-menu">
        {/* Toggle Button for Mobile View */}
        <button className="btn btn-light d-md-none mb-2" onClick={() => setIsOpen(!isOpen)}>
          ☰ Dashboard
        </button>

        {/* Dashboard Menu */}
        {(isOpen || window.innerWidth >= 768) && (
          <div className="list-group">
            <NavLink
              to="/dashboard/user/profile"
              className="list-group-item list-group-item-action"
              style={{ background: "rgba(0,0,0,0.2)", color: "white", border: "none" }}
            >
              Profile
            </NavLink>
            <NavLink
              to="/dashboard/user/orders"
              className="list-group-item list-group-item-action"
              style={{ background: "rgba(0,0,0,0.2)", color: "white", border: "none" }}
            >
              Orders
            </NavLink>
            <button
              style={{ background: "rgba(0,0,0,0.2)", color: "white", border: "none" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;

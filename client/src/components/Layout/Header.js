import React, { useState } from "react";
import "../../index.css";
import { useAuth } from "../../context/auth";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShopware } from "react-icons/fa6";
import { toast } from "react-toastify";
import SearchInput from "../Form/SearchInput";
import useCategory from "../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import ritwinLogo from "./ritwin.png"

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [cart] = useCart(); // Default to an empty array if cart is undefined
  const navigate = useNavigate();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth"); // No extra spaces in "auth"
    toast.success("Successfully Logged Out");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid ">
          <div className="d-flex align-items-center ">
          <Link
  to="/"
  className="navbar-brand d-none d-md-block" /* Visible only on desktop */
>
  <img
    src={ritwinLogo}
    alt="Ritwin Logo"
    style={{ height: "3rem", marginRight: "1.5rem",width: "5rem",  borderRadius: "50%",marginTop:"1px" }}
  />
  <span className="brand-text" style={{marginTop:"2rem"}}>Ritwin</span>
</Link></div> 
        
          
          
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            
       
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>

              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === "admin" ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              <SearchInput />

              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  <Badge count={cart.length} showZero offset={[10, -5]}>
                    Cart
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>




          

          <div className="d-block d-md-none d-flex justify-content-between w-100">
      {/* Left Side: Logo and Name */}
      <div className="d-flex align-items-center">
        <Link to="/" className="navbar-brand">
          <img
            src={ritwinLogo}
            alt="Ritwin Logo"
            style={{ height: "3rem", marginRight: "2rem",width: "5rem",  borderRadius: "50%", }}
          />
          <span className="brand-text" style={{ fontSize: "18px" }}>
            Ritwin
          </span>
        </Link>
      </div>
      
      {/* Right Side: Profile, Search, and Cart */}
      <div className="d-flex align-items-center ms-auto">
        <NavLink
          to={auth?.user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
          className="mx-3"
          style={{ textDecoration: "none", color: "black" }}
        >
          <i className="fa fa-user" style={{ fontSize: "24px" }} />
          <span>👨🏻‍💼</span>
        </NavLink>

        {/* Search Icon Button */}
        <button
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px" }}
          onClick={() => setShowSearch(!showSearch)}
        >
          ⌕
        </button>

        <NavLink
          to="/cart"
          className="mx-1"
          style={{ textDecoration: "none", marginRight: "0px", paddingRight: "0px" }}
        >
          <Badge count={cart.length} showZero offset={[10, -5]}>
            <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }} />
            🛒
          </Badge>
        </NavLink>
      </div>
    </div>

    {/* Conditionally Render the Search Input */}
    {showSearch && (
      <div className="p-1">
        <SearchInput />
      </div>
    )}
    
  

        </div>
      </nav>
      <style>{`.navbar-brand .brand-text {
  font-size: 1rem; /* Default size for mobile */
}

@media (min-width: 768px) { /* For tablets and larger screens */
  .navbar-brand .brand-text {
    font-size: 1.5rem; /* Larger font size for laptop screens */
  }
}

@media (min-width: 1200px) { /* For extra large screens */
  .navbar-brand .brand-text {
    font-size: 2rem; /* Even larger font size for desktops */
  }
}
`}</style>
    </>
  );
};

export default Header;

import React, { useState,useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate,useLocation } from "react-router-dom"
import{toast} from "react-toastify"
import axios from 'axios'
import { useAuth } from "../../context/auth"
import "../../styles/AuthStyles.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/user/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({...auth,user: res.data.user,token: res.data.token });
       // console.log("auth from login is ",auth)
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  return (
    
    <Layout title="Login - Shopsphere App">
    <div
      className="form-container"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://asset.gecdesigns.com/img/wallpapers/fairytale-valley-at-night-glowing-flowers-nature-wallpaper-sr10012422-1706504489805-cover.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h4 className="title">LOGIN FORM</h4>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            autoFocus
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Email"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Enter Your Password"
            required
          />
        </div>
        <div className="mb-2 d-flex ">
          <button

            type="button"
            className="btn forgot-btn "
            onClick={() => {
             // Navigate to forgot password page
              navigate("/forget-password");
            }}
          >
            Forgot Password
          </button>
        
        <button type="submit" className="btn btn-primary">
          LOGIN
        </button>
        <button

type="button"
className="btn forgot-btn  mx-3"
onClick={() => {
 // Navigate to forgot password page
  navigate("/register");
}}
>
Register
</button>
        
        </div>
      </form>
    </div>
  </Layout>
  )
}

export default Login

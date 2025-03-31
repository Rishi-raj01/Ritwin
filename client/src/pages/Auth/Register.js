import React,{ useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate,useLocation} from "react-router-dom"
import{toast} from "react-toastify"
import axios from 'axios'


import "../../styles/AuthStyles.css"
const Register = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("")
  const[phone,setPhone]=useState("");
  const[location,setLocation]=useState("");
  const navigate = useNavigate();
 

 //  /api/v1/user/signup
const handleSubmit=async(e)=>{
    e.preventDefault();
   

    try {
        const user = { name, email, password, phone, location };
        console.log(user)
        const res = await axios.post("/api/v1/user/signup", user); // sends `user` to the serve
        console.log(res);
        if (res && res.data.success) {
            toast.success('User registered successfully');
            navigate("/login");
          } else {
            toast.error(res.data.message);
          }
        
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
}








  return (
   
    <Layout title="Register - ShopSphere App">
      <div
        className="form-container "
        style={{
          minHeight: "100vh",
          backgroundImage:
            "url('https://asset.gecdesigns.com/img/wallpapers/fairytale-valley-at-night-glowing-flowers-nature-wallpaper-sr10012422-1706504489805-cover.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          border:"none",
          justifyContent: "center",
          backgroundColor:"rgba(0,0,0,0.0001)",
        }}
      >
        <form className="form-box text-black" style={{border:"none"}}   onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="form-control text-black"
              placeholder="Enter Your Name"
              required
              autoFocus
              style={{ color: 'white'}} 
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="form-control"
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
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="form-control"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={location}
              onChange={(e)=>setLocation(e.target.value)}
              className="form-control"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <button type="submit" className="btn ">
            REGISTER
          </button>
          <button
            type="button"
            className="btn forgot-btn my-2 "
            onClick={() => {
             // Navigate to forgot password page
              navigate("/login");
            }}
          >
            Login
          </button>
        </form>
      </div>
      <style>{``}</style>
    </Layout>


  )
}

export default Register

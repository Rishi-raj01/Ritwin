import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  
  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('/api/v1/user/forgetpassword', { email });

      if (response.data.success ===true) {
        toast.success('Password reset link has been sent to your email');
      } else {
        toast.error('Something went wrong, please try again');
      }
    } catch (error) {
      console.error('Error occurred during password reset:', error);
      toast.error('Network error occurred');
    }
  };

  return (
    <Layout>
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" 
           style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url("https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp")', backgroundSize: 'cover' }}>
        
        <form className="w-50 m-auto border rounded p-4" onSubmit={handleForgetPassword} 
              style={{ background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
            
            <h2 className="text-center text-white mb-4">Forget Password</h2>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                aria-describedby="emailHelp" 
                style={{ background: 'rgba(255, 255, 255, 0.15)', transition: 'background 0.3s ease' }} 
                required
              />
              <div id="emailHelp" className="form-text text-white">
                We'll never share your email with anyone.
              </div>
            </div>
  
            <button type="submit" className="btn btn-success w-100" style={{ transition: 'background-color 0.3s ease' }}>
              Submit
            </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgetPassword;

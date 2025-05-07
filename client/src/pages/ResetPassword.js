import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios";
import Layout from '../components/Layout/Layout';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
       
        const response = await axios.post(`/api/v1/user/resetpassword/${token}`, { password, confirmPassword });
        // console.log("response is ",response)
        // console.log("data is " ,response.data);
        // console.log("success  is " ,response.data.success);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };
  

  return (
    <Layout>
    <div className="reset-password-container">
      <h2 className="reset-password-heading">Reset Password</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="password" className="input-label">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn">Reset Password</button>
      </form>
    </div>
    <style>{`/* Styles for Reset Password Component */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 0 20px;
}

.reset-password-heading {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.reset-password-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fafafa;
  transition: background-color 0.3s ease;
}

.input-field:focus {
  background-color: #e8f0fe;
  border-color: #3b82f6;
  outline: none;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #218838;
}
`}</style>
    </Layout>
  );
};

export default ResetPassword;

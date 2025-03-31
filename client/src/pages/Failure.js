import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
const Failure = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <Layout>
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4 border-danger">
        <div className="card-body text-center">
          <div className="alert alert-danger">
            <h2 className="alert-heading mb-4">Oops! Something went wrong.</h2>
            <p className="mb-4">
              Unfortunately, we couldn't process your request. Please try again later or return to the homepage.
            </p>
          </div>
          <button 
            className="btn btn-danger btn-lg" 
            onClick={handleHomeRedirect}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Failure;

import React from "react";
import  { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/Search";
import { Link ,useNavigate} from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import axios from "axios";

const Search = () => {
  const [values, setValues] = useSearch();
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
    const navigate = useNavigate();
  const [product, setProduct] = useState({});
    
  
  
    const handlePayment = async (product) => {
      try {
        setLoading(true);
        const productData = {
          id: product.id, // Product ID
          name: product.name, // Product name
          price: product.price, // Product price
        };
        console.log("user is ", auth.user);
        console.log("product is ", product);
        // Create order on your server
        const { data: order } = await axios.post("/api/v1/product/orders", {
          amount: product.price * 100, // Multiply by 100 for paise
          product: productData, // Include the product ID for reference
          auth, // Pass user details
        });
  
        console.log("Order Data:", order);
        const options = {
          //key: "rzp_test_xkZhbPPhzFGU8G",
          key:process.env.RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Ritwin Handmade Company",
          description: `Payment for ${product.name}`,
          image: "https://your-logo-url.com/logo.png",
          order_id: order.id,
          handler: async function (response) {
            try {
              // Verify payment on the server
              const verification = await axios.post(
                "/api/v1/product/payment-callback",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  productId: product.id,
                  user: auth.user,
                }
              );
  
              if (verification.data.success) {
                console.log("Verification successful", verification.data.success);
                toast.success("Payment Completed Successfully");
                navigate("/success");
              } else {
                navigate("/failure");
                toast.error(
                  verification.data.message || "Payment verification failed."
                );
              }
            } catch (error) {
              console.error("Verification error:", error);
              navigate("/failure");
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: auth?.user?.name || "Guest",
            email: auth?.user?.email || "guest@example.com",
            contact: auth?.user?.phone || "No Number",
          },
          theme: {
            color: "#3399cc",
          },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
      } catch (error) {
        console.error("Payment initialization failed:", error);
        setLoading(false);
        navigate("/failure");
        toast.error("Payment initialization failed.");
      }
    };
  return (
    <Layout title={"Search results"}>
      <div className="container mt-2">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
  {values?.results.length < 1
    ? "No Products Found"
    : `Found ${values?.results.length}`}
</h6>


          <div className="row justify-content-center">
            {values?.results.map((a, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3 mb-3">
                <div
                  className="card h-100 mx-1"
                  style={{
                    maxHeight: "360px",
                    height: "auto",
                    overflow: "hidden",
                  }}
                >
                  <Link to={`/product/${a.slug}`} className="product-link">
                    <img
                      src={a.photos[0]}
                      className="card-img-top"
                      alt={a.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{a.name}</h5>
                      <p className="card-text">
                        {a.description.substring(0, 30)}...
                      </p>

                      <div className="card-buttons">
                        <p className="card-text price-text">
                          <strong>₹ {a.price}</strong>
                        </p>
                        <button className="btn btn-secondary ms-1 add-to-cart-btn" onClick={() => handlePayment(a)}>
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .card-img-top {
          object-fit: contain;
          width: 100%;
          height: 180px;
        }

        .card-body {
          padding: 10px;
        }

        .card-title {
          font-size: 1.1rem;
        }

        .card-text {
          font-size: 0.9rem;
        }

        .price-text {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .add-to-cart-btn {
          font-size: 0.8rem;
          padding: 6px 10px;
        }

        .card-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Ensure 2 columns from 390px and up */
        @media (max-width: 767px) {
          .col-6 {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        /* Desktop view enhancements */
        @media (min-width: 992px) {
          .card {
            max-width: 17rem;
          }
          .card-img-top {
            height: 200px;
          }
          .card-title {
            font-size: 1.2rem;
          }
          .card-text {
            font-size: 1rem;
          }
          .add-to-cart-btn {
            font-size: 0.9rem;
            padding: 8px 12px;
          }
        }

        /* Small mobile adjustments */
        @media (max-width: 390px) {
          .col-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .card-img-top {
            height: 140px;
          }
          .card-title {
            font-size: 0.9rem;
          }
          .card-text {
            font-size: 0.8rem;
          }
          .add-to-cart-btn {
            font-size: 0.7rem;
            padding: 4px 6px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Search;

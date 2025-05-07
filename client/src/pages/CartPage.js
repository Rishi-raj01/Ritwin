import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const location = useLocation();
 

   // Initialize cart from localStorage on component mount
   useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [setCart]);


  const totalPrice = () => {
    let total = 0;
    cart?.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  const updateCartItemQuantity = (pid, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) =>
      item._id === pid ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeCartItem = (pid,name) => {
    const myCart = cart.filter((item) => item._id !== pid);
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
    toast.success(`${name} removed from cart`);
    toast('still unsure what to buy?Talk with us for customization')
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const cartData = cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
  
      // Create order on your server
      const { data: order } = await axios.post("/api/v1/product/orders", {
        amount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100,
        auth,
        cart: cartData, 
      });
      console.log("Order Data:", order);
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Ritwin Handmade Company",
        description: "Payment for your order",
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on the server
            const verification = await axios.post("/api/v1/product/payment-callback", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cart: cartData,
              user: auth.user,
            });
  
            if (verification.data.success) {
              // console.log("Verification successful",verification.data.success);
               // await axios.post("/api/v1/product/update-quantities", { cart });
               const updatedProducts = await axios.post("/api/v1/product/update-quantities", {
                 cart:cartData,
               });
               localStorage.removeItem("cart");
               setCart([]);
               toast.success("Payment Completed Successfully");
              // console.log(" frontend Payment Completed Successfully");
               // Pass order details to success page
            navigate("/success", { state: { cart: cartData, total: order.amount / 100 } });
              
             } else {
              navigate("/failure"); // Navigate to failure page
              toast.error(verification.data.message || "Payment verification failed.");
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
    <Layout>
      <div className="container cart-page my-4">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="bg-light p-1">
              {!auth?.user
                ? "Welcome Guest"
                : `Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <p className="lead">
              {cart?.length
                ? `You have ${cart.reduce((acc, item) => acc + item.quantity, 0)} items in your cart ${
                    auth?.token ? "" : ", please login to checkout!"
                  }`
                : "Your Cart is Empty"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-md-7 mb-1">
            {cart?.length ? (
              cart.map((p) => (
                <div className="card mb-3 shadow-sm d-flex flex-row align-items-center" key={p._id}>
                  <img
                  
                   src={p.photos.length > 0 ? p.photos[0] : "default.jpg"}
                    className="card-img-top rounded-start"
                    alt={p.name}
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="fw-bold">Price: {p.price}</p>
                    <div className="d-flex align-items-center mt-3 mb-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          p.quantity > 1 &&
                          updateCartItemQuantity(p._id, p.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="mx-2">{p.quantity || 1}</span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          updateCartItemQuantity(p._id, (p.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger btn-sm mt-3 align-self-start"
                      onClick={() => removeCartItem(p._id,p.name)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in your cart</p>
            )}
          </div>
          <div className="col-lg-4 col-md-5">
            <div className="card p-3 shadow-sm sticky-sidebar">
              <h3 className="text-center">Cart Summary</h3>
              <h4>Total: {totalPrice()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", 
                         // state: "/cart",
                         { state: { from: location.pathname } }
                        )
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <button
                className="btn btn-primary w-100"
                onClick={handlePayment}
                disabled={loading || !auth?.user}
              >
                {loading ? "Processing..." : "Make Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;

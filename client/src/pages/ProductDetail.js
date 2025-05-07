import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams,useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";
import Layout from "../components/Layout/Layout";

const ProductDetails = () => {
  const params = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showWithPhotos, setShowWithPhotos] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const filteredReviews = showWithPhotos
    ? reviews.filter((review) => review.photo)
    : reviews;

  const limitReviewText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/products/${params.slug}`
      );
      console.log("data is ", data);
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch product details
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);
  const getSimilarProducts = async (pid, cid) => {
    try {
      console.log(`productid is ,${pid}, ${cid} `);
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      console.log("similar product called ");

      console.log("data from backend is ", data);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Saving to localStorage
  const addToCart = (product) => {
    // Check if the product has stock available
    if (product.quantity && product.quantity > 0) {
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 } // Increase quantity if item is already in cart
            : item
        );

        // Add product to the cart if it's not already present
        if (!prevCart.some((item) => item._id === product._id)) {
          updatedCart.push({ ...product, quantity: 1 });
        }

        // Update localStorage with the updated cart
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      toast.success(`${product.name} added to cart`);
    } else {
      toast.error("Product is out of stock!");
    }
  };

  //reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/products/${params.slug}/reviews`,
          {
            params: { page, limit: 5 },
          }
        );
        console.log("Reviews from backend:", data);

        // Append new reviews to the previous ones
        setReviews((prev) => [...prev, ...data.reviews]);

        // Set if there are more reviews to load
        setHasMore(data.reviews.length > 5);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    // Only call fetchReviews when page changes
    if (page > 0) {
      fetchReviews();
    }
  }, [page, params.slug]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

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
  //src={product?.photos?.length > 0 ? product.photos[0] : "default.jpg"}
  return (
    <Layout>
      <div className="container">
        {/* Product Details */}
        <div className="row my-5 align-items-center">
  {/* Image Column */}
  <div className="col-md-6 d-flex justify-content-center">
    <div
      id="productCarousel"
      className="carousel slide"
      style={{
        maxWidth: "100%",
        borderRadius: "8px",
        overflow: "hidden",
         width: "100%",
        marginLeft: "0.6rem",
      }}
    >
      {/* Carousel Indicators */}
      <ol className="carousel-indicators">
        {product?.photos?.map((photo, index) => (
          <li
            key={index}
            data-bs-target="#productCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          ></li>
        ))}
      </ol>

      {/* Carousel Items */}
      <div className="carousel-inner">
        {product?.photos?.map((photo, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={photo}
              className="d-block w-100"
              alt={`Product Image ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              style={{
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "8px",
                width: "100%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#productCarousel"
        data-bs-slide="prev"
        style={{ filter: "invert(0.5)" }}
      >
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#productCarousel"
        data-bs-slide="next"
        style={{ filter: "invert(0.5)" }}
      >
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  </div>

  {/* Product Details Column */}
  <div className="col-md-6 d-flex flex-column justify-content-center" style={{paddingLeft:"1.5rem"}}>
    <h2 className="mb-3">{product.name}</h2>
    <p>{product.description}</p>
    <h5>
      Price:{" "}
      {product?.price?.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      })}
    </h5>
    <p>Category: {product?.category?.name}</p>
    <p>Shipping: {product?.shipping ? "Yes" : "No"}</p>
    <p>Available: {product?.quantity}</p>

    {/* Button Container */}
    <div className="d-flex justify-content-start mt-3">
      <button
        className="btn btn-primary mx-2"
        style={{ width: "10rem" }}
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
      {/* <button
        className="btn btn-primary mx-2"
        style={{ width: "10rem" }}
        onClick={() => handlePayment(product)}
      >
        Buy Now
      </button> */}


{auth?.token ? (
                 <button
                 className="btn btn-primary mx-2"
                 style={{ width: "10rem" }}
                 onClick={() => handlePayment(product)}
               >
                 Buy Now
               </button>  
                  ) : (
                    <button
                      className="btn btn-primary mx-2"
                      style={{ width: "10rem" }}
                      
                      onClick={() => {
                        console.log("Navigating from:", location.pathname); // ✅ Correct Syntax
                        navigate("/login", { state: { from: location.pathname } });
                      }}
                    >
                      Buy Now
                    </button>
                  )}
    </div>
  </div>
</div>


        <hr />

        {/* reviews */}

        <h3 className="my-4 text-center">Reviews</h3>
        <div className="container">
          {/* <h3 className="my-4">Customer Reviews</h3> */}

          <div className="d-flex justify-content-center mb-3">
            <button
              className={`btn btn-sm ${
                showWithPhotos ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setShowWithPhotos(!showWithPhotos)}
              style={{ width: "200px" }}
            >
              {showWithPhotos ? "Show All Reviews" : "Show Reviews with Photos"}
            </button>
          </div>

          {/* Responsive Reviews Grid */}
          <div className="row g-3">
            {filteredReviews.length ? (
              filteredReviews.map((review, index) => (
                <div
                  key={index}
                  className="col-6 col-sm-6 col-md-4 col-lg-3 mb-1"
                >
                  <div
                    className="card shadow-sm p-2 h-150 border-0 rounded-3 overflow-hidden"
                    onClick={() => setSelectedReview(review)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Review Image */}
                    {review.photo ? (
                      <img
                        src={review.photo}
                        alt="Review"
                        className="card-img-top"
                        style={{
                          marginTop: "0px",
                          height: "5rem", // Decreased height for better fit
                          //width:"auto",
                         objectFit: "contain",
                         //objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light mt-0"
                        style={{
                          height: "5rem",
                          color: "#aaa",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          border: "1px dashed #ddd",
                        }}
                      >
                        No Photo Available
                      </div>
                    )}

                    {/* Review Content */}
                    <div
                      className="card-body d-flex flex-column text-wrap flex-grow-1"
                      style={{
                        maxHeight: window.innerWidth <= 768 ? "260px" : "auto", // Adjust maxHeight for mobile view
                        overflow: "hidden", // Ensure content doesn't overflow if height is restricted
                      }}
                    >
                      <h6 className="card-title mb-0">
                        Rating: {review.rating}{" "}
                        <span className="text-warning">★</span>
                      </h6>
                      <p className="card-text flex-grow-1 mt-0">
                        <strong>Comment:</strong>{" "}
                        {limitReviewText(
                          review.comment,
                          window.innerWidth <= 768 ? 5 : 8
                        )}
                      </p>
                      <p className="card-text mb-0">
                        <strong>Commented by:</strong> {review.userId.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No reviews found.</p>
            )}
          </div>

          {/* Review Popup */}

          {selectedReview && (
            <div
              className="popup-overlay"
              onClick={() => setSelectedReview(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="popup-content"
                style={{
                   position:"relative",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color:"rgb(11, 200, 156)",
                  zIndex: 40,
                  padding: "20px",
                  borderRadius: "8px",
                  maxWidth: "600px",
                  width: "80%",
                }}
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
              >
                <h5>{selectedReview.userId.name}'s Full Review</h5>
                <p>
                  <strong>Rating:</strong> {selectedReview.rating}{" "}
                  <span className="text-warning">★</span>
                </p>
                {/* <img src={} alt="" /> */}

                {selectedReview.photo ? (
                  <img
                    src={selectedReview.photo}
                    alt="Review"
                    className="card-img-top"
                    style={{
                      height: "300px", // Decreased height for better fit
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{
                      height: "160px",
                      color: "#aaa",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      border: "1px dashed #ddd",
                    }}
                  >
                    No Photo Available
                  </div>
                )}

                <p>
                  <strong>Comment:</strong> {selectedReview.comment}
                </p>
                <p>
                  <strong>Commented By:</strong> {selectedReview.userId.name}
                </p>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSelectedReview(null)}
                  style={{ marginTop: "10px" }}
                >
                  Close
                </button>
              </div>



              
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center my-4">
              <button onClick={loadMore} className="btn btn-primary">
                Load More
              </button>
            </div>
          )}

          {/* Write a Review Button */}
          <div className="text-center mt-4">
            <Link to={`/dashboard/user/create-review/${params.slug}`}>
              <button className="btn btn-primary" style={{ maxWidth: "9rem" }}>
                Write a Review
              </button>
            </Link>
          </div>
        </div>

         {/* Similar Products */}
         <h3 className="my-4 ">Similar Products</h3>
        {relatedProducts.length === 0 ? (
          <p>No similar products found.</p>
        ) : (
          <div className="row  mx-1">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="col-6 col-md-3 mb-4 d-flex align-items-stretch"
              >
                <div
                  className="card w-100"
                  style={{
                    maxHeight: "350px", // Limit the card height
                    height: "auto", // Allow height to adjust based on content
                    overflow: "hidden", // Prevent overflow
                  }}
                >
                  <Link
                    to={`/product/${relatedProduct.slug}`}
                    className="product-link"
                  >
                    <img
                     // src={`/api/v1/product/get-photos/${relatedProduct._id}`}
                     src={
                      relatedProduct?.photos?.length > 0
                        ? relatedProduct.photos[0]
                        : "default.jpg"
                    }
                      style={{
                        height: "200px", // Adjust height of the image
                        objectFit: "cover", // Maintain aspect ratio and crop overflow
                      }}
                      className="card-img-top"
                      alt={relatedProduct.name}
                    />
                  </Link>
                  <div className="card-body h-100 d-flex flex-column">
                    <Link
                      to={`/product/${relatedProduct.slug}`}
                      className="product-link"
                    >
                      <h5 className="card-title">{relatedProduct.name}</h5>
                    </Link>
                    <div className=" mt-auto d-flex justify-content-between align-items-center mt-auto mb-0.5">
                      <h5 className="text-success mb-0 "  style={{ fontSize: '1rem' }}>
                        {relatedProduct.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                      
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(relatedProduct)}
                      >
                        Add to Cart
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
              
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) {
  .card {
    max-height: 300px; /* Reduce height on smaller screens */
  }
  .card-img-top {
    height: 150px; /* Adjust image height */
  }
}

@media (max-width: 576px) {
  .card {
    max-height: 250px; /* Further reduce height on mobile devices */
  }
  .card-img-top {
    height: 120px; /* Adjust image height */
  }
}
`}</style>
    </Layout>
  );
};

export default ProductDetails;

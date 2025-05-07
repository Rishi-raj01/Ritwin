import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import "./Product.css";
import "../../index.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/v1/product/allproducts");
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleMenuVisibility = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <Layout>
      <div className="products-container container-fluid">
        <div className="row">
          {isMenuVisible && (
            <div className="col-md-3 admin-menu">
              <AdminMenu toggleMenu={toggleMenuVisibility} />
            </div>
          )}
         <div className={`col ${isMenuVisible ? "col-md-9" : "col-md-12"}`}>
  <div className="product-grid row">
    {products.map((product) => (
      <div
        key={product._id}
        className="product-card col-lg-3 col-md-4 col-sm-6 mb-4" // Add bottom margin
      >
        <Link
          to={`/dashboard/admin/product/${product.slug}`}
          className="product-link"
        >
          <div className="card">
            <img
          // src={`/api/v1/product/get-photos/${product._id}`}
             src={product?.photos?.length > 0 ? product.photos[0] : "default.jpg"}

              alt={product.name}
              className="card-img-top product-image"
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text description">
                {product.description
                  ? product.description
                      .split(" ")
                      .slice(0, 10)
                      .join(" ") + "..."
                  : "No description available."}
              </p>
              <p className="card-price">Price: ₹{product.price}</p>
            </div>
          </div>
        </Link>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </Layout>
  );
};

export default Products;

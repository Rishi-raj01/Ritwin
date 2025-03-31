import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams,useNavigate } from "react-router-dom";
//import "../styles/ProductDetailsStyles.css";

const ProductCategory = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) {
      getProductCategory();
    }
  }, [params?.slug]);

  const getProductCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );

     // console.log("Response from backend:", data);
     // console.log("Response from data.products:", data.products);


      setCategory(data?.category);
      setProducts(data?.products);
    } catch (error) {
      console.error("Error fetching product category:", error);
    }
  };

  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          <div className="col-md-9 offset-1">
          <div className="d-flex flex-wrap justify-content-center">
            {products?.map((product) => (
              <div
                key={product._id}
                className="product-card col-lg-3 col-md-4 col-sm-6 col-6 mb-4"
              >
                <Link to={`/product/${product.slug}`} className="product-link">
                  <div className="card h-100 mx-2">
                    <div className="image-container">
                      <img
                        src={product.photos.length > 0 ? product.photos[0] : "default.jpg"}
                        alt={product.name}
                        className="card-img-top product-image"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title product-title">{product.name}</h5>
                      <p className="card-text description">
                        {product.description
                          ? product.description.split(' ').slice(0, 8).join(' ') + '...'
                          : 'No description available.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="card-price mb-0">Price: ₹{product.price}</p>
                        <button className="btn btn-primary btn-sm">Add to cart</button>
                      </div>
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

export default ProductCategory;

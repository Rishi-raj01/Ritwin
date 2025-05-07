import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import { Checkbox, Radio } from "antd";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";
import { Prices } from "../../src/components/Layout/Prices";
import { useCart } from "../context/cart";
import debounce from "lodash.debounce"; // For debouncing API calls

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch total products count
  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Fetch products
  const getAllProducts = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
        setLoading(false);
  
        // Ensure data.products is an array before spreading
        setProducts((prev) => [...prev, ...(Array.isArray(data?.products) ? data.products : [])]);
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error("Something went wrong");
      }
    }, 100), // Debounced by 300ms
    [page]
  );
  

  // Fetch categories
  const getAllCategory = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/category/allcategory");
      if (res.data.success) {
        setCategories(res.data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, [getAllCategory, getTotal]);

  // Filter products
  const filterProduct = useMemo(
    () =>
      debounce(async () => {
        try {
          const { data } = await axios.post("/api/v1/product/product-filters", {
            checked,
            radio,
          });
          setProducts(data?.products);
        } catch (error) {
          console.error(error);
        }
      }, 300),
    [checked, radio]
  );

  // Handle category filter
  const handleFilter = useCallback((value, id) => {
    setChecked((prevChecked) =>
      value ? [...prevChecked, id] : prevChecked.filter((c) => c !== id)
    );
  }, []);

  // Load more products dynamically
  const loadMore = useCallback(async () => {
    setPage((prevPage) => prevPage + 1);
  }, []);


  const addToCart = (productId, name) => {
    const productToAdd = products.find((prod) => prod._id === productId);
  
    if (productToAdd?.quantity > 0) {
      // Update the products list (decrease quantity)
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === productId
            ? { ...prod, quantity: prod.quantity - 1 }
            : prod
        )
      );
  
      // Update the cart with unique items and handle quantity increase
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
  
        if (!prevCart.some((item) => item._id === productId)) {
          updatedCart.push({ ...productToAdd, quantity: 1 });
        }
  
        // Update localStorage with the updated cart
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
  
      toast.success(`${name} added to cart`);
    } else {
      toast.error("Product is out of stock!");
    }
  };
  




  // Effects
  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length, getAllProducts]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio, filterProduct]);

  useEffect(() => {
    if (page > 1) getAllProducts();
  }, [page, getAllProducts]);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);


  return (
    <Layout title="All products - Ritwin">
      <div className="row"  >
      <div className="container-fluid" style={{marginTop:"0px",paddingTop:"0px", marginRight:"0px",  maxWidth: "100vw"}}>
        <div className="filter-button-container" >
          <button className="filter-button" onClick={toggleDropdown}>
            Filter
          </button>
          {dropdownOpen && (
            <div className="filter-dropdown">
              <h4>Filter By Category</h4>
              <div className="d-flex flex-column">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
              <h4 className="mt-3">Filter By Price</h4>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices?.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
              <button
                className="btn btn-danger mt-3"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>

        <div className="row mt-2 mx-2" >
          <h1 className="text-center col-12 mb-4">All Products</h1>
          
          <div className="d-flex flex-wrap justify-content-center">
  {products?.map((product) => (
    <div
      key={product._id}
      className="product-card col-lg-3 col-md-4 col-sm-6 col-6 mb-3"
    >
      <div
        className="card h-100 d-flex flex-column mx-2"
        style={{
          maxHeight: "360px",
          height: "auto",
          overflow: "hidden",
        }}
      >
        <Link to={`/product/${product.slug}`} className="product-link">
          <div className="image-container">
          
       <img
            src={product.photos.length > 0 ? product.photos[0] : "default.jpg"}
            alt={product.name}
            className="card-img-top product-image"
            style={{ aspectRatio: "1/1.1" }}
        />

          </div>
          <h5 className="card-title product-title px-2 mt-2">
            {product.name}
          </h5>
        </Link>
        <div className="card-body px-2 py-1 d-flex flex-column">
          <p className="card-text description mb-2">
            {product.description
              ? product.description.split(" ").slice(0, 12).join(" ") + "..."
              : "No description available."}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto mb-2">
            <p className="card-price mb-0">Price: ₹{product.price}</p>
            <button
  className="btn btn-primary"
  onClick={() => addToCart(product._id, product.name)} // Just call addToCart
  disabled={product.quantity === 0} // Disable button if out of stock
>
  Add to cart
</button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn bg-dark text-white loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Updated Styles */}
      <style>{`
        .filter-button-container {
          position: fixed;
          top: 5.2rem;
          right: 20px;
          z-index: 1050;
        }
        .filter-button {
          background-color:rgba(0, 0, 0, 0.5);
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .filter-button:hover {
          background-color:rgb(93, 175, 148);
        }
        .filter-dropdown {
          position: absolute;
          top: 40px;
          right: 0;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          width: 250px;
        }
        .filter-dropdown h4 {
          font-size: 16px;
          margin-bottom: 10px;
          color: #343a40;
        }
        .filter-dropdown button {
          width: 100%;
        }

        @media (max-width: 768px) {
          .filter-button {
            font-size: 12px;
            padding: 6px 10px;
          }
          .filter-dropdown {
            width: 200px;
          }
          .filter-dropdown h4 {
            font-size: 14px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;

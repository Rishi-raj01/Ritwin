import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/Search";
import { Link } from "react-router-dom";

const Search = () => {
  const [values, setValues] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>

          <div className="d-flex mt-4">
            {values?.results.map((a, index) => (
              <div className="card" key={index}>
                <Link to={`/product/${a.slug}`} className="product-link">
                  <img
                    src={`api/v1/product/get-photos/${a._id}`}
                    className="card-img-top"
                    alt={a.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{a.name}</h5>
                    <p className="card-text">
                      {a.description.substring(0, 30)}...
                    </p>

                    <div className="card-buttons">
                      <p className="card-text price-text"><strong>₹ {a.price}</strong></p>
                      <button className="btn btn-secondary ms-1 add-to-cart-btn">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
        .card {
          width: 100%;
          margin: 10px;
          border-radius: 8px; /* Add subtle rounding */
        }

        .card-img-top {
          object-fit: contain; /* Ensure full image visibility */
          width: 100%;
          height: 180px; /* Standardized height */
        }

        .card-body {
          padding: 10px;
        }

        .card-title {
          font-size: 1.1rem; /* Slightly smaller */
        }

        .card-text {
          font-size: 0.9rem;
        }

        .price-text {
          font-size: 1rem;
          font-weight: bold; /* Make price bold */
          margin-bottom: 5px;
        }

        .add-to-cart-btn {
          font-size: 0.8rem; /* Reduce text size */
          padding: 6px 10px; /* Reduce button size */
        }

        .card-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Grid layout */
        .d-flex {
          display: grid;
          gap: 10px;
        }

        /* Desktop view: 4 columns */
        @media (min-width: 768px) {
          .d-flex {
            grid-template-columns: repeat(4, 1fr);
          }
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
            padding: 8px 12px; /* Slightly larger on desktop */
          }
        }

        /* Mobile view: 2 columns */
        @media (min-width: 330px) and (max-width: 480px) {
          .d-flex {
            grid-template-columns: repeat(2, 1fr);
          }
          .card {
            max-width: 12rem;
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
            padding: 4px 6px; /* Compact button for small screens */
          }
        }
        `}
      </style>
    </Layout>
  );
};

export default Search;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../components/hooks/useCategory";
import Layout from "../components/Layout/Layout";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row container">
          {categories.map((d) => (
            <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={d._id}>
              <div className="card">
                <Link to={`/category/${d.slug}`} className="btn cat-btn">
                  {d.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;

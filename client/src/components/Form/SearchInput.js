import React, { useState } from "react";
import { useSearch } from "../../context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
       // console.log("handlesubmit of keyword from searchinput called")
        e.preventDefault();
        if (!values.keyword.trim()) {
          alert("Please enter a search keyword");
          return;
        }
      
        try {
            //console.log("word to be searched is ",values.keyword)
            const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
           // console.log("api is called and data is ",data)
          setValues({ ...values, results: data });
          navigate("/search");
        } catch (error) {
          console.error(error);
          alert("Error occurred while searching. Please try again.");
        }
      };
      
    return (
      <div>
        <form
          className="d-flex search-form"
          role="search"
          onSubmit={handleSubmit}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={values.keyword}
            onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    );
  };
  
  export default SearchInput;
  
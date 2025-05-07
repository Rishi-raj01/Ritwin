// import React, { useState } from "react";
// import { useSearch } from "../../context/Search";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const SearchInput = () => {
//     const [values, setValues] = useSearch();
//     const [keyword, setKeyword] = useState("");
//     const navigate = useNavigate();
  
//     const handleSubmit = async (e) => {
//        // console.log("handlesubmit of keyword from searchinput called")
//         e.preventDefault();
//         if (!values.keyword.trim()) {
//           alert("Please enter a search keyword");
//           return;
//         }
      
//         try {
//             //console.log("word to be searched is ",values.keyword)
//             const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
//            // console.log("api is called and data is ",data)
//           // setValues({ ...values, results: data });
//           setValues({ ...values, results: data, keyword }); 
//           navigate("/search");
//         } catch (error) {
//           console.error(error);
//           alert("Error occurred while searching. Please try again.");
//         }
//       };
      
//     return (
//       <div>
//         <form
//           className="d-flex search-form"
//           role="search"
//           onSubmit={handleSubmit}
//         >
//           <input
//             className="form-control me-2"
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//             value={values.keyword}
//             onChange={(e) => setValues({ ...values, keyword: e.target.value })}
//           />
//           <button className="btn btn-outline-success" type="submit">Search</button>
//         </form>
//       </div>
//     );
//   };
  
//   export default SearchInput;
  


import React, { useState, useEffect } from "react";
import { useSearch } from "../../context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Debounced autocomplete
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim().length >= 1) {
        fetchSuggestions(keyword);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const fetchSuggestions = async (word) => {
    try {
      const { data } = await axios.get(`/api/v1/product/search/${word}`);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("Please enter a search keyword");
      return;
    }

    try {
      const { data } = await axios.get(`/api/v1/product/search/${keyword}`);
      setValues({ ...values, results: data, keyword });
      navigate("/search");
    } catch (error) {
      console.error(error);
      alert("Error occurred while searching. Please try again.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <form className="d-flex search-form" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul
          className="list-group position-absolute"
          style={{
            top: "100%",
            zIndex: "1000",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setKeyword(item.name); // fill input
                setSuggestions([]);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;

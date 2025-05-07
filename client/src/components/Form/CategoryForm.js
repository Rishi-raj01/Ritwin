import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <>
      <form onSubmit={handleSubmit}  >
        <div className="mb-3" style={{ width: "50%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              backgroundColor: "transparent", // Makes the background transparent
              border: "1px solid rgba(0, 0, 0, 0.6)", // Adds a subtle border for clarity
              color: "#fff", // Makes the text inside the input field white
              padding: "10px",
              fontSize: "16px",
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <style jsx>{`
        input::placeholder {
          color: white !important; /* Forces the placeholder text to be white */
        }
      `}</style>
    </>
  );
};

export default CategoryForm;

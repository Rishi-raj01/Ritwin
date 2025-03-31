import React, { useState, useEffect } from 'react';
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import CategoryForm from '../../components/Form/CategoryForm';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/category/create-category", { name });
      if (res.data.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/allcategory");
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/api/v1/category/crud-category/${selected._id}, { name: updatedName }`);
      if (res.data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/crud-category/${pId}`);
      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setUpdatedName("");
    setSelected(null);
  };

  const backgroundImageUrl = "https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp";

  const dashboardStyle = {
    backgroundImage: `url("${backgroundImageUrl}")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
   
  };

  const cardStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    borderRadius: "8px",
    padding: "20px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    marginBottom: "20px",
  };

  const categoryListStyle = {
    ...cardStyle,
    marginTop: "20px",
    marginRight:"10px",
    paddingBottom: "20px",
  };

  const buttonStyle = {
    marginRight: "10px",
    
    fontSize: "14px",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    transition: "all 0.3s",
    cursor: "pointer",

  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#0a87ac",
    color: "#fff",
    border: "none",
    ':hover': {
    backgroundColor: "#8E7CC3", // Light purple on hover
    transform: "scale(1.2)", // Slightly scale up the button on hover for a dynamic effect
  },
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#5f7a83",
    color: "#fff",
    border: "none",
  };

  const categoryItemStyle = {
    ...cardStyle,
    marginTop: "10px",
    marginBottom: "10px",
    marginRight:"10px"
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid" style={dashboardStyle}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <h1 className="text-white text-center mb-4">Manage Categories</h1>

            {/* Category Form */}
            <div style={cardStyle}>
              <h4 className="text-center">Add New Category</h4>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>

            {/* Category List */}
            <div className="row" style={categoryListStyle}>
              {categories.map((category) => (
                <div
                  key={category._id}
                  style={categoryItemStyle}
                  className="col-md-6 col-lg-4"
                >
                  <h5 className="text-center mb-3">{category.name}</h5>
                  <div className="d-flex justify-content-center">
                    <button
                      style={editButtonStyle}
                      onClick={() => {
                        setVisible(true);
                        setUpdatedName(category.name);
                        setSelected(category);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for Editing */}
            {visible && (
              <div className="modal show" style={{ display: "block" }}>
                <div className="modal-dialog">
                  <div
                    className="modal-content"
                    style={{
                      backgroundColor: "rgba(95,104,131,1)",
                      color: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Category</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCancel}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <CategoryForm
                        value={updatedName}
                        setValue={setUpdatedName}
                        handleSubmit={handleUpdate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
  .btn .btn-primary {
    max-width: 20px;
  }`}
</style>
    </Layout>
  );
};

export default CreateCategory;
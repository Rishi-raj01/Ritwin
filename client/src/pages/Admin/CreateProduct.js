import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState([]); // Now an array for multiple photos
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Toggle for mobile menu

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    try {
      const res = await axios.get("/api/v1/category/allcategory");
      if (res.data.success) {
        setCategories(res.data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong in getting categories");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name || !price || !quantity || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);

      // Handle multiple photos
      if (photo.length > 0) {
        for (let i = 0; i < photo.length; i++) {
          productData.append("photos", photo[i]);
        }
      }

      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.post("/api/v1/product/create-product", productData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for handling file uploads
        },
      });

      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Something went wrong");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid dashboard" style={dashboardStyle}>
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <AdminMenu />
          </div>
          <div className="col-md-3 d-block d-md-none mb-3">
            <button className="btn btn-secondary w-100" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? "Hide Menu" : "Show Admin Menu"}
            </button>
            {isMobileMenuOpen && <AdminMenu />}
          </div>
          <div className="col-md-9">
            <div className="m-3 p-4" style={formContainerStyle}>
              <h2 className="text-center text-light mb-4">Create a New Product</h2>
              <div className="mb-3">
                <select
                  className="form-select form-control-lg mb-3"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="btn btn-outline-light col-12">
                  {photo.length > 0 ? `${photo.length} photos selected` : "Upload Photos"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(Array.from(e.target.files))}
                    hidden
                    multiple
                  />
                </label>
              </div>

              <div className="mb-3">
                {photo.length > 0 && (
                  <div className="text-center">
                    {photo.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`product_photo_${index}`}
                        className="img-fluid rounded"
                        style={{ maxHeight: "200px", objectFit: "cover", margin: "5px" }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="form-control form-control-lg"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Product Description"
                  className="form-control form-control-lg"
                  rows="4"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="form-control form-control-lg"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Quantity"
                  className="form-control form-control-lg"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select form-control-lg mb-3"
                  onChange={(e) => setShipping(e.target.value)}
                >
                  <option value="">Select Shipping Option</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="text-center">
                <button className="btn btn-light btn-lg px-5" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;

const dashboardStyle = {
  backgroundImage: `url(https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp)`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  color: "white",
  display: "flex",
  flexDirection: "column",
};

const formContainerStyle = {
  maxWidth: "700px",
  margin: "0 auto",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  color: "white",
};

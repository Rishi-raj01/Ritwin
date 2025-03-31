import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [productPhotos, setProductPhotos] = useState([]);
  const [id, setId] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Toggle for mobile menu

  // Get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/products/${params.slug}`);
      setName(data.product.name);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setCategory(data.product.category._id); // Store only the ID
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping ?? false);
      setId(data.product._id);
      setProductPhotos(data.product.photos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/allcategory");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong in getting categories");
    }
  };
  const handleUpdate = async (e) => {
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
      productData.append("category", category);
      productData.append("shipping", shipping);
  
      // Append only file objects
      productPhotos.forEach((photo) => {
        if (photo.file) {
          productData.append("photo", photo.file); // Extract actual file
        } else if (photo instanceof File) {
          productData.append("photo", photo);
        }
      });
  
      console.log("Sending files:", productData.getAll("photo"));
  
      const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Something went wrong");
    }
  };
  


  const handleDelete = async () => {
    try {
      const answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
      if (data.success) {
        toast.success(`${data.name} deleted successfully`);
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.log(error.response || error);
      toast.error("Something went wrong");
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
  
    setProductPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };
  

  const handleReplacePhoto = (index, newFile) => {
    if (!newFile) return;
    const updatedPhotos = [...productPhotos];
    updatedPhotos[index] = newFile;
    setProductPhotos(updatedPhotos);
  };

  const handleDeletePhoto = async (photoUrl) => {
    try {
      const { data } = await axios.delete(`/api/v1/product/products/${id}/deletephoto/${encodeURIComponent(photoUrl)}`);
      if (data.success) {
        setProductPhotos(prevPhotos => prevPhotos.filter(photo => photo !== photoUrl));
        toast.success("Photo deleted successfully!");
      } else {
        toast.error("Error deleting photo");
      }
    } catch (error) {
      console.error("Error in deleting photo:", error);
      toast.error("Something went wrong");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
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
              <h2 className="text-center text-light mb-4">Update the Product</h2>

              <div className="mb-3">
                <select
                  className="form-select form-control-lg mb-3"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing Photos */}
              <div className="mb-3">
                {productPhotos.map((photo, index) => (
                  <div key={index} className="m-2">
                    <img
                      //src={photo}
                      src={photo.preview || (photo instanceof File ? URL.createObjectURL(photo) : photo)}
                      alt={`Product Image ${index + 1}`}
                      className="img-thumbnail"
                      style={{ maxWidth: "150px", height: "150px" }}
                    />
                    <input
                      type="file"
                      onChange={(e) => handleReplacePhoto(index, e.target.files[0])}
                      className="mt-2"
                    />
                    <button
                      className="btn btn-danger mt-2 ms-2"
                      style={{ background: "none", border: "none", backgroundColor: "rgba(0,0,0,0.5)" }}
                      onClick={() => handleDeletePhoto(photo)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload New Photos */}
              <div className="mb-3">
                <label className="btn btn-outline-primary">
                  Upload Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>
                {productPhotos.length > 0 ? (
  <div className="d-flex justify-content-center flex-wrap">
    {productPhotos.map((photo, index) => (
      <div key={index} className="m-2">
        <img
          src={photo.preview || (photo instanceof File ? URL.createObjectURL(photo) : photo)}
          alt={`product_photo_${index}`}
          className="img-fluid rounded"
          style={{ maxHeight: "200px", objectFit: "cover" }}
        />
      </div>
    ))}
  </div>
) : (
  <div>No photos available</div>
)}

              </div>

              {/* Product Info */}
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
                <label>Shipping:</label>
                <select
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value === "true")}
                  className="form-control"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>


              {/* Submit */}
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default UpdateProduct;
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

import React, { useState } from "react";
import axios from "axios";
import { useParams ,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";

const CreateReview = () => {
  const { slug } = useParams();  // Access slug from URL params
  const [auth] = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
 const navigate=useNavigate();
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', auth.user._id); // Access user ID correctly
    formData.append('rating', rating);
    formData.append('comment', comment);
    if (photo) formData.append("photo", photo);
    console.log("photo is ",photo);

    try {
      console.log("auth is ", auth);
      console.log("token is ", auth.token);
      const response = await axios.post(
        `/api/v1/product/products/${slug}/reviews`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${auth.token}`,  // Use token from auth context
          },
        }
      );
      console.log("Response:", response);
      toast.success("Review submitted successfully!"); // Use toast for better UX
      navigate(`/product/${slug}`)
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Write a Review</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded border">
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control"
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Upload Photo (optional):</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Submit Review</button>
      </form>
    </div>
  );
};

export default CreateReview;

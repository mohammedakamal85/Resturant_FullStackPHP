import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const AddItemMenu = () => {
  const [formData, setFormData] = useState({
    ItemName: "",
    ItemDescription: "",
    ItemPrice: 0,
    ItemImage: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleChange = (e) => {
    if (e.target.name === "ItemImage") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ItemName) newErrors.ItemName = "Item name is required.";
    if (!formData.ItemDescription)
      newErrors.ItemDescription = "Description is required.";
    if (!formData.ItemPrice || formData.ItemPrice <= 0) {
      newErrors.ItemPrice = "Price must be greater than zero.";
    }
    if (!formData.ItemImage) newErrors.ItemImage = "Image is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append("name", formData.ItemName);
    data.append("description", formData.ItemDescription);
    data.append("price", formData.ItemPrice);
    if (formData.ItemImage) {
      data.append("image", formData.ItemImage);
    }

    setLoading(true);
    if (authToken) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/add-item",
          data,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response Data:", response.data);
        navigate("/menu");
      } catch (error) {
        console.error("Error Response Data:", error.response?.data);
        console.error("Error Message:", error.message);
        setErrors({
          server:
            error.response?.data?.message ||
            "An error occurred while adding the item.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors({ server: "No auth token found. Please log in again." });
      setLoading(false);
    }
  };

  return (
    <div className="add__item__menu__container">
      <Header />
      <form onSubmit={handleSubmit} className="add__item__menu">
        <h1>Add Item</h1>
        <div role="alert">
          {errors.server && <p className="error">{errors.server}</p>}
          {errors.ItemName && <p className="error">{errors.ItemName}</p>}
          {errors.ItemDescription && (
            <p className="error">{errors.ItemDescription}</p>
          )}
          {errors.ItemPrice && <p className="error">{errors.ItemPrice}</p>}
          {errors.ItemImage && <p className="error">{errors.ItemImage}</p>}
        </div>
        <input
          id="item"
          type="text"
          name="ItemName"
          placeholder="Item Name"
          value={formData.ItemName}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          id="item"
          type="text"
          name="ItemDescription"
          placeholder="Description"
          value={formData.ItemDescription}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          id="item"
          type="number"
          name="ItemPrice"
          placeholder="Price"
          value={formData.ItemPrice}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          id="item"
          type="file"
          name="ItemImage"
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding Item..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItemMenu;

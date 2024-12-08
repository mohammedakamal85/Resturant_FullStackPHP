import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "./Header";

const OurMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const fetchMenuItems = async () => {
    try {
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get("http://127.0.0.1:8000/api/menu", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });

      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError(
        `Failed to fetch menu items: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleUpdate = (item) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/items/${editingItem}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem ? response.data.item : item
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === "admin";

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu__container">
      <Header />
      <h1>Our Menu</h1>
      <div className="card__container">
        {menuItems.length > 0 ? (
          menuItems.map((item) => {
            const imageUrl = `http://127.0.0.1:8000/storage/${item.image_path}`;
            return (
              <div key={item.id} className="menu__item__card">
                {editingItem === item.id ? (
                  <form onSubmit={handleSubmit}>
                    <label>
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Description:
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Price:
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Image:
                      <input type="file" name="image" onChange={handleChange} />
                    </label>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingItem(null)}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    {item.image_path && (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "fallback-image-url";
                        }}
                      />
                    )}
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>
                      Price: <strong>${Number(item.price).toFixed(2)}</strong>
                    </p>
                    {isAdmin && (
                      <>
                        <button onClick={() => handleUpdate(item)}>
                          Update
                        </button>
                        <button onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default OurMenu;

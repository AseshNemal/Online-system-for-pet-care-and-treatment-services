import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function SubmitAd() {
  const location = useLocation();
  const userId = location.state?.userId || "0000";

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!image || !type || !breed || !weight || !description || !contactNumber) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const weightValue = Number(weight);
    if (weightValue <= 0) {
      setError("Weight must be greater than 0.");
      setLoading(false);
      return;
    }

    if (weightValue > 200) {
      setError("Weight cannot exceed 200 kg.");
      setLoading(false);
      return;
    }

    if (description.length > 500) {
      setError("Description must be 500 characters or less.");
      setLoading(false);
      return;
    }

    const phoneRegex = /^\d{10,12}$/;
    if (!phoneRegex.test(contactNumber)) {
      setError("Contact number must be 10-12 digits and contain only numbers.");
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const adData = {
          image: base64Image,
          type,
          breed,
          weight: weightValue,
          description,
          contactNumber,
          userId,
        };

        const token = localStorage.getItem('token');
        if (!token) {
          setError("You must be logged in to submit an ad.");
          setLoading(false);
          return;
        }

        await axios.post(
          "http://localhost:8090/pet-ad/submit",
          adData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess("Ad submitted successfully, awaiting approval!");
        setImage(null);
        setImagePreview("");
        setType("");
        setBreed("");
        setWeight("");
        setDescription("");
        setContactNumber("");
      };
    } catch (error) {
      setError(error.response?.data?.error || "Failed to submit ad.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 submit-ad">
      <style>
        {`
          .submit-ad {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            background: linear-gradient(135deg, #ffffff 0%, #e6f4ea 100%);
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .form-label {
            font-weight: 600;
            color: #2c3e50;
            font-family: 'Poppins', sans-serif;
          }
          .form-control, .form-select {
            border-radius: 8px;
            border: 1px solid #ced4da;
            padding: 10px;
            font-family: 'Roboto', sans-serif;
          }
          .form-control:focus, .form-select:focus {
            border-color: #28a745;
            box-shadow: 0 0 8px rgba(40, 167, 69, 0.3);
          }
          .image-preview {
            max-width: 200px;
            max-height: 200px;
            border-radius: 10px;
            margin-top: 10px;
          }
          .btn-primary {
            background-color: #28a745;
            border: none;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
          }
          .btn-primary:hover {
            background-color: #218838;
          }
          .alert {
            border-radius: 8px;
            font-family: 'Roboto', sans-serif;
          }
          h2 {
            color: #2c3e50;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            position: relative;
            display: inline-block;
          }
          h2::after {
            content: "";
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50%;
            height: 3px;
            background-color: #28a745;
          }
        `}
      </style>

      <div className="text-center mb-4">
        <Link to="/adoption-portal" className="btn btn-primary">
          Back to Adoption Portal
        </Link>
      </div>

      <h2 className="text-center mb-4">Submit a Pet for Adoption</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-3">
          <label className="form-label">Pet Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Pet Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Goat">Goat</option>
            <option value="Cow">Cow</option>
            <option value="Bird">Bird</option>
            <option value="Squirrel">Squirrel</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Breed</label>
          <input
            type="text"
            className="form-control"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Weight (kg, max 200)</label>
          <input
            type="number"
            className="form-control"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            max="200"
            step="0.1"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description (max 500 characters)</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="500"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Number (10-12 digits)</label>
          <input
            type="text"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            maxLength="12"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ad"}
        </button>
      </form>
    </div>
  );
}

export default SubmitAd;

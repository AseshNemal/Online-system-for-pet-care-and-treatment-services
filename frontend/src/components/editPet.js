import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPet = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    petName: '',
    species: '',
    breed: '',
    gender: '',
    bDate: '',
    color: '',
    weight: '',
    deviceId: ''  // Added deviceId field
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(`https://online-system-for-pet-care-and-treatment.onrender.com/pet/petDetaile/${petId}`);
        if (!response.data.pet) {
          throw new Error('Pet not found');
        }
        setPet(response.data.pet);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching pet data');
        setLoading(false);
      }
    };

    fetchPetData();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.put(`https://online-system-for-pet-care-and-treatment.onrender.com/pet/update/${petId}`, {
        ...pet,
        // Don't include image in this version since we're focused on device ID
      });

      navigate(`/pets/${petId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating pet');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading pet details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="edit-pet-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Pet Details
      </button>

      <h1>Edit {pet.petName}'s Information</h1>

      <form onSubmit={handleSubmit} className="edit-pet-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="petName">Pet Name</label>
            <input
              type="text"
              id="petName"
              name="petName"
              value={pet.petName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="species">Species</label>
              <select
                id="species"
                name="species"
                value={pet.species}
                onChange={handleChange}
                required
              >
                <option value="">Select Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="breed">Breed</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={pet.breed}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={pet.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bDate">Birth Date</label>
              <input
                type="date"
                id="bDate"
                name="bDate"
                value={pet.bDate ? pet.bDate.split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={pet.color}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Device Information</h2>
          
          <div className="form-group">
            <label htmlFor="deviceId">Device ID</label>
            <input
              type="text"
              id="deviceId"
              name="deviceId"
              value={pet.deviceId || ''}
              onChange={handleChange}
              placeholder="Enter the tracking device ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={pet.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(`/pets/${petId}`)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .edit-pet-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .back-button {
          background: none;
          border: none;
          color: #3498db;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background-color: #f0f0f0;
        }

        h1 {
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
        }

        .edit-pet-form {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        h2 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #34495e;
        }

        input[type="text"],
        input[type="number"],
        input[type="date"],
        select {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="date"]:focus,
        select:focus {
          border-color: #3498db;
          outline: none;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-button,
        .submit-button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .submit-button {
          background-color: #2ecc71;
          color: white;
        }

        .submit-button:hover {
          background-color: #27ae60;
        }

        .submit-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .loading, .error {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
        }

        .error {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .edit-pet-container {
            padding: 1rem;
          }
          
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EditPet;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch("http://localhost:8090/get-session", { 
          credentials: "include" 
        });
        const sessionData = await sessionRes.json();
        
        if (!sessionData.user) {
          throw new Error("User not logged in");
        }

        setUser(sessionData.user);
        const petsRes = await axios.get(`http://localhost:8090/pet/find/${sessionData.user._id}`);
        setPets(petsRes.data.pets || []);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`);
  };

  const handleDeletePet = async (petId, e) => {
    e.stopPropagation(); // Prevent triggering the pet click event
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
      if (!confirmDelete) return;
      
      await axios.delete(`http://localhost:8090/pet/delete/${petId}`);
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (err) {
      console.error("Error deleting pet:", err);
      alert("Failed to delete pet. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading pets...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (pets.length === 0) return <div className="no-pets">No pets found for this user.</div>;

  return (
    <div className="user-pets-container">
      <h2 className="user-pets-title">{user?.displayName || 'User'}'s Pets</h2>
      <ul className="pets-list">
  {pets.map((pet) => (
    <li 
      key={pet._id}
      onClick={() => handlePetClick(pet._id)}
      className="pet-item"
    >
      <div className="pet-info">
        <span className="pet-name">{pet.petName}</span>
        <span className="pet-details">
          {pet.species} | {pet.breed}
        </span>
      </div>
      <div className="pet-actions">
        <button 
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering the pet click event
            navigate(`/pet/edit/${pet._id}`);
          }}
        >
          Edit
        </button>
        <button 
          className="delete-button"
          onClick={(e) => handleDeletePet(pet._id, e)}
        >
          Delete
        </button>
        <div className="pet-arrow">→</div>
      </div>
    </li>
  ))}
</ul>


      <button 
        onClick={() => navigate(`/pet/add`)}
        className="add-record-button"
      >
        + Add New Pet
      </button>
    </div>
  );
}

export default UserPets;

// CSS Styles
const styles = `
  .user-pets-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .add-record-button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.7rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    margin: 2rem auto;
  }

  .user-pets-title {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    text-align: center;
  }

  .pets-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pet-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.8rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .pet-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: #f8f9fa;
  }

  .pet-info {
    display: flex;
    flex-direction: column;
  }

  .pet-name {
    font-weight: 600;
    color: #3498db;
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }

  .pet-details {
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  .pet-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s;
  }

  .delete-button:hover {
    background-color: #c0392b;
  }

  .pet-arrow {
    color: #bdc3c7;
    font-size: 1.2rem;
  }

  .loading, .error, .no-pets {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #7f8c8d;
  }

  .edit-button {
  background-color: #f1c40f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #d4ac0d;
}


  .error {
    color: #e74c3c;
  }
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
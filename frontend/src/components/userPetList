import React, { useState, useEffect } from "react";
import axios from "axios";

function UserPets({ userId }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    axios
      .get(`http://localhost:8090/pet/find/${userId}`)
      .then((res) => {
        setPets(res.data.pets);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.status || "Error fetching pets");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading pets...</p>;
  if (error) return <p>Error: {error}</p>;
  if (pets.length === 0) return <p>No pets found for this user.</p>;

  return (
    <div>
      <h2>User's Pets</h2>
      <ul>
        {pets.map((pet) => (
          <li key={pet._id}>
            <strong>Name:</strong> {pet.petName} | <strong>Species:</strong> {pet.species} | <strong>Breed:</strong> {pet.breed}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPets;

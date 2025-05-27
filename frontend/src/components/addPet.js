import React, { useEffect, useState } from "react";
import axios from "axios";

function AddPet() {
  const [user, setUser] = useState(null);
  const [UID, setUID] = useState("0000");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://online-system-for-pet-care-and-treatment.onrender.com/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setUID(data.user._id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  console.log(user)
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [bDate, setBDate] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");

  function sendData(e) {
    e.preventDefault();

    const newPet = {
      petName,
      userId: UID, 
      species,
      bDate,
      gender,
      weight,
      color,
      breed,
    };

    axios
      .post("https://online-system-for-pet-care-and-treatment.onrender.com/pet/add", newPet, {
        withCredentials: true
      })
      .then(() => {
        alert("Pet Added Successfully");
        // Redirect to user pets page after successful addition
        window.location.href = "/pet";
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add pet. Please check the data and try again.");
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-pet-wrapper">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

          .add-pet-wrapper * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Poppins', sans-serif;
          }

          .add-pet-wrapper {
              min-height: 100vh;
          }

          .add-pet-wrapper::-webkit-scrollbar {
              display: none;
          }

          .add-pet-wrapper .wrapper {
              max-width: 800px;
              margin: 80px auto;
              padding: 30px 45px;
              background: #fff;
              border-radius: 8px;
              box-shadow: 5px 25px 35px rgba(53, 53, 53, 0.42);
          }

          .add-pet-wrapper .wrapper label {
              display: block;
              padding-bottom: 0.2rem;
          }

          .header-title {
              font-size: 2rem;
              font-weight: 700;
              color: #3498db;
              margin-bottom: 1.5rem;
              text-align: center;
              text-shadow: 1px 1px 2px rgba(52, 152, 219, 0.5);
              letter-spacing: 1px;
          }

          .add-pet-wrapper .wrapper .form .row {
              padding: 0.6rem 0;
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
          }

          .add-pet-wrapper .wrapper .form .row > div {
              flex: 1 1 45%;
              min-width: 200px;
          }

          .add-pet-wrapper .wrapper .form .row .form-control {
              box-shadow: none;
              width: 100%;
              padding: 8px 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
              font-size: 1rem;
          }

          .btn-primary {
              display: inline-block;
              background-color: #3498db;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1rem;
              transition: background-color 0.3s ease;
          }

          .btn-primary:hover {
              background-color: #2980b9;
          }

          /* Gender radio buttons */
          .option {
              position: relative;
              padding-left: 25px;
              cursor: pointer;
              user-select: none;
              font-size: 1rem;
              color: #333;
          }

          .option input {
              position: absolute;
              opacity: 0;
              cursor: pointer;
              height: 0;
              width: 0;
          }

          .checkmark {
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              height: 16px;
              width: 16px;
              background-color: #eee;
              border-radius: 50%;
              border: 1px solid #ccc;
          }

          .option:hover input ~ .checkmark {
              background-color: #ccc;
          }

          .option input:checked ~ .checkmark {
              background-color: #3498db;
              border-color: #3498db;
          }

          .checkmark:after {
              content: "";
              position: absolute;
              display: none;
          }

          .option input:checked ~ .checkmark:after {
              display: block;
          }

          .option .checkmark:after {
              top: 4px;
              left: 4px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: white;
          }

          @media(max-width: 768.5px) {
              .add-pet-wrapper .wrapper {
                  margin: 30px;
              }
          }

          @media(max-width: 400px) {
              .add-pet-wrapper .wrapper {
                  padding: 25px;
                  margin: 20px;
              }
          }
        `}
      </style>
      <form onSubmit={sendData}>
        <div className="wrapper rounded bg-white">
          <div className="header-title">Add Pet</div>

          <div className="form">
            <div className="row">
              <div className="col-md-6 mt-md-0 mt-3">
                <label>Pet Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  onChange={(e) => setPetName(e.target.value)}
                />
              </div>
              {/* Hide User ID field */}
              {/* <div className="col-md-6 mt-md-0 mt-3">
                <label>User ID</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  disabled
                  value={UID} // Use UID since it's updated
                />
              </div> */}
            </div>

            <div className="row">
              <div className="col-md-6 mt-md-0 mt-3">
                <label>Species</label>
                <select
                  className="form-control"
                  required
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                >
                  <option value="" disabled>Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6 mt-md-0 mt-3">
              <label>Birthday</label>
              <input
                type="date"
                className="form-control"
                required
                max={new Date().toISOString().split("T")[0]} 
                onChange={(e) => setBDate(e.target.value)}
              />
            </div>

            </div>

            <div className="row">
              <div className="col-md-6 mt-md-0 mt-3">
                <label>Gender</label>
                <div className="d-flex align-items-center mt-2">
                  <label className="option">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={(e) => setGender(e.target.value)}
                    />{" "}
                    Male
                    <span className="checkmark"></span>
                  </label>
                  <label className="option ms-4">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={(e) => setGender(e.target.value)}
                    />{" "}
                    Female
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mt-md-0 mt-3">
                <label>Weight</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  min="1"
                  max="150"
                  placeholder="Weight in kg (1-150)"
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="col-md-6 mt-md-0 mt-3">
                <label>Color</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 mt-md-0 mt-3">
              <label>Breed</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>

            <button className="btn btn-primary mt-3">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPet;

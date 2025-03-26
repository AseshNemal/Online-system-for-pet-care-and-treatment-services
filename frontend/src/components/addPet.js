import React, { useEffect, useState } from "react";
import axios from "axios";

function AddPet() {
  const [user, setUser] = useState(null);
  const [UID, setUID] = useState("0000"); // State to track User ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8090/get-session", { credentials: "include" })
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
      userId: UID, // Ensure user ID is properly included
      species,
      bDate,
      gender,
      weight,
      color,
      breed,
    };

    axios
      .post("http://localhost:8090/pet/add", newPet)
      .then(() => {
        alert("Pet Added Successfully");
        
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
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Poppins', sans-serif;
          }

          body {
              min-height: 100vh;
          }

          body::-webkit-scrollbar {
              display: none;
          }

          .wrapper {
              max-width: 800px;
              margin: 80px auto;
              padding: 30px 45px;
              background: #fff;
              border-radius: 8px;
              box-shadow: 5px 25px 35px rgba(53, 53, 53, 0.42);
          }

          .wrapper label {
              display: block;
              padding-bottom: 0.2rem;
          }

          .wrapper .form .row {
              padding: 0.6rem 0;
          }

          .wrapper .form .row .form-control {
              box-shadow: none;
          }

          #sub {
              display: block;
              width: 100%;
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 5px;
              color: #333;
          }

          #sub:focus {
              outline: none;
          }

          @media(max-width: 768.5px) {
              .wrapper {
                  margin: 30px;
              }
          }

          @media(max-width: 400px) {
              .wrapper {
                  padding: 25px;
                  margin: 20px;
              }
          }
        `}
      </style>
      <form onSubmit={sendData}>
        <div className="wrapper rounded bg-white">
          <div className="h3">Add Pet</div>

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
              <div className="col-md-6 mt-md-0 mt-3">
                <label>User ID</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  disabled
                  value={UID} // Use UID since it's updated
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mt-md-0 mt-3">
                <label>Species</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  onChange={(e) => setSpecies(e.target.value)}
                />
              </div>
              <div className="col-md-6 mt-md-0 mt-3">
  <label>Birthday</label>
  <input
    type="date"
    className="form-control"
    required
    max={new Date().toISOString().split("T")[0]} // Sets max to today’s date
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
                  type="text"
                  className="form-control"
                  required
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
    </>
  );
}

export default AddPet;

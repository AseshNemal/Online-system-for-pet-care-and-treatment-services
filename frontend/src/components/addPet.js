import React,{useState} from "react";
import axios from "axios";

function AddPet() {
    
    const [petName, setPetName] =useState("");
    const [userId, setUserId] =useState("");
    const [species,setSpecies] =useState("");
    const [bDate,setBDate] =useState("");
    const [gender,setGender] =useState("");
    const [weight,setWeight] =useState("");
    const [color,setColor] =useState("");
    const [breed,setBreed] =useState("");

    function sendData(e){
        e.preventDefault();

        const newPet={
            petName,
            userId,
            species,
            bDate,
            gender,
            weight,
            color,
            breed
        }

        alert("Pet ");

        axios
      .post("http://localhost:8090/pet/add", newPet)
      .then(() => {
        alert("Pet Added");
      })
      .catch((err) => {
        alert(err);
      });}


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
            background: linear-gradient(45deg, #ce1e53, #8f00c7);
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

        .wrapper .form .option {
            position: relative;
            padding-left: 20px;
            cursor: pointer;
        }

        .wrapper .form .option input {
            opacity: 0;
        }

        .wrapper .form .checkmark {
            position: absolute;
            top: 1px;
            left: 0;
            height: 20px;
            width: 20px;
            border: 1px solid #bbb;
            border-radius: 50%;
        }

        .wrapper .form .option input:checked~.checkmark:after {
            display: block;
        }

        .wrapper .form .option:hover .checkmark {
            background: #f3f3f3;
        }

        .wrapper .form .option .checkmark:after {
            content: "";
            width: 10px;
            height: 10px;
            display: block;
            background: linear-gradient(45deg, #ce1e53, #8f00c7);
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: 300ms ease-in-out 0s;
        }

        .wrapper .form .option input[type="radio"]:checked~.checkmark {
            background: #fff;
            transition: 300ms ease-in-out 0s;
        }

        .wrapper .form .option input[type="radio"]:checked~.checkmark:after {
            transform: translate(-50%, -50%) scale(1);
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

            .wrapper .form .row {
                padding: 0;
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
              <input type="text" className="form-control" required onChange={(e)=>{
                setPetName(e.target.value);
              }}/>
            </div>
            <div className="col-md-6 mt-md-0 mt-3">
              <label>User ID</label>
              <input type="text" className="form-control" required  onChange={(e)=>{
                setUserId(e.target.value);
              }}/>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">
                <label>Species</label>
                <input type="text" className="form-control" required  onChange={(e)=>{
                    setSpecies(e.target.value);
                }}/>
                </div>


            <div className="col-md-6 mt-md-0 mt-3">
              <label>Birthday</label>
              <input type="date" className="form-control" required onChange={(e)=>{
                setBDate(e.target.value);
              }}/>
            </div>
            <div className="col-md-6 mt-md-0 mt-3">
              <label>Gender</label>
              <div className="d-flex align-items-center mt-2">
                <label className="option">
                  <input type="radio" name="gender" value="Male" /> Male
                  <span className="checkmark" onChange={(e)=>{
                setGender(e.target.value);
              }}></span>
                </label>
                <label className="option ms-4">
                  <input type="radio" name="gender" value="Female" onChange={(e)=>{
                setGender(e.target.value);
              }}/> Female
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">
              <label>Weight</label>
              <input type="text" className="form-control" required onChange={(e)=>{
                setWeight(e.target.value);
              }}/>
            </div>
            <div className="col-md-6 mt-md-0 mt-3">
              <label>Color</label>
              <input type="tel" className="form-control" required onChange={(e)=>{
                setColor(e.target.value);
              }}/>
            </div>
          </div>

          <div className="col-md-6 mt-md-0 mt-3">
              <label>Breed</label>
              <input type="tel" className="form-control" onChange={(e)=>{
                setBreed(e.target.value);
              }}/>
            </div>

          

          <button className="btn btn-primary mt-3">Submit</button>
        </div>
      </div>
      </form>
    </>
  );
}

export default AddPet;

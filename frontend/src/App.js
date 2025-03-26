import React from 'react';
import './App.css';
import Header from './components/Header';
import AddPet from './components/addPet';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AllPets from './components/allPets';
import SessionCheck from './components/sessionChack';
import UserPets from './components/userPetList';
import Login from './components/login';
import Profile from './components/profile';
import Chatbot from './components/chatbot';
import AddEmployee from './components/AddEmployee';
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Header />
      <SessionCheck />
      <Chatbot />
      
      <nav className="navbar navbar-expand-lg navbar-light">
        <style>
          {`
            .navbar {
              background-color: #17a2b8;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .navbar-brand {
              color: #ffffff !important;
              font-weight: 700;
              font-family: 'Poppins', sans-serif;
              font-size: 1.5rem;
              transition: color 0.3s ease;
            }

            .navbar-brand:hover {
              color: #e9ecef !important;
            }

            .nav-link {
              color: #ffffff !important;
              font-family: 'Roboto', sans-serif;
              font-weight: 500;
              transition: color 0.3s ease;
            }

            .nav-link:hover {
              color: #e9ecef !important;
            }
          `}
        </style>

        <div className="container">
          <Link className="navbar-brand" to="/">Pet Care System</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/employee">Employee Management</Link>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/pet/add" element={<AddPet />} />
        <Route path="/pet/all" element={<AllPets />} />
        <Route path="/pet/user" element={<UserPets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employee" element={<AddEmployee />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
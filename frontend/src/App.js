import React from 'react';
import './App.css';
import Header from './components/Header';
import AddPet from './components/addPet';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Correct import from react-router-dom
import AllPets from './components/allPets';
import SessionCheck from './components/sessionChack';
import UserPets from './components/userPetList';
import Login from './components/login';
import Profile from './components/profile';
function App() {
  return (
    <Router>  
      <Header />
      <SessionCheck/>
      <Routes>
        <Route path="/pet/add" element={<AddPet />} />
        <Route path="/pet" element={<AllPets />}/>
        <Route path="/pet" element={<UserPets />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>

      </Routes>
    </Router>
  );
}

export default App;

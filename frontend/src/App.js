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
import Chatbot from './components/chatbot';
import StorePage from './components/storePage';
import AdminDashboard from './components/adminProducts';

function App() {
  return (
    <Router>  
      <Header />
      <SessionCheck/>
      <Chatbot/>
      <Routes>
        <Route path="/pet/add" element={<AddPet />} />
        <Route path="/pet" element={<AllPets />}/>
        <Route path="/pet" element={<UserPets />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/product/all" element={<StorePage />}/>
        <Route path="/adminProducts" element={<AdminDashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;

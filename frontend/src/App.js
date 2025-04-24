import React from 'react';
import './App.css';
import Header from './components/Header';
import AddPet from './components/addPet';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import AllPets from './components/allPets';
import UserPets from './components/userPetList';
import Login from './components/login';
import Profile from './components/profile';
import Chatbot from './components/chatbot';
import DeviceData from './components/deviceData';
import PetRecord from './components/petRecord';
import AddMedicalRecord from './components/AddMedicalRecord';
import Footer from './components/footer';
import Home from './components/home';
import EditPet from './components/editPet';
import EditMedicalRecord from './components/editMediRecode';
import StorePage from './components/storePage';
import AdminDashboard from './components/adminProducts';
import PaymentPage from './components/PaymentPage';

function App() {
  return (
    <Router>  
      <Header />

      <Chatbot/>

      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/pet/add" element={<AddPet />} />
        <Route path="/pet/:deviceId" element={<DeviceData/>}/>
        <Route path="/pet/view" element={<AllPets />}/>
        <Route path="/pet" element={<UserPets />}/>
        <Route path="/pet/edit/:petId" element={<EditPet />}/>
        <Route path="/pets" element={<UserPets />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/pets/:petId" element={<PetRecord />} />
        <Route path="/pets/:petId/medical" element={<AddMedicalRecord />} />
        <Route path="/pets/:petId/medical/edit/:medicalId" element={<EditMedicalRecord/>}/>
        <Route path="/product/all" element={<StorePage />}/>
        <Route path="/adminProducts" element={<AdminDashboard />}/>
        <Route path="/payment" element={<PaymentPage />}/>


      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"; 
import Header from './components/Header';
import AddPet from './components/addPet';
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
import AddEmployee from './components/AddEmployee';
import Dashboard from "./components/Dashboard";
import AdoptionPortal from './components/AdoptionPortal';
import SubmitAd from './components/SubmitAd';
import PetAdAdminDashboard from './components/PetAdAdminDashboard';
import SearchResults from './components/SearchResults';
import AboutUs from './components/AboutUs';
import PaymentPage from './components/PaymentPage';
import MyOrdersPage from './components/MyOrdersPage';
import ServicesLanding from './components/Appointment/ServicesLanding';
import FinancialManagement from './components/FinancialManagement';
import ExpensesManagement from './components/ExpensesManagement';
import OrderFinanceManagement from './components/OrderFinanceManagement';
import HRFinanceManagement from './components/HRFinanceManagement';
import AppointmentList from './components/Appointment/AppointmentList';
import PetTrainingForm from './components/PetTrainingForm';


function AppContent() {
  const location = useLocation();
  const isAdminRoute = 
  location.pathname === '/adminDashboard' || 
  location.pathname === '/adminDashboard/product' ||
  location.pathname === '/financial' ||
  location.pathname === '/financial/expenses' ||
  location.pathname === '/financial/orders' ||
  location.pathname === '/financial/hr' ||
  location.pathname ==='/employee';


  return (
    <>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <Chatbot />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/pet/add" element={<AddPet />} />
        <Route path="/pet/:deviceId" element={<DeviceData />} />
        <Route path="/pet/view" element={<AllPets />} />
        <Route path="/pet" element={<UserPets />} />
        <Route path="/pet/edit/:petId" element={<EditPet />} />
        <Route path="/pets" element={<UserPets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pets/:petId" element={<PetRecord />} />
        <Route path="/pets/:petId/medical" element={<AddMedicalRecord />} />
        <Route path="/adminProducts" element={<AdminDashboard />}/>
        <Route path="/employee" element={<AddEmployee />} />
        <Route path="/adminDashboard" element={<Dashboard />} />
        <Route path="/adoption-portal" element={<AdoptionPortal />} />
        <Route path="/admin-dashboard" element={<PetAdAdminDashboard />} /> 
        <Route path="/submit-ad" element={<SubmitAd />} />
        <Route path="/payment" element={<PaymentPage />}/>
        <Route path="/my-orders" element={<MyOrdersPage />}/>
        <Route path="/pets/:petId/medical/edit/:medicalId" element={<EditMedicalRecord />} />
        <Route path="/product/all" element={<StorePage />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/appointments" element={<ServicesLanding />} />
        <Route path="/appointments/manage" element={<AppointmentList />} />
        <Route path="/adminDashboard/product" element={<AdminDashboard />} />
        <Route path="/petTrainingForm" element={<PetTrainingForm />} />
        
        
        <Route path="/financial" element={<FinancialManagement />} />
        <Route path="/financial/expenses" element={
          <>
          <FinancialManagement />
          <ExpensesManagement />
          </> } />
          <Route path="/financial/orders" element={
          <>
          <FinancialManagement />
          <OrderFinanceManagement />
          </> } />
          <Route path="/financial/hr" element={
          <>
          <FinancialManagement />
          <HRFinanceManagement />
          </> } />



        

      </Routes>



      {!isAdminRoute && <Footer />}
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


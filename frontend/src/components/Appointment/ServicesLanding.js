import React, { useState } from 'react';
import AppointmentForm from './AppointmentForm.js';
import './ServicesLanding.css';


const ServicesLanding = () => {
  const [serviceType, setServiceType] = useState(null);

  return (
    <div className="services-landing">
      <h1>Our Premium Pet Services</h1>
      <p>Choose the care your pet deserves. Grooming and Veterinary appointments made simple, fast, and tailored just for you.</p>

      <div className="service-cards">
        <div className="service-card">
          <span className="badge">Popular</span>
          <h2>Grooming Services</h2>
          <ul>
            <li>Bath</li>
            <li>Bath + Haircut</li>
            <li>Nail Trimming</li>
            <li>Haircut</li>
          </ul>
          <button onClick={() => setServiceType('grooming')}>Book Appointment</button>
        </div>

        <div className="service-card">
          <span className="badge">Veterinary Expert</span>
          <h2>Veterinary Services</h2>
          <ul>
            <li>Regular Check-up</li>
            <li>Vaccination</li>
            <li>Dental</li>
          </ul>
          <button onClick={() => setServiceType('veterinary')}>Book Appointment</button>
        </div>

        <div className="container">
      <button className="appointment-button" onClick={() => window.location.href = '/appointments/manage'}>
        MY Appointment
      </button>
    </div>
      </div>

      {serviceType && (
        <div style={{ marginTop: '3rem', width: '100%' }}>
          <AppointmentForm
            serviceType={serviceType}
            onClose={() => setServiceType(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ServicesLanding;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentForm.css';

const AppointmentForm = ({ serviceType, onClose }) => {
  const [form, setForm] = useState({
    petName: '',
    staffId: '',
    category: '',
    date: '',
    time: '',
  });

  const [userId, setUserId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch("http://localhost:8090/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?._id) {
          setUserId(data.user._id);
        }
      })
      .catch((err) => console.error("Session fetch failed:", err));
  }, []);

  const groomers = [
    { _id: '6511e5f9b67e4278f285ac23', name: 'Alex' },
    { _id: '6511e5f9b67e4278f285ac24', name: 'Jamie' },
    { _id: '6511e5f9b67e4278f285ac25', name: 'Taylor' },
  ];

  const doctors = [
    { _id: '6511e5f9b67e4278f285ac26', name: 'Dr. Smith' },
    { _id: '6511e5f9b67e4278f285ac27', name: 'Dr. Lee' },
    { _id: '6511e5f9b67e4278f285ac28', name: 'Dr. Patel' },
  ];

  const categories = {
    grooming: ['Bath', 'Bath + Haircut', 'Nail Trimming', 'Haircut'],
    veterinary: ['Regular Check-up', 'Vaccination', 'Dental'],
  };

  const staffList = serviceType === 'grooming' ? groomers : doctors;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('You must be logged in to book an appointment.');
      return;
    }

    try {
      console.log("📤 Sending appointment data:", {
        userId,
        staffId: form.staffId,
        petName: form.petName,
        serviceCategory: form.category,
        appointmentDate: form.date,
        appointmentTime: form.time,
      });

      const response = await axios.post(
        "http://localhost:8090/api/appointments",
        {
          userId,
          staffId: form.staffId,
          petName: form.petName,
          serviceCategory: form.category,
          appointmentDate: form.date,
          appointmentTime: form.time,
        },
        {
          withCredentials: true, // 🔑 Sends session cookie
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("✅ Response from backend:", response.data);
      setSuccess('Appointment booked successfully!');
      setForm({ petName: '', staffId: '', category: '', date: '', time: '' });
    } catch (err) {
      console.error("❌ Booking error:", err);
      const msg = err.response?.data?.error || 'Something went wrong. Try again later.';
      setError(msg);
    }
  };
  
  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <h3>{serviceType} Appointment</h3>

      <div className="form-group">
        <label>Pet Name</label>
        <input
          type="text"
          name="petName"
          value={form.petName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>{serviceType === 'grooming' ? 'Groomer' : 'Doctor'} Name</label>
        <select
          name="staffId"
          value={form.staffId}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>
              {staff.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Service Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {categories[serviceType].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          max={new Date(
            new Date().setMonth(new Date().getMonth() + 60)
          )
            .toISOString()
            .split('T')[0]}
        />
      </div>

      <div className="form-group">
        <label>Time</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          Confirm
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
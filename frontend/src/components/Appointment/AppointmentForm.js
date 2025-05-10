import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentForm.css';

const AppointmentForm = ({ serviceType, onClose }) => {
  const [form, setForm] = useState({
    petName: '',
    employeeId: '',
    employeeFirstName: '',
    employeeRole: '',
    category: '',
    date: '',
    time: '',
  });

  const [userId, setUserId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8090/employee/");
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
  if (serviceType === 'grooming') {
    return emp.role === 'Groomer';
  } else if (serviceType === 'veterinary' || serviceType === 'vet') {
    return emp.role === 'Vet';
  }
  return false;
}) : [];


  const categories = {
    grooming: ['Bath', 'Bath + Haircut', 'Nail Trimming', 'Haircut'],
    veterinary: ['Regular Check-up', 'Vaccination', 'Dental'],
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp._id === value);
      if (selectedEmployee) {
        setForm(prev => ({
          ...prev,
          employeeId: value,
          employeeFirstName: selectedEmployee.firstName,
          employeeRole: selectedEmployee.role,
        }));
      }
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    const updatedForm = {
      ...form,
      [name]: value,
    };

    if (updatedForm.employeeId && updatedForm.category && updatedForm.date) {
      try {
        const response = await axios.get('http://localhost:8090/api/appointments/available-slots', {
          params: {
            employeeId: updatedForm.employeeId,
            date: updatedForm.date,
            serviceCategory: updatedForm.category,
          },
          withCredentials: true,
        });
        setAvailableSlots(response.data.availableSlots);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${API_ENDPOINTS.appointments}/create`, formData);
        setSuccess(true);
        setError(null);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to create appointment');
        setSuccess(false);
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
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {filteredEmployees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
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
          max={new Date(new Date().setMonth(new Date().getMonth() + 60)).toISOString().split('T')[0]}
        />
      </div>

      <div className="form-group">
        <label>Time Slot</label>
        <select
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          disabled={!availableSlots.length}
        >
          <option value="">Select available time</option>
          {availableSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
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

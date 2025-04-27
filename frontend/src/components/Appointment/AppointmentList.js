import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    petName: '',
    staffId: '',
    serviceCategory: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch user session to get userId
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const sessionRes = await fetch('http://localhost:8090/get-session', { credentials: 'include' });
        const sessionData = await sessionRes.json();
        if (!sessionData.user?._id) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }
        const userId = sessionData.user._id;
        const res = await axios.get(`http://localhost:8090/api/appointments/user/${userId}`, { withCredentials: true });
        setAppointments(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments.');
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const startEdit = (appt) => {
    setEditingId(appt._id);
    setEditForm({
      petName: appt.petName,
      staffId: appt.staffId,
      serviceCategory: appt.serviceCategory,
      appointmentDate: appt.appointmentDate ? appt.appointmentDate.split('T')[0] : '',
      appointmentTime: appt.appointmentTime,
    });
    setSuccessMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError('');
    setSuccessMessage('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const res = await axios.put(
        `http://localhost:8090/api/appointments/${editingId}`,
        {
          petName: editForm.petName,
          staffId: editForm.staffId,
          serviceCategory: editForm.serviceCategory,
          appointmentDate: editForm.appointmentDate,
          appointmentTime: editForm.appointmentTime,
        },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === editingId ? res.data : appt))
      );
      setSuccessMessage('Appointment updated successfully.');
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update appointment.');
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setError('');
    setSuccessMessage('');
    try {
      await axios.delete(`http://localhost:8090/api/appointments/${id}`, { withCredentials: true });
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      setSuccessMessage('Appointment cancelled successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel appointment.');
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="appointment-list-container">
      <h2>Your Appointments</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Service Category</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) =>
              editingId === appt._id ? (
                <tr key={appt._id} className="editing-row">
                  <td>
                    <input
                      type="text"
                      name="petName"
                      value={editForm.petName}
                      onChange={handleEditChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="serviceCategory"
                      value={editForm.serviceCategory}
                      onChange={handleEditChange}
                      required
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={editForm.appointmentDate}
                      onChange={handleEditChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(new Date().setMonth(new Date().getMonth() + 60))
                        .toISOString()
                        .split('T')[0]}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={editForm.appointmentTime}
                      onChange={handleEditChange}
                      required
                    />
                  </td>
                  <td>
                    <button onClick={submitEdit} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={appt._id}>
                  <td>{appt.petName}</td>
                  <td>{appt.serviceCategory}</td>
                  <td>{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : ''}</td>
                  <td>{appt.appointmentTime}</td>
                  <td>
                    <button onClick={() => startEdit(appt)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteAppointment(appt._id)} className="delete-btn">Cancel</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;




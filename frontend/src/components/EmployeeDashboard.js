import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EmployeeDashboard.css";

// Mock data for appointments
const mockGroomerAppointments = [
  { id: 1, petName: "Max", ownerName: "John Smith", date: "2025-05-15", time: "09:00 AM", service: "Full Grooming", notes: "Sensitive skin on paws" },
  { id: 2, petName: "Bella", ownerName: "Emily Davis", date: "2025-05-15", time: "11:30 AM", service: "Bath & Brush", notes: "Matted fur needs extra attention" },
  { id: 3, petName: "Charlie", ownerName: "Michael Johnson", date: "2025-05-16", time: "02:00 PM", service: "Nail Trimming", notes: "Very nervous during nail trims" },
  { id: 4, petName: "Luna", ownerName: "Sarah Wilson", date: "2025-05-16", time: "04:30 PM", service: "Full Grooming", notes: "Previous skin condition, check with vet" },
  { id: 5, petName: "Cooper", ownerName: "David Thompson", date: "2025-05-17", time: "10:00 AM", service: "Bath & Dry", notes: "No perfumed products" }
];

const mockVetAppointments = [
  { id: 1, petName: "Oscar", ownerName: "Emma Roberts", date: "2025-05-15", time: "09:30 AM", service: "Vaccination", notes: "Annual checkup + rabies vaccine" },
  { id: 2, petName: "Milo", ownerName: "James Anderson", date: "2025-05-15", time: "11:00 AM", service: "Medical Exam", notes: "Limping on front right paw" },
  { id: 3, petName: "Lucy", ownerName: "Olivia Taylor", date: "2025-05-16", time: "01:30 PM", service: "Dental Cleaning", notes: "Bad breath, possible tooth decay" },
  { id: 4, petName: "Bailey", ownerName: "William Clark", date: "2025-05-16", time: "03:30 PM", service: "Follow-up", notes: "Post-surgery checkup" },
  { id: 5, petName: "Daisy", ownerName: "Sophia Martinez", date: "2025-05-17", time: "09:00 AM", service: "Microchipping", notes: "New adoption, needs all vaccines" }
];

// Paw icon SVG component for reuse
const PawIcon = ({ size = 20, color = "#4263eb", opacity = 0.5, style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512" 
    width={size} 
    height={size} 
    style={{ ...style, opacity }}
  >
    <path 
      fill={color} 
      d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z"
    />
  </svg>
);

function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve employee data from localStorage
    const storedData = localStorage.getItem("employeeData");
    
    if (!storedData) {
      // Redirect to login if no employee data is found
      navigate("/employee-login");
      return;
    }
    
    const employee = JSON.parse(storedData);
    setEmployeeData(employee);
    
    // Set appointments based on role
    const roleAppointments = employee.role.toLowerCase().includes("groom") 
      ? mockGroomerAppointments 
      : mockVetAppointments;
    
    setAppointments(roleAppointments);
    
    // Filter today's appointments
    const today = new Date().toISOString().split('T')[0];
    setTodayAppointments(roleAppointments.filter(apt => apt.date === today));
    
    // Filter upcoming appointments (not today)
    setUpcomingAppointments(roleAppointments.filter(apt => apt.date !== today));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("employeeData");
    navigate("/employee-login");
  };

  if (!employeeData) {
    return <div className="employee-dashboard-loading">Loading...</div>;
  }

  return (
    <div className="employee-dashboard">
      <div className="paw-background">
        {[...Array(6)].map((_, index) => (
          <PawIcon 
            key={index}
            size={80 + Math.random() * 40}
            color="#4263eb"
            opacity={0.03 + Math.random() * 0.02}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              zIndex: 0
            }}
          />
        ))}
      </div>
      
      <header className="employee-dashboard-header">
        <div className="employee-dashboard-title">
          <h1>Pet Wellness</h1>
          <p>Employee Dashboard</p>
        </div>
        <div className="employee-dashboard-user">
          <div className="employee-info">
            <p className="employee-name">{`${employeeData.firstName} ${employeeData.lastName}`}</p>
            <p className="employee-role">{employeeData.role}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="employee-dashboard-content">
        <section className="welcome-section">
          <h2>Welcome, {employeeData.firstName}!</h2>
          <p className="welcome-message">
            Here's your schedule for today and upcoming appointments.
          </p>
          <div className="stats-container">
            <div className="stat-card">
              <h3>{todayAppointments.length}</h3>
              <p>Today's Appointments</p>
            </div>
            <div className="stat-card">
              <h3>{upcomingAppointments.length}</h3>
              <p>Upcoming Appointments</p>
            </div>
            <div className="stat-card">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
        </section>

        <section className="appointments-section">
          <div className="appointments-header">
            <h2>Today's Appointments</h2>
          </div>
          {todayAppointments.length > 0 ? (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Pet</th>
                    <th>Owner</th>
                    <th>Service</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.time}</td>
                      <td>{appointment.petName}</td>
                      <td>{appointment.ownerName}</td>
                      <td>{appointment.service}</td>
                      <td>{appointment.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-appointments">No appointments scheduled for today</p>
          )}
        </section>

        <section className="appointments-section">
          <div className="appointments-header">
            <h2>Upcoming Appointments</h2>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Pet</th>
                    <th>Owner</th>
                    <th>Service</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.petName}</td>
                      <td>{appointment.ownerName}</td>
                      <td>{appointment.service}</td>
                      <td>{appointment.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-appointments">No upcoming appointments scheduled</p>
          )}
        </section>
      </main>

      <footer className="employee-dashboard-footer">
        <p>&copy; 2023 Pet Care Services. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeeDashboard; 
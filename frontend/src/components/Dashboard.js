import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [appointmentData, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointmentCounts();
  }, []);

  async function fetchAppointmentCounts() {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8090/employee/appointment-counts");
      setAppointmentData(response.data);
    } catch (error) {
      console.error("Error fetching appointment counts:", error);
      setError("Failed to fetch appointment data.");
    } finally {
      setLoading(false);
    }
  }

  const calculatePerformanceMetrics = (employee) => {
    const appointments = employee.appointments || [];
    const totalAppointments = employee.totalAppointments || 0;

    const today = new Date();
    const firstAppointmentDate = appointments.length > 0
      ? new Date(Math.min(...appointments.map(a => new Date(a.createdAt))))
      : today;
    const daysSinceFirst = Math.max(1, Math.ceil((today - firstAppointmentDate) / (1000 * 60 * 60 * 24)));

    const avgAppointmentsPerDay = (totalAppointments / daysSinceFirst).toFixed(2);

    return { totalAppointments, avgAppointmentsPerDay };
  };

  const chartData = {
    labels: appointmentData.map(employee => employee.name),
    datasets: [
      {
        label: "Total Appointments",
        data: appointmentData.map(employee => employee.totalAppointments),
        backgroundColor: "rgba(23, 162, 184, 0.6)",
        borderColor: "rgba(23, 162, 184, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Employee Appointment Counts (Sorted)" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of Appointments" } },
      x: { title: { display: true, text: "Employee Name" } },
    },
  };

  const exportData = () => {
    const dataToExport = appointmentData.map(employee => ({
      employeeId: employee.employeeId,
      name: employee.name,
      role: employee.role,
      totalAppointments: employee.totalAppointments,
    }));
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    saveAs(blob, "appointment_counts.json");
  };

  return (
    <div className="container mt-5 dashboard-container">
      <style>
        {`
          .dashboard-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 30px;
            background-color: #f8f9fa;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .dashboard-container::before {
            content: "📊";
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 60px;
            opacity: 0.1;
            transform: rotate(20deg);
          }

          .chart-container {
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 30px;
          }

          .table-container {
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }

          .thead-dark th {
            background-color: #2c3e50;
            color: #ffffff;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
          }

          .table-hover tbody tr:hover {
            background-color: #e9ecef;
          }

          .alert {
            border-radius: 8px;
            font-size: 14px;
            font-family: 'Roboto', sans-serif;
            background-color: #f8d7da;
            color: #721c24;
          }

          h2 {
            color: #2c3e50;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            position: relative;
            display: inline-block;
          }

          h2::after {
            content: "";
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50%;
            height: 3px;
            background-color: #17a2b8;
          }

          .btn-primary {
            background-color: #17a2b8;
            border: none;
            border-radius: 8px;
            padding: 12px;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            color: #ffffff;
            transition: background-color 0.3s ease;
          }

          .btn-primary:hover {
            background-color: #138496;
          }

          .spinner-border {
            width: 3rem;
            height: 3rem;
            border-color: #17a2b8;
            border-right-color: transparent;
          }
        `}
      </style>

      <div className="text-center mb-4">
        <Link to="/employee" className="btn btn-primary">
          Go to Employee Management
        </Link>
      </div>

      <h2 className="text-center mb-4">Employee Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="chart-container">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      <div className="table-container">
        <h2 className="text-center mb-4">Employee Performance Metrics</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Total Appointments</th>
                  <th>Avg. Appointments/Day</th>
                </tr>
              </thead>
              <tbody>
                {appointmentData.length > 0 ? (
                  appointmentData.map((employee) => {
                    const metrics = calculatePerformanceMetrics(employee);
                    return (
                      <tr key={employee.employeeId}>
                        <td>{employee.employeeId}</td>
                        <td>{employee.name}</td>
                        <td>{employee.role}</td>
                        <td>{metrics.totalAppointments}</td>
                        <td>{metrics.avgAppointmentsPerDay}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="btn btn-primary" onClick={exportData}>
              Export Data for Finance Manager
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
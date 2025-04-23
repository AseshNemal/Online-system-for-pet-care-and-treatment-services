import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [receivedData, setReceivedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [sortField, setSortField] = useState('appointmentCount');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterRole, setFilterRole] = useState('');

    // Fetch sorted appointment data when the component mounts
    useEffect(() => {
        fetchReceivedData();
    }, []);

    // SECTION 4: FETCHING SORTED APPOINTMENT DATA FOR DISPLAY
    // This function fetches the appointment data from the database
    // (populated by the appointment scheduling student via POST /receive-appointment-data)
    // to display in the chart and table. It’s called on component mount and after sorting.
    async function fetchReceivedData() {
        try {
            setLoading(true);
            console.log('Fetching sorted appointment data'); // Log for debugging
            const response = await axios.get("http://localhost:8090/employee/sorted-appointment-data");
            setReceivedData(response.data);
        } catch (error) {
            console.error("Error fetching received data:", error);
            setError(`Failed to fetch received data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // SECTION 5: SORTING AND UPLOADING DATA
    // This function fetches the appointment data, sorts it by appointmentCount (descending),
    // clears the existing data, and uploads the sorted data to the database.
    // The sorted data is then available for the finance management student to access
    // via GET /sorted-appointment-data.
    async function sortAndUploadData() {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            // Fetch unsorted data from the database
            console.log('Fetching data to sort'); // Log for debugging
            const response = await axios.get("http://localhost:8090/employee/sorted-appointment-data");
            const dataToSort = response.data;

            // Sort by appointmentCount in descending order
            const sortedData = [...dataToSort].sort((a, b) => b.appointmentCount - a.appointmentCount);

            // Clear existing data in the AppointmentData collection
            console.log('Clearing existing data'); // Log for debugging
            await axios.delete("http://localhost:8090/employee/sorted-appointment-data");

            // Upload sorted data back to the database
            console.log('Uploading sorted data'); // Log for debugging
            for (const data of sortedData) {
                await axios.post("http://localhost:8090/employee/receive-appointment-data", {
                    employeeId: data.employeeId,
                    name: data.name,
                    role: data.role,
                    appointmentCount: data.appointmentCount
                });
            }

            setSuccess("Data sorted and uploaded successfully!");
            fetchReceivedData(); // Refresh the chart and table
        } catch (error) {
            console.error("Error sorting and uploading data:", error);
            setError(`Failed to sort and upload data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Handle table column sorting
    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
        setReceivedData([...receivedData].sort((a, b) => {
            const aValue = field === 'appointmentCount' ? a[field] : a[field].toLowerCase();
            const bValue = field === 'appointmentCount' ? b[field] : b[field].toLowerCase();
            if (newOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        }));
    };

    // Filter data by role
    const filteredData = filterRole 
        ? receivedData.filter(data => data.role === filterRole)
        : receivedData;

    const chartData = {
        labels: filteredData.map(data => data.name),
        datasets: [
            {
                label: "Total Appointments",
                data: filteredData.map(data => data.appointmentCount),
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
            tooltip: { enabled: true },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: "Number of Appointments" } },
            x: { title: { display: true, text: "Employee Name" } },
        },
    };

    return (
        <div className="dashboard-wrapper">
            <div className="sidebar">
                <h3>Pet Care Admin</h3>
                <ul>
                    <li><Link to="/adminDashboard">Dashboard</Link></li>
                    <li><Link to="/employee">Employee Management</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </div>
            <div className="main-content">
                <h2 className="text-center mb-4">Employee Dashboard</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="kpi-container">
                    <div className="kpi-card">
                        <h4>Total Appointments</h4>
                        <p>{receivedData.reduce((sum, data) => sum + data.appointmentCount, 0)}</p>
                    </div>
                    <div className="kpi-card">
                        <h4>Employees</h4>
                        <p>{receivedData.length}</p>
                    </div>
                </div>

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
                    <h2 className="text-center mb-4">Received Appointment Data</h2>
                    <div className="filter-container">
                        <label htmlFor="role-filter">Filter by Role: </label>
                        <select 
                            id="role-filter"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Vet">Vet</option>
                            <option value="Groomer">Groomer</option>
                        </select>
                    </div>
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
                                        <th onClick={() => handleSort('employeeId')}>
                                            Employee ID {sortField === 'employeeId' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => handleSort('name')}>
                                            Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => handleSort('role')}>
                                            Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => handleSort('appointmentCount')}>
                                            Appointment Count {sortField === 'appointmentCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((data) => (
                                            <tr key={data.employeeId}>
                                                <td>{data.employeeId}</td>
                                                <td>{data.name}</td>
                                                <td>{data.role}</td>
                                                <td>{data.appointmentCount}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button className="btn btn-primary" onClick={sortAndUploadData} disabled={loading}>
                                {loading ? "Processing..." : "Sort and Upload Data"}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <style>
                {`
                    .dashboard-wrapper { display: flex; min-height: 100vh; }
                    .sidebar {
                        width: 220px;
                        background-color: #2c3e50;
                        color: white;
                        padding: 20px;
                        position: fixed;
                        height: 100%;
                        overflow-y: auto;
                    }
                    .sidebar h3 { margin-bottom: 20px; font-family: 'Poppins', sans-serif; }
                    .sidebar ul { list-style: none; padding: 0; }
                    .sidebar li { margin: 15px 0; }
                    .sidebar a {
                        color: white;
                        text-decoration: none;
                        font-family: 'Roboto', sans-serif;
                        font-size: 16px;
                    }
                    .sidebar a:hover { color: #17a2b8; }
                    .main-content {
                        margin-left: 240px;
                        padding: 30px;
                        background-color: #f8f9fa;
                        flex-grow: 1;
                    }
                    .kpi-container { display: flex; gap: 20px; margin-bottom: 30px; }
                    .kpi-card {
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 15px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        flex: 1;
                        text-align: center;
                    }
                    .kpi-card h4 { margin: 0; color: #2c3e50; font-family: 'Poppins', sans-serif; }
                    .kpi-card p { font-size: 24px; color: #17a2b8; margin: 10px 0 0; }
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
                    .filter-container { margin-bottom: 20px; }
                    .filter-container label { margin-right: 10px; font-family: 'Roboto', sans-serif; }
                    .filter-container select {
                        padding: 8px;
                        border-radius: 5px;
                        border: 1px solid #ced4da;
                        font-family: 'Roboto', sans-serif;
                    }
                    .thead-dark th {
                        background-color: #2c3e50;
                        color: #ffffff;
                        font-weight: 600;
                        font-family: 'Poppins', sans-serif;
                        cursor: pointer;
                    }
                    .table-hover tbody tr:hover { background-color: #e9ecef; }
                    .alert {
                        border-radius: 8px;
                        font-size: 14px;
                        font-family: 'Roboto', sans-serif;
                        background-color: #f8d7da;
                        color: #721c24;
                    }
                    .alert-success {
                        background-color: #d4edda;
                        color: #155724;
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
                    .btn-primary:hover { background-color: #138496; }
                    .spinner-border {
                        width: 3rem;
                        height: 3rem;
                        border-color: #17a2b8;
                        border-right-color: transparent;
                    }
                    @media (max-width: 768px) {
                        .sidebar {
                            width: 100%;
                            height: auto;
                            position: relative;
                        }
                        .main-content { margin-left: 0; }
                        .kpi-container { flex-direction: column; }
                    }
                `}
            </style>
        </div>
    );
}

export default Dashboard;
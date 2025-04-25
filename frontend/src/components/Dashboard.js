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
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 
    useEffect(() => {
        fetchReceivedData();
    }, []);

    async function fetchReceivedData() {
        try {
            setLoading(true);
            console.log('Fetching sorted appointment data');
            const response = await axios.get("http://localhost:8090/employee/sorted-appointment-data");
            setReceivedData(response.data);
        } catch (error) {
            console.error("Error fetching received data:", error);
            setError(`Failed to fetch received data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function sortAndUploadData() {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            console.log('Fetching data to sort');
            const response = await axios.get("http://localhost:8090/employee/sorted-appointment-data");
            const dataToSort = response.data;
            const sortedData = [...dataToSort].sort((a, b) => b.appointmentCount - a.appointmentCount);
            console.log('Clearing existing data');
            await axios.delete("http://localhost:8090/employee/sorted-appointment-data");
            console.log('Uploading sorted data');
            for (const data of sortedData) {
                await axios.post("http://localhost:8090/employee/receive-appointment-data", {
                    employeeId: data.employeeId,
                    name: data.name,
                    role: data.role,
                    appointmentCount: data.appointmentCount
                });
            }
            setSuccess("Data sorted and uploaded successfully!");
            fetchReceivedData();
        } catch (error) {
            console.error("Error sorting and uploading data:", error);
            setError(`Failed to sort and upload data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

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

    const filteredData = filterRole ? receivedData.filter(data => data.role === filterRole) : receivedData;

    const chartData = {
        labels: filteredData.map(data => data.name),
        datasets: [
            {
                label: "Total Appointments",
                data: filteredData.map(data => data.appointmentCount),
                backgroundColor: "rgba(0, 123, 255, 0.6)",
                borderColor: "rgba(0, 123, 255, 1)",
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
            <div className="top-navbar">
                <div className="navbar-brand">Pet Care Admin</div>
                <div className="navbar-user">
                    <span>Admin User</span>
                    <Link to="/" className="logout-link">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </Link>
                </div>
            </div>
            <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <button className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                    <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                </button>
                <h3 className="sidebar-title">Menu</h3>
                <ul>
                    <li className="active">
                                            <Link to="/adminDashboard">
                                                <i className="fas fa-tachometer-alt"></i>
                                                <span>Dashboard</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/employee">
                                                <i className="fas fa-users"></i>
                                                <span>Employee Management</span>
                                            </Link>
                                        </li>
                                        
                                        <li>
                                            <Link to="/admin-dashboard">
                                                <i className="fas fa-shield-alt"></i>
                                                <span>Admin Dashboard (Ads)</span>
                                            </Link>
                                        </li>
                                       
                                        <li>
                                            <Link to="/adminDashboard/product">
                                                <i className="fas fa-shopping-cart"></i>
                                                <span>Products</span>
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/adoption-portal">
                                                <i className="fas fa-paw"></i>
                                                <span>Adoption Portal</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/submit-ad">
                                                <i className="fas fa-plus-circle"></i>
                                                <span>Submit Ad</span>
                                            </Link>
                                        </li>
                </ul>
            </div>
            <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <h2 className="page-title">Employee Dashboard</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="kpi-container">
                    <div className="kpi-card">
                        <i className="fas fa-calendar-check kpi-icon"></i>
                        <h4>Total Appointments</h4>
                        <p>{receivedData.reduce((sum, data) => sum + data.appointmentCount, 0)}</p>
                    </div>
                    <div className="kpi-card">
                        <i className="fas fa-users kpi-icon"></i>
                        <h4>Employees</h4>
                        <p>{receivedData.length}</p>
                    </div>
                </div>

                <div className="card chart-container">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <Bar data={chartData} options={chartOptions} />
                    )}
                </div>

                <div className="card table-container">
                    <h3>Received Appointment Data</h3>
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
                        <div className="loading">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <table className="table table-striped table-hover">
                                <thead>
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
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    * { font-family: 'Inter', sans-serif; }
                    .dashboard-wrapper { display: flex; min-height: 100vh; background-color: #f1f4f8; }
                    .top-navbar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 60px;
                        background-color: #343a40;
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 20px;
                        z-index: 1000;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .navbar-brand { font-size: 20px; font-weight: 600; }
                    .navbar-user { display: flex; align-items: center; gap: 15px; }
                    .navbar-user span { font-size: 14px; }
                    .logout-link { color: #ffffff; text-decoration: none; }
                    .logout-link:hover { color: #007bff; }
                    .sidebar {
                        width: 240px;
                        background-color: #343a40;
                        color: #ffffff;
                        padding: 20px;
                        position: fixed;
                        top: 60px;
                        bottom: 0;
                        transition: width 0.3s ease;
                    }
                    .sidebar.collapsed { width: 60px; }
                    .sidebar.collapsed .sidebar-title, .sidebar.collapsed span { display: none; }
                    .sidebar-toggle {
                        background: none;
                        border: none;
                        color: #ffffff;
                        font-size: 18px;
                        margin-bottom: 20px;
                        cursor: pointer;
                    }
                    .sidebar-title { font-size: 18px; font-weight: 600; margin-bottom: 20px; }
                    .sidebar ul { list-style: none; padding: 0; }
                    .sidebar li { margin: 10px 0; }
                    .sidebar a {
                        color: #ffffff;
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px;
                        border-radius: 5px;
                        transition: background-color 0.2s ease;
                    }
                    .sidebar a:hover, .sidebar li.active a { background-color: #007bff; }
                    .main-content {
                        margin-left: 240px;
                        margin-top: 60px;
                        padding: 30px;
                        flex-grow: 1;
                        transition: margin-left 0.3s ease;
                    }
                    .main-content.collapsed { margin-left: 60px; }
                    .page-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #343a40;
                        margin-bottom: 20px;
                        position: relative;
                    }
                    .page-title::after {
                        content: "";
                        position: absolute;
                        bottom: -5px;
                        left: 0;
                        width: 50px;
                        height: 3px;
                        background-color: #007bff;
                    }
                    .kpi-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                    .kpi-card {
                        background: linear-gradient(135deg, #ffffff, #f8f9fa);
                        border-radius: 10px;
                        padding: 20px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        text-align: center;
                        transition: transform 0.2s ease;
                    }
                    .kpi-card:hover { transform: translateY(-5px); }
                    .kpi-icon { font-size: 24px; color: #007bff; margin-bottom: 10px; }
                    .kpi-card h4 { font-size: 16px; color: #343a40; margin: 0; }
                    .kpi-card p { font-size: 28px; font-weight: 600; color: #007bff; margin: 10px 0 0; }
                    .card {
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        padding: 20px;
                        margin-bottom: 30px;
                        animation: fadeIn 0.5s ease;
                    }
                    .chart-container { padding: 20px; }
                    .table-container h3 { font-size: 18px; font-weight: 600; color: #343a40; margin-bottom: 20px; }
                    .filter-container { margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
                    .filter-container label { font-size: 14px; color: #343a40; }
                    .filter-container select {
                        padding: 8px;
                        border-radius: 5px;
                        border: 1px solid #ced4da;
                        font-size: 14px;
                    }
                    .table { width: 100%; border-collapse: separate; border-spacing: 0; }
                    .table thead th {
                        background-color: #343a40;
                        color: #ffffff;
                        font-weight: 600;
                        padding: 12px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .table tbody tr { transition: background-color 0.2s ease; }
                    .table tbody tr:hover { background-color: #e9ecef; }
                    .table td { padding: 12px; font-size: 14px; color: #343a40; }
                    .alert {
                        border-radius: 5px;
                        padding: 12px;
                        font-size: 14px;
                        margin-bottom: 20px;
                        animation: fadeIn 0.5s ease;
                    }
                    .alert-danger { background-color: #f8d7da; color: #721c24; }
                    .alert-success { background-color: #d4edda; color: #155724; }
                    .btn-primary {
                        background: linear-gradient(135deg, #007bff, #0056b3);
                        border: none;
                        border-radius: 5px;
                        padding: 10px 20px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #ffffff;
                        transition: transform 0.2s ease, background 0.2s ease;
                    }
                    .btn-primary:hover {
                        background: linear-gradient(135deg, #0056b3, #003d80);
                        transform: translateY(-2px);
                    }
                    .loading { text-align: center; padding: 20px; }
                    .spinner-border {
                        width: 2rem;
                        height: 2rem;
                        border-color: #007bff;
                        border-right-color: transparent;
                    }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @media (max-width: 768px) {
                        .sidebar { width: 60px; }
                        .sidebar .sidebar-title, .sidebar span { display: none; }
                        .main-content { margin-left: 60px; }
                        .kpi-container { grid-template-columns: 1fr; }
                        .top-navbar { flex-direction: column; height: auto; padding: 10px; }
                        .navbar-user { margin-top: 10px; }
                    }
                `}
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        </div>
    );
}

export default Dashboard;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AddEmployee() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [employees, setEmployees] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            setLoading(true);
            setError(""); // Clear previous errors
            const response = await axios.get("https://online-system-for-pet-care-and-treatment.onrender.com/employee/get", {
                timeout: 5000 // Add timeout to prevent hanging
            });
            console.log("Fetched employees:", response.data); // Debug log
            setEmployees(response.data.employees || []);
            setTotalCount(response.data.totalCount || 0);
        } catch (error) {
            console.error("Error fetching employees:", error); // Detailed error logging
            setError(`Failed to fetch employees: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ''}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!firstName || !lastName || !username || !email || !password || !role) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        const employeeData = {
            firstName,
            lastName,
            username,
            email,
            password,
            role,
        };

        try {
            if (editingEmployee) {
                const response = await axios.put(`https://online-system-for-pet-care-and-treatment.onrender.com/employee/${editingEmployee._id}`, employeeData);
                console.log("Updated employee:", response.data); // Debug log
                setEmployees(employees.map(emp => emp._id === editingEmployee._id ? response.data.employee : emp));
                setTotalCount(response.data.totalCount);
                setSuccess("Employee updated successfully!");
            } else {
                const response = await axios.post("https://online-system-for-pet-care-and-treatment.onrender.com/employee/create", employeeData);
                console.log("Created employee:", response.data); // Debug log
                setEmployees([...employees, response.data.employee]);
                setTotalCount(response.data.totalCount);
                setSuccess("Employee added successfully!");
            }
            setFirstName("");
            setLastName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("");
            setEditingEmployee(null);
        } catch (error) {
            console.error("Error in handleSubmit:", error); // Detailed error logging
            setError(error.response?.data?.error || (editingEmployee ? "Failed to update employee." : "Failed to add employee."));
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                setActionLoading((prev) => ({ ...prev, [id]: "delete" }));
                const response = await axios.delete(`https://online-system-for-pet-care-and-treatment.onrender.com/employee/${id}`);
                console.log("Deleted employee:", response.data); // Debug log
                setEmployees(employees.filter((emp) => emp._id !== id));
                setTotalCount(response.data.totalCount);
                setSuccess("Employee deleted successfully!");
            } catch (error) {
                console.error("Error deleting employee:", error); // Detailed error logging
                setError(`Failed to delete employee: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ''}`);
            } finally {
                setActionLoading((prev) => ({ ...prev, [id]: null }));
            }
        }
    }

    function handleEdit(employee) {
        setEditingEmployee(employee);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setUsername(employee.username);
        setEmail(employee.email);
        setPassword(employee.password);
        setRole(employee.role);
    }

    function handleCancelEdit() {
        setEditingEmployee(null);
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
    }

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
                    <li>
                        <Link to="/adminDashboard">
                            <i className="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="active">
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
                    <Link to="/financial">
              <i className="fas fa-plus-circle"></i>
              <span>Financial Management</span>
            </Link>
                </ul>
            </div>
            <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <h2 className="page-title">{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="card form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-user-tag"></i></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Role</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-briefcase"></i></span>
                                    <select
                                        className="form-control"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Vet">Vet</option>
                                        <option value="Groomer">Groomer</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? "Processing..." : editingEmployee ? "Update Employee" : "Add Employee"}
                            </button>
                            {editingEmployee && (
                                <button type="button" className="btn btn-secondary w-100" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="card table-container">
                    <h3>Employee List (Total: {totalCount})</h3>
                    {loading ? (
                        <div className="loading">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((employee) => (
                                        <tr key={employee._id}>
                                            <td>{employee.employeeId}</td>
                                            <td>{employee.firstName}</td>
                                            <td>{employee.lastName}</td>
                                            <td>{employee.username}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.role}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(employee)}
                                                    disabled={actionLoading[employee._id] === "edit"}
                                                >
                                                    {actionLoading[employee._id] === "edit" ? "Editing..." : "Edit"}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(employee._id)}
                                                    disabled={actionLoading[employee._id] === "delete"}
                                                >
                                                    {actionLoading[employee._id] === "delete" ? "Deleting..." : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No employees found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                    .card {
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        padding: 20px;
                        margin-bottom: 30px;
                        animation: fadeIn 0.5s ease;
                    }
                    .form-container { padding: 20px; }
                    .form-label {
                        font-size: 14px;
                        font-weight: 500;
                        color: #343a40;
                        margin-bottom: 5px;
                    }
                    .input-group { position: relative; }
                    .input-group-text {
                        background-color: #f8f9fa;
                        border: 1px solid #ced4da;
                        border-right: none;
                        border-radius: 5px 0 0 5px;
                        color: #6c757d;
                    }
                    .form-control {
                        border-radius: 0 5px 5px 0;
                        border: 1px solid #ced4da;
                        padding: 10px;
                        font-size: 14px;
                        transition: border-color 0.2s ease;
                    }
                    .form-control:focus {
                        border-color: #007bff;
                        box-shadow: 0 0 5px rgba(0,123,255,0.3);
                    }
                    .table-container h3 { font-size: 18px; font-weight: 600; color: #343a40; margin-bottom: 20px; }
                    .table { width: 100%; border-collapse: separate; border-spacing: 0; }
                    .table thead th {
                        background-color: #343a40;
                        color: #ffffff;
                        font-weight: 600;
                        padding: 12px;
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
                    .btn-warning {
                        background: linear-gradient(135deg, #ffc107, #e0a800);
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        color: #212529;
                        transition: transform 0.2s ease;
                    }
                    .btn-warning:hover {
                        background: linear-gradient(135deg, #e0a800, #c69500);
                        transform: translateY(-2px);
                    }
                    .btn-danger {
                        background: linear-gradient(135deg, #dc3545, #c82333);
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        color: #ffffff;
                        transition: transform 0.2s ease;
                    }
                    .btn-danger:hover {
                        background: linear-gradient(135deg, #c82333, #b21f2d);
                        transform: translateY(-2px);
                    }
                    .btn-secondary {
                        background: linear-gradient(135deg, #6c757d, #5a6268);
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        color: #ffffff;
                        transition: transform 0.2s ease;
                    }
                    .btn-secondary:hover {
                        background: linear-gradient(135deg, #5a6268, #4b5258);
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
                        .row { flex-direction: column; }
                        .top-navbar { flex-direction: column; height: auto; padding: 10px; }
                        .navbar-user { margin-top: 10px; }
                    }
                `}
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        </div>
    );
}

export default AddEmployee;
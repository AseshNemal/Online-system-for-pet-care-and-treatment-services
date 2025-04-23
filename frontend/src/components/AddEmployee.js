import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AddEmployee() {
    const [employeeId, setEmployeeId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8090/employee/");
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to fetch employees.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!employeeId || !firstName || !lastName || !username || !email || !password || !role) {
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
            employeeId,
            firstName,
            lastName,
            username,
            email,
            password, // Plain text as requested
            role,
        };

        try {
            if (editingEmployee) {
                await axios.put(`http://localhost:8090/employee/${editingEmployee._id}`, employeeData);
                setSuccess("Employee updated successfully!");
            } else {
                await axios.post("http://localhost:8090/employee/create", employeeData);
                setSuccess("Employee added successfully!");
            }
            setEmployeeId("");
            setFirstName("");
            setLastName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("");
            setEditingEmployee(null);
            fetchEmployees();
        } catch (error) {
            setError(error.response?.data?.error || (editingEmployee ? "Failed to update employee." : "Failed to add employee."));
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                setActionLoading((prev) => ({ ...prev, [id]: "delete" }));
                await axios.delete(`http://localhost:8090/employee/${id}`);
                setSuccess("Employee deleted successfully!");
                fetchEmployees();
            } catch (error) {
                setError("Failed to delete employee.");
            } finally {
                setActionLoading((prev) => ({ ...prev, [id]: null }));
            }
        }
    }

    function handleEdit(employee) {
        setEditingEmployee(employee);
        setEmployeeId(employee.employeeId);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setUsername(employee.username);
        setEmail(employee.email);
        setPassword(employee.password);
        setRole(employee.role);
    }

    function handleCancelEdit() {
        setEditingEmployee(null);
        setEmployeeId("");
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
    }

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
                <h2 className="text-center mb-4">{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white form-container">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Employee ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
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

                <div className="table-container mt-5">
                    <h2 className="text-center mb-4">Employee List</h2>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
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
                    .form-container {
                        border-radius: 15px;
                        background-color: #ffffff;
                        padding: 30px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    }
                    .form-label {
                        font-weight: 600;
                        color: #2c3e50;
                        font-family: 'Poppins', sans-serif;
                    }
                    .form-control {
                        border-radius: 8px;
                        border: 1px solid #ced4da;
                        padding: 10px;
                        font-family: 'Roboto', sans-serif;
                    }
                    .form-control:focus {
                        border-color: #17a2b8;
                        box-shadow: 0 0 8px rgba(23, 162, 184, 0.3);
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
                    .btn-warning {
                        background-color: #ffc107;
                        border: none;
                        border-radius: 5px;
                        font-family: 'Roboto', sans-serif;
                    }
                    .btn-warning:hover { background-color: #e0a800; }
                    .btn-danger {
                        background-color: #dc3545;
                        border: none;
                        border-radius: 5px;
                        font-family: 'Roboto', sans-serif;
                    }
                    .btn-danger:hover { background-color: #c82333; }
                    .btn-secondary {
                        background-color: #6c757d;
                        border: none;
                        border-radius: 8px;
                        font-family: 'Poppins', sans-serif;
                    }
                    .btn-secondary:hover { background-color: #5a6268; }
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
                        .row { flex-direction: column; }
                    }
                `}
            </style>
        </div>
    );
}

export default AddEmployee;
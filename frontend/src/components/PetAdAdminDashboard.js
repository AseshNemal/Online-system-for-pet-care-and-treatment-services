import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function PetAdAdminDashboard() {
    const [ads, setAds] = useState([]);
    const [counts, setCounts] = useState({ Pending: 0, Approved: 0, Rejected: 0, Deleted: 0 });
    const [status, setStatus] = useState("Pending");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    // Fetch ads on component mount for the default status ("Pending")
    useEffect(() => {
        fetchAds("Pending");
    }, []);

    const fetchAds = async (newStatus) => {
        try {
            setError("");
            setSuccess("");
            setLoading(true);
            const response = await axios.get(`http://localhost:8090/pet-ad/admin/list?status=${newStatus}`);
            setAds(response.data.ads);
            setCounts(prev => ({ ...prev, [newStatus]: response.data.count }));
        } catch (err) {
            setError("Failed to fetch ads: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (newStatus) => {
        setStatus(newStatus);
        fetchAds(newStatus);
    };

    const approveAd = async (id) => {
        try {
            setError("");
            setSuccess("");
            await axios.post(`http://localhost:8090/pet-ad/admin/approve/${id}`);
            setSuccess("Ad approved successfully!");
            fetchAds(status);
        } catch (err) {
            setError("Failed to approve ad: " + err.message);
        }
    };

    const rejectAd = async (id) => {
        const rejectionReason = prompt("Please provide a reason for rejection:");
        if (!rejectionReason) return;
        try {
            setError("");
            setSuccess("");
            await axios.post(`http://localhost:8090/pet-ad/admin/reject/${id}`, { rejectionReason });
            setSuccess("Ad rejected successfully!");
            fetchAds(status);
        } catch (err) {
            setError("Failed to reject ad: " + err.message);
        }
    };

    const deleteAd = async (id) => {
        const deletionReason = prompt("Please provide a reason for deletion:");
        if (!deletionReason) return;
        try {
            setError("");
            setSuccess("");
            await axios.post(`http://localhost:8090/pet-ad/admin/delete/${id}`, { rejectionReason: deletionReason });
            setSuccess("Ad deleted successfully!");
            fetchAds(status);
        } catch (err) {
            setError("Failed to delete ad: " + err.message);
        }
    };

    const handleLogout = () => {
        setAds([]);
        setStatus("Pending");
        setError("");
        setSuccess("");
        navigate("/adminDashboard");
    };

    return (
        <div className="dashboard-wrapper">
            <div className="top-navbar">
                <div className="navbar-brand">Pet Care Admin</div>
                <div className="navbar-user">
                    <span>Admin User</span>
                    <button onClick={handleLogout} className="logout-link">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
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
                    <li>
                        <Link to="/employee">
                            <i className="fas fa-users"></i>
                            <span>Employee Management</span>
                        </Link>
                    </li>
                    
                    <li className="active">
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
                <h2 className="page-title">Admin Dashboard (Pet Ads)</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="tabs-container">
                    <button
                        className={`tab-button ${status === "Pending" ? "active" : ""}`}
                        onClick={() => handleTabChange("Pending")}
                    >
                        Pending ({counts.Pending || 0})
                    </button>
                    <button
                        className={`tab-button ${status === "Approved" ? "active" : ""}`}
                        onClick={() => handleTabChange("Approved")}
                    >
                        Approved ({counts.Approved || 0})
                    </button>
                    <button
                        className={`tab-button ${status === "Rejected" ? "active" : ""}`}
                        onClick={() => handleTabChange("Rejected")}
                    >
                        Rejected ({counts.Rejected || 0})
                    </button>
                    <button
                        className={`tab-button ${status === "Deleted" ? "active" : ""}`}
                        onClick={() => handleTabChange("Deleted")}
                    >
                        Deleted ({counts.Deleted || 0})
                    </button>
                </div>

                <div className="card ads-container">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : ads.length > 0 ? (
                        <div className="ads-grid">
                            {ads.map((ad) => (
                                <div key={ad._id} className="ad-card">
                                    <img src={ad.image} alt={`${ad.type} - ${ad.breed}`} />
                                    <div className="ad-details">
                                        <h4>{ad.type} - {ad.breed}</h4>
                                        <p><strong>Weight:</strong> {ad.weight} kg</p>
                                        <p><strong>Description:</strong> {ad.description}</p>
                                        <p><strong>Contact:</strong> {ad.contactNumber}</p>
                                        {ad.rejectionReason && (
                                            <p><strong>Reason:</strong> {ad.rejectionReason}</p>
                                        )}
                                        {status === "Pending" && (
                                            <div className="ad-actions">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => approveAd(ad._id)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => rejectAd(ad._id)}
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => deleteAd(ad._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No ads found for this status.</p>
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
                    .logout-link {
                        background: none;
                        border: none;
                        color: #ffffff;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        font-size: 14px;
                    }
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
                    .tabs-container { display: flex; gap: 10px; margin-bottom: 20px; }
                    .tab-button {
                        background: #e9ecef;
                        border: none;
                        border-radius: 5px;
                        padding: 10px 20px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #343a40;
                        cursor: pointer;
                        transition: background 0.2s ease;
                    }
                    .tab-button:hover, .tab-button.active {
                        background: #007bff;
                        color: #ffffff;
                    }
                    .ads-container { padding: 20px; }
                    .ads-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                    }
                    .ad-card {
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        overflow: hidden;
                        transition: transform 0.2s ease;
                    }
                    .ad-card:hover { transform: translateY(-5px); }
                    .ad-card img {
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                    }
                    .ad-details {
                        padding: 15px;
                    }
                    .ad-details h4 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #343a40;
                        margin-bottom: 10px;
                    }
                    .ad-details p {
                        font-size: 14px;
                        color: #343a40;
                        margin: 5px 0;
                    }
                    .ad-actions {
                        display: flex;
                        gap: 10px;
                        margin-top: 10px;
                    }
                    .btn {
                        border: none;
                        border-radius: 5px;
                        padding: 8px 15px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #ffffff;
                        cursor: pointer;
                        transition: transform 0.2s ease, background 0.2s ease;
                    }
                    .btn-success { background: #28a745; }
                    .btn-success:hover { background: #218838; }
                    .btn-warning { background: #ffc107; color: #343a40; }
                    .btn-warning:hover { background: #e0a800; }
                    .btn-danger { background: #dc3545; }
                    .btn-danger:hover { background: #c82333; }
                    .btn:hover { transform: translateY(-2px); }
                    .alert {
                        border-radius: 5px;
                        padding: 12px;
                        font-size: 14px;
                        margin-bottom: 20px;
                        animation: fadeIn 0.5s ease;
                    }
                    .alert-danger { background-color: #f8d7da; color: #721c24; }
                    .alert-success { background-color: #d4edda; color: #155724; }
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
                        .tabs-container { flex-wrap: wrap; }
                        .ad-card img { height: 150px; }
                    }
                `}
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        </div>
    );
}

export default PetAdAdminDashboard;
import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

function PetAdAdminDashboard() {
  const [ads, setAds] = useState([])
  const [counts, setCounts] = useState({ Pending: 0, Approved: 0, Rejected: 0, Deleted: 0 })
  const [status, setStatus] = useState("Pending")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  // State for edit functionality
  const [editAd, setEditAd] = useState(null)
  const [formData, setFormData] = useState({
    image: "",
    type: "",
    breed: "",
    weight: "",
    description: "",
    contactNumber: "",
  })
  const navigate = useNavigate()

  // Fetch ads on component mount for the default status ("Pending")
  useEffect(() => {
    fetchAds("Pending")
  }, [])

  const fetchAds = async (newStatus) => {
    try {
      setError("")
      setSuccess("")
      setLoading(true)
      const response = await axios.get(`http://localhost:8090/pet-ad/admin/list?status=${newStatus}`)
      setAds(response.data.ads)
      setCounts((prev) => ({ ...prev, [newStatus]: response.data.count }))
    } catch (err) {
      setError("Failed to fetch ads: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newStatus) => {
    setStatus(newStatus)
    fetchAds(newStatus)
    setEditAd(null) // Reset edit form when changing tabs
  }

  const approveAd = async (id) => {
    try {
      setError("")
      setSuccess("")
      await axios.post(`http://localhost:8090/pet-ad/admin/approve/${id}`)
      setSuccess("Ad approved successfully!")
      fetchAds(status)
    } catch (err) {
      setError("Failed to approve ad: " + err.message)
    }
  }

  const rejectAd = async (id) => {
    const rejectionReason = prompt("Please provide a reason for rejection:")
    if (!rejectionReason) return
    try {
      setError("")
      setSuccess("")
      await axios.post(`http://localhost:8090/pet-ad/admin/reject/${id}`, { rejectionReason })
      setSuccess("Ad rejected successfully!")
      fetchAds(status)
    } catch (err) {
      setError("Failed to reject ad: " + err.message)
    }
  }

  const deleteAd = async (id) => {
    const deletionReason = prompt("Please provide a reason for deletion:")
    if (!deletionReason) return
    try {
      setError("")
      setSuccess("")
      await axios.post(`http://localhost:8090/pet-ad/admin/delete/${id}`, { rejectionReason: deletionReason })
      setSuccess("Ad deleted successfully!")
      fetchAds(status)
    } catch (err) {
      setError("Failed to delete ad: " + err.message)
    }
  }

  const deleteApprovedAd = async (id) => {
    const deletionReason = prompt("Please provide a reason for deletion:")
    if (!deletionReason) return
    try {
      setError("")
      setSuccess("")
      await axios.delete(`http://localhost:8090/pet-ad/admin/approved/delete/${id}`, {
        data: { deletionReason },
      })
      setSuccess("Approved ad deleted successfully!")
      fetchAds(status)
    } catch (err) {
      setError("Failed to delete approved ad: " + err.response?.data?.error || err.message)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setError("")
      setSuccess("")
      await axios.put(`http://localhost:8090/pet-ad/admin/approved/edit/${editAd._id}`, formData)
      setSuccess("Approved ad updated successfully!")
      setEditAd(null) // Close edit form
      fetchAds(status) // Refresh ads
    } catch (err) {
      setError("Failed to update ad: " + err.response?.data?.error || err.message)
    }
  }

  const handleEdit = (ad) => {
    setEditAd(ad)
    setFormData({
      image: ad.image,
      type: ad.type,
      breed: ad.breed,
      weight: ad.weight,
      description: ad.description,
      contactNumber: ad.contactNumber,
    })
  }

  const handleLogout = () => {
    setAds([])
    setStatus("Pending")
    setError("")
    setSuccess("")
    navigate("/adminDashboard")
  }

  return (
    <div className="dashboard-wrapper">
      <style jsx>{`
        * {
          font-family: "Inter", sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: #f1f4f8;
          color: #333;
          line-height: 1.6;
        }

        /* Layout */
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f1f4f8;
          position: relative;
        }

        /* Top Navbar */
        .top-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: #2c3e50;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        .navbar-brand {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .navbar-user span {
          font-size: 14px;
          font-weight: 500;
        }

        .logout-link {
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .logout-link:hover {
          color: #3498db;
        }

        /* Sidebar */
        .sidebar {
          width: 240px;
          background-color: #2c3e50;
          color: #ffffff;
          padding: 20px;
          position: fixed;
          top: 60px;
          bottom: 0;
          transition: all 0.3s ease;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 900;
        }

        .sidebar.collapsed {
          width: 60px;
        }

        .sidebar.collapsed .sidebar-title,
        .sidebar.collapsed span {
          display: none;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 18px;
          margin-bottom: 20px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .sidebar-toggle:hover {
          transform: scale(1.1);
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #ecf0f1;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin: 10px 0;
        }

        .sidebar a {
          color: #ecf0f1;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .sidebar a:hover,
        .sidebar li.active a {
          background-color: #3498db;
          transform: translateX(5px);
        }

        .sidebar i {
          width: 20px;
          text-align: center;
        }

        /* Main Content */
        .main-content {
          margin-left: 240px;
          margin-top: 60px;
          padding: 30px;
          flex-grow: 1;
          transition: margin-left 0.3s ease;
        }

        .main-content.collapsed {
          margin-left: 60px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 25px;
          position: relative;
          padding-bottom: 10px;
        }

        .page-title::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #3498db;
          border-radius: 3px;
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .tab-button {
          background: #ecf0f1;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .tab-button:hover {
          background: #d5dbdb;
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: #3498db;
          color: #ffffff;
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }

        /* Ads Container */
        .ads-container {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          padding: 25px;
        }

        .ads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .ad-card {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #eaeaea;
        }

        .ad-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .ad-image-container {
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .ad-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .ad-card:hover img {
          transform: scale(1.05);
        }

        .ad-details {
          padding: 20px;
        }

        .ad-details h4 {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .ad-details p {
          font-size: 14px;
          color: #34495e;
          margin: 8px 0;
          line-height: 1.5;
        }

        .ad-details strong {
          font-weight: 600;
          color: #2c3e50;
        }

        .ad-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        /* Buttons */
        .btn {
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .btn-success {
          background: #2ecc71;
        }

        .btn-success:hover {
          background: #27ae60;
        }

        .btn-warning {
          background: #f39c12;
          color: #ffffff;
        }

        .btn-warning:hover {
          background: #e67e22;
        }

        .btn-danger {
          background: #e74c3c;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .btn-primary {
          background: #3498db;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .btn-secondary {
          background: #7f8c8d;
        }

        .btn-secondary:hover {
          background: #6c7a7d;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        /* Alerts */
        .alert {
          border-radius: 6px;
          padding: 15px;
          font-size: 14px;
          margin-bottom: 25px;
          animation: fadeIn 0.5s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .alert-danger {
          background-color: #fdecea;
          color: #c0392b;
          border-left: 4px solid #e74c3c;
        }

        .alert-success {
          background-color: #e8f8f5;
          color: #27ae60;
          border-left: 4px solid #2ecc71;
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 30px;
        }

        .spinner-border {
          display: inline-block;
          width: 2.5rem;
          height: 2.5rem;
          border: 3px solid rgba(52, 152, 219, 0.3);
          border-radius: 50%;
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .no-ads-message {
          text-align: center;
          padding: 30px;
          color: #7f8c8d;
          font-size: 16px;
        }

        /* Edit Form */
        .edit-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          animation: fadeIn 0.3s ease;
        }

        .edit-form {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          padding: 25px;
          width: 100%;
          max-width: 600px;
          animation: slideUp 0.3s ease;
        }

        .edit-form h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ecf0f1;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
          display: block;
          margin-bottom: 8px;
        }

        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #dfe6e9;
          border-radius: 6px;
          font-size: 14px;
          color: #2c3e50;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        textarea.form-control {
          min-height: 120px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 25px;
          justify-content: flex-end;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .ads-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 60px;
          }

          .sidebar .sidebar-title,
          .sidebar span {
            display: none;
          }

          .main-content {
            margin-left: 60px;
          }

          .tabs-container {
            flex-wrap: wrap;
          }

          .tab-button {
            flex: 1 0 calc(50% - 10px);
            text-align: center;
          }

          .ad-card img {
            height: 180px;
          }

          .edit-form {
            max-width: 90%;
            padding: 20px;
          }
        }

        @media (max-width: 576px) {
          .main-content {
            padding: 20px 15px;
          }

          .ads-grid {
            grid-template-columns: 1fr;
          }

          .tab-button {
            flex: 1 0 100%;
          }

          .ad-actions {
            flex-direction: column;
          }

          .ad-actions .btn {
            width: 100%;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="top-navbar">
        <div className="navbar-brand">Pet Care Admin</div>
        <div className="navbar-user">
          <span>Admin User</span>
          <button onClick={handleLogout} className="logout-link">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          <i className={`fas ${isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
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
      <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
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
                  <div className="ad-image-container">
                    <img src={ad.image || "/placeholder.svg"} alt={`${ad.type} - ${ad.breed}`} />
                  </div>
                  <div className="ad-details">
                    <h4>
                      {ad.type} - {ad.breed}
                    </h4>
                    <p>
                      <strong>Weight:</strong> {ad.weight} kg
                    </p>
                    <p>
                      <strong>Description:</strong> {ad.description}
                    </p>
                    <p>
                      <strong>Contact:</strong> {ad.contactNumber}
                    </p>
                    {ad.rejectionReason && (
                      <p>
                        <strong>Reason:</strong> {ad.rejectionReason}
                      </p>
                    )}
                    {status === "Pending" && (
                      <div className="ad-actions">
                        <button className="btn btn-success" onClick={() => approveAd(ad._id)}>
                          Approve
                        </button>
                        <button className="btn btn-warning" onClick={() => rejectAd(ad._id)}>
                          Reject
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteAd(ad._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                    {status === "Approved" && (
                      <div className="ad-actions">
                        <button className="btn btn-primary" onClick={() => handleEdit(ad)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteApprovedAd(ad._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-ads-message">No ads found for this status.</p>
          )}
        </div>

        {/* Edit Form */}
        {editAd && (
          <div className="edit-form-overlay">
            <div className="edit-form">
              <h3>Edit Approved Ad</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditAd(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </div>
  )
}

export default PetAdAdminDashboard
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
    setEditAd(null)
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
      setEditAd(null)
      fetchAds(status)
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
    <>
      <style>{`
        /* Dashboard Layout Styles */
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
        }
        
        .top-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: #2c3e50;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          z-index: 1000;
        }
        
        .navbar-brand {
          font-size: 20px;
          font-weight: bold;
        }
        
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .logout-link {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .logout-link:hover {
          color: #ecf0f1;
        }
        
        .sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          bottom: 0;
          width: 250px;
          background-color: #34495e;
          color: white;
          transition: width 0.3s;
          overflow-y: auto;
          z-index: 999;
        }
        
        .sidebar.collapsed {
          width: 60px;
        }
        
        .sidebar-toggle {
          position: absolute;
          right: 10px;
          top: 10px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
        
        .sidebar-title {
          padding: 20px 15px 10px;
          font-size: 16px;
          font-weight: bold;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar li {
          padding: 0;
        }
        
        .sidebar li a {
          display: flex;
          align-items: center;
          padding: 15px;
          color: #ecf0f1;
          text-decoration: none;
          transition: background-color 0.3s;
        }
        
        .sidebar li a:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .sidebar li a i {
          margin-right: 10px;
          width: 20px;
          text-align: center;
        }
        
        .sidebar li.active a {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .sidebar.collapsed .sidebar-title,
        .sidebar.collapsed li a span {
          display: none;
        }
        
        .sidebar.collapsed li a {
          justify-content: center;
        }
        
        .sidebar.collapsed li a i {
          margin-right: 0;
          font-size: 20px;
        }
        
        .main-content {
          margin-left: 250px;
          margin-top: 60px;
          padding: 20px;
          flex-grow: 1;
          transition: margin-left 0.3s;
        }
        
        .main-content.collapsed {
          margin-left: 60px;
        }
        
        /* Pet Ad Admin Dashboard Specific Styles */
        .page-title {
          font-size: 24px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 5px;
        }
        
        .tab-button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          background-color: #ecf0f1;
          color: #7f8c8d;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .tab-button:hover {
          background-color: #d5dbdb;
        }
        
        .tab-button.active {
          background-color: #3498db;
          color: white;
        }
        
        .card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .ads-container {
          min-height: 300px;
          position: relative;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        
        .no-ads-message {
          text-align: center;
          color: #7f8c8d;
          padding: 40px 0;
        }
        
        .ads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .ad-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .ad-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .ad-image-container {
          height: 200px;
          overflow: hidden;
        }
        
        .ad-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        
        .ad-card:hover .ad-image-container img {
          transform: scale(1.05);
        }
        
        .ad-details {
          padding: 15px;
        }
        
        .ad-details h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .ad-details p {
          margin: 5px 0;
          color: #34495e;
          font-size: 14px;
        }
        
        .ad-details p strong {
          color: #2c3e50;
        }
        
        .ad-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .btn {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .btn-success {
          background-color: #2ecc71;
          color: white;
        }
        
        .btn-success:hover {
          background-color: #27ae60;
        }
        
        .btn-warning {
          background-color: #f39c12;
          color: white;
        }
        
        .btn-warning:hover {
          background-color: #d35400;
        }
        
        .btn-danger {
          background-color: #e74c3c;
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #c0392b;
        }
        
        .btn-primary {
          background-color: #3498db;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #2980b9;
        }
        
        .btn-secondary {
          background-color: #95a5a6;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #7f8c8d;
        }
        
        .alert {
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .alert-danger {
          background-color: #fdecea;
          color: #d32f2f;
          border: 1px solid #f5c2c7;
        }
        
        .alert-success {
          background-color: #edf7ed;
          color: #2e7d32;
          border: 1px solid #badbcc;
        }
        
        /* Edit Form Styles */
        .edit-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }
        
        .edit-form {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 600px;
          padding: 20px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .edit-form h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #34495e;
        }
        
        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        
        textarea.form-control {
          min-height: 100px;
          resize: vertical;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .ads-grid {
            grid-template-columns: 1fr;
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .sidebar {
            transform: translateX(-100%);
          }
          
          .sidebar.collapsed {
            transform: translateX(-100%);
          }
          
          .sidebar.show {
            transform: translateX(0);
          }
        }
      `}</style>

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
            <li>
            <Link to="/financial">
              <i className="fas fa-plus-circle"></i>
              <span>Financial Management</span>
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
      </div>
    </>
  )
}

export default PetAdAdminDashboard
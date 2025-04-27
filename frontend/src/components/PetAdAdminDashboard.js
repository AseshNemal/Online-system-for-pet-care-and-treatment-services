import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "../petadadmindashboard.css"

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
    </div>
  )
}

export default PetAdAdminDashboard

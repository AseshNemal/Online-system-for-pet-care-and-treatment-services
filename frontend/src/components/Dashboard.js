import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import "../dashboard.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Dashboard() {
  const [receivedData, setReceivedData] = useState([])
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [sortField, setSortField] = useState("appointmentCount")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterRole, setFilterRole] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    fetchReceivedData()
    fetchEmployeeCount()
    const interval = setInterval(fetchEmployeeCount, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchReceivedData() {
    try {
      setLoading(true)
      console.log("Fetching sorted appointment data")
      const response = await axios.get("http://localhost:8090/employee/sorted-appointment-data", {
        timeout: 5000,
      })
      console.log("Fetched appointment data:", response.data) // Debug log
      setReceivedData(response.data || [])
    } catch (error) {
      console.error("Error fetching received data:", error)
      setError(
        `Failed to fetch appointment data: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ""}`,
      )
    } finally {
      setLoading(false)
    }
  }

  async function fetchEmployeeCount() {
    try {
      const response = await axios.get("http://localhost:8090/employee/count", {
        timeout: 5000,
      })
      console.log("Fetched employee count:", response.data) // Debug log
      setTotalEmployeeCount(response.data.totalCount || 0)
    } catch (error) {
      console.error("Error fetching employee count:", error)
      setError(
        `Failed to fetch employee count: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ""}`,
      )
    }
  }

  async function sortAndUploadData() {
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      console.log("Fetching data to sort")
      const response = await axios.get("http://localhost:8090/employee/sorted-appointment-data")
      const dataToSort = response.data
      const sortedData = [...dataToSort].sort((a, b) => b.appointmentCount - a.appointmentCount)
      console.log("Clearing existing data")
      await axios.delete("http://localhost:8090/employee/sorted-appointment-data")
      console.log("Uploading sorted data")
      for (const data of sortedData) {
        await axios.post("http://localhost:8090/employee/receive-appointment-data", {
          employeeId: data.employeeId,
          name: data.name,
          role: data.role,
          appointmentCount: data.appointmentCount,
        })
      }
      setSuccess("Data sorted and uploaded successfully!")
      fetchReceivedData()
    } catch (error) {
      console.error("Error sorting and uploading data:", error)
      setError(
        `Failed to sort and upload data: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ""}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortOrder(newOrder)
    setReceivedData(
      [...receivedData].sort((a, b) => {
        const aValue = field === "appointmentCount" ? a[field] : a[field].toLowerCase()
        const bValue = field === "appointmentCount" ? b[field] : b[field].toLowerCase()
        if (newOrder === "asc") {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      }),
    )
  }

  const filteredData = filterRole ? receivedData.filter((data) => data.role === filterRole) : receivedData

  const chartData = {
    labels: filteredData.map((data) => data.name),
    datasets: [
      {
        label: "Total Appointments",
        data: filteredData.map((data) => data.appointmentCount),
        backgroundColor: "rgba(53, 162, 235, 0.7)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Employee Appointment Counts" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of Appointments" } },
      x: { title: { display: true, text: "Employee Name" } },
    },
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
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          <i className={`fas ${isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
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
      <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <h2 className="page-title">Employee Dashboard</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="kpi-container">
          <div className="kpi-card">
            <div className="kpi-icon-container">
              <i className="fas fa-calendar-check kpi-icon"></i>
            </div>
            <div className="kpi-content">
              <h4>Total Appointments</h4>
              <p>{receivedData.reduce((sum, data) => sum + data.appointmentCount, 0)}</p>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon-container">
              <i className="fas fa-users kpi-icon"></i>
            </div>
            <div className="kpi-content">
              <h4>Total Employees</h4>
              <p>{totalEmployeeCount}</p>
            </div>
          </div>
        </div>

        <div className="card chart-container">
          <h3 className="card-title">Appointment Distribution</h3>
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
          <h3 className="card-title">Appointment Data</h3>
          <div className="filter-container">
            <label htmlFor="role-filter">Filter by Role: </label>
            <select
              id="role-filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
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
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("employeeId")}>
                        Employee ID {sortField === "employeeId" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("name")}>
                        Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("role")}>
                        Role {sortField === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("appointmentCount")}>
                        Appointment Count {sortField === "appointmentCount" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((data) => (
                        <tr key={data.employeeId}>
                          <td>{data.employeeId}</td>
                          <td>{data.name}</td>
                          <td>
                            <span className={`role-badge ${data.role.toLowerCase()}`}>{data.role}</span>
                          </td>
                          <td>
                            <span className="appointment-count">{data.appointmentCount}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-actions">
                <button className="btn btn-primary" onClick={sortAndUploadData} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sort-amount-down me-2"></i>
                      Sort and Upload Data
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    </div>
  )
}

export default Dashboard

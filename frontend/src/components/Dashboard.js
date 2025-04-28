import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

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
      console.log("Fetching appointment data")
      const response = await axios.get("http://localhost:8090/api/appointments/all", {
        timeout: 5000,
      })
      console.log("Fetched appointment data:", response.data)
      
      // Group appointments by employee and calculate counts
      const employeeMap = new Map()
      
      response.data.forEach(appointment => {
        const { employeeId, employeeFirstName, employeeRole } = appointment
        
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            employeeId,
            name: employeeFirstName,
            role: employeeRole,
            appointmentCount: 0
          })
        }
        
        const employee = employeeMap.get(employeeId)
        employee.appointmentCount++
      })
      
      setReceivedData(Array.from(employeeMap.values()))
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
      console.log("Fetched employee count:", response.data)
      setTotalEmployeeCount(response.data.totalCount || 0)
    } catch (error) {
      console.error("Error fetching employee count:", error)
      setError(
        `Failed to fetch employee count: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ""}`,
      )
    }
  }

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortOrder(newOrder)
    setReceivedData(
      [...receivedData].sort((a, b) => {
        const aValue = field === "appointmentCount" ? a[field] : (a[field] || '').toLowerCase()
        const bValue = field === "appointmentCount" ? b[field] : (b[field] || '').toLowerCase()
        if (newOrder === "asc") {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      }),
    )
  }

  const filteredData = filterRole ? receivedData.filter((data) => (data.role || '').toLowerCase() === filterRole.toLowerCase()) : receivedData

  const chartData = {
    labels: filteredData.map((data) => data.name || 'Unknown'),
    datasets: [
      {
        label: "Total Appointments",
        data: filteredData.map((data) => data.appointmentCount || 0),
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
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

        * {
          font-family: "Inter", sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: #f5f7fa;
          color: #333;
          line-height: 1.6;
        }

        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
          position: relative;
        }

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
          color: #ffffff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .logout-link:hover {
          color: #3498db;
        }

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

        .kpi-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .kpi-card {
          background: #ffffff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
          border-left: 4px solid #3498db;
        }

        .kpi-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .kpi-icon-container {
          background: rgba(52, 152, 219, 0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon {
          font-size: 24px;
          color: #3498db;
        }

        .kpi-content {
          flex: 1;
        }

        .kpi-card h4 {
          font-size: 16px;
          color: #7f8c8d;
          margin: 0;
          font-weight: 500;
        }

        .kpi-card p {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin: 5px 0 0;
        }

        .card {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          padding: 25px;
          margin-bottom: 30px;
          animation: fadeIn 0.5s ease;
          border: none;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ecf0f1;
        }

        .chart-container {
          padding: 20px;
          min-height: 400px;
        }

        .table-container {
          padding: 25px;
        }

        .filter-container {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-container label {
          font-size: 14px;
          color: #2c3e50;
          font-weight: 500;
        }

        .filter-select {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          font-size: 14px;
          color: #2c3e50;
          background-color: #fff;
          transition: all 0.2s ease;
          min-width: 150px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .table-responsive {
          overflow-x: auto;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .table thead th {
          background-color: #f8f9fa;
          color: #2c3e50;
          font-weight: 600;
          padding: 15px;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
          border-bottom: 2px solid #e9ecef;
          transition: background-color 0.2s ease;
        }

        .table thead th:hover {
          background-color: #e9ecef;
        }

        .table tbody tr {
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #e9ecef;
        }

        .table tbody tr:last-child {
          border-bottom: none;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .table td {
          padding: 15px;
          font-size: 14px;
          color: #2c3e50;
          vertical-align: middle;
        }

        .text-center {
          text-align: center;
        }

        .role-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-badge.vet {
          background-color: rgba(46, 204, 113, 0.15);
          color: #27ae60;
        }

        .role-badge.groomer {
          background-color: rgba(52, 152, 219, 0.15);
          color: #2980b9;
        }

        .appointment-count {
          font-weight: 600;
          color: #2c3e50;
        }

        .table-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn {
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2980b9, #2471a3);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
        }

        .btn-primary:disabled {
          background: #95a5a6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn .me-2 {
          margin-right: 8px;
        }

        .btn .ms-2 {
          margin-left: 8px;
        }

        .alert {
          border-radius: 8px;
          padding: 15px;
          font-size: 14px;
          margin-bottom: 25px;
          animation: fadeIn 0.5s ease;
          display: flex;
          align-items: center;
          gap: 10px;
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

        .loading {
          text-align: center;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
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

        .spinner-border-sm {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          border-top-color: #ffffff;
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 992px) {
          .kpi-container {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

          .kpi-container {
            grid-template-columns: 1fr;
          }

          .top-navbar {
            flex-direction: column;
            height: auto;
            padding: 10px;
          }

          .navbar-user {
            margin-top: 10px;
          }

          .table thead th,
          .table td {
            padding: 10px;
          }
        }

        @media (max-width: 576px) {
          .main-content {
            padding: 20px 15px;
          }

          .kpi-card {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .kpi-icon-container {
            margin: 0 auto;
          }

          .filter-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-select {
            width: 100%;
          }

          .table-actions {
            justify-content: center;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

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
          <li>
            <Link to="/financial">
              <i className="fas fa-plus-circle"></i>
              <span>Financial Management</span>
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
                        <tr key={data.employeeId || Math.random()}>
                          <td>{data.employeeId || 'N/A'}</td>
                          <td>{data.name || 'N/A'}</td>
                          <td>
                            <span className={`role-badge ${(data.role || '').toLowerCase()}`}>
                              {data.role || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className="appointment-count">{data.appointmentCount || 0}</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
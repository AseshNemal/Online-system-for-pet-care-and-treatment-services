import { useEffect, useState } from "react"
import axios from "axios"
import "../myOrderPage.css"

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [userId, setUserId] = useState("")
  const [sortDirection, setSortDirection] = useState("desc") // desc = newest first

  useEffect(() => {
    // Get logged-in user
    fetch("https://online-system-for-pet-care-and-treatment.onrender.com/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user._id)
        }
      })
  }, [])

  useEffect(() => {
    if (!userId) return

    axios
      .get(`https://online-system-for-pet-care-and-treatment.onrender.com/order/user/${userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err))
  }, [userId])

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc")
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortDirection === "desc" ? dateB - dateA : dateA - dateB
  })

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatOrderId = (id) => {
    // Take the last 6 characters of the ID for a cleaner display
    return id.slice(-6).toUpperCase()
  }

  return (
    <div className="body">
    <div className="my-orders-container">
      <div className="orders-header">
        <h2>My Orders</h2>
        <button
          className="sort-button"
          onClick={toggleSortDirection}
          aria-label={`Sort by ${sortDirection === "desc" ? "oldest" : "newest"} first`}
        >
          <span>{sortDirection === "desc" ? "Newest" : "Oldest"} First</span>
          <span className="sort-icon">{sortDirection === "desc" ? "↓" : "↑"}</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="package-icon">📦</div>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {sortedOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="label">Order</span>
                  <span className="value">#{formatOrderId(order._id)}</span>
                </div>
                <div className="order-date">
                  <span className="calendar-icon">📅</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div className="item-name">{item.name}</div>
                    <div className="item-details">
                      <span className="item-quantity">{item.quantity} ×</span>
                      <span className="item-price">Rs.{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="label">Total</span>
                  <span className="value">Rs. {order.totalAmount}.00</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

export default MyOrdersPage

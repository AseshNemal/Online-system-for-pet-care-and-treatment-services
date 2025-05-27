import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "../paymentPage.css"

const PaymentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart: cartItems, totalValue: totalAmount } = location.state || { cart: [], totalValue: 0 }
  const [userId, setUserId] = useState("")

  // Form validation states
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [errors, setErrors] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    // Fetch the user ID from session
    fetch("https://online-system-for-pet-care-and-treatment.onrender.com/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUserId(data.user._id)
      })
      .catch((err) => console.error("Error fetching session:", err))
  }, [])

  const handlePay = async () => {
    try {
      const orderResponse = await axios.post("https://online-system-for-pet-care-and-treatment.onrender.com/order/create", {
        userId,
        items: cartItems.map(({ _id, name, price, quantity }) => ({
          productId: _id,
          name,
          price,
          quantity,
        })),
        totalAmount,
      }, {
        withCredentials: true
      })

      for (const item of cartItems) {
        await axios.put(`https://online-system-for-pet-care-and-treatment.onrender.com/product/reduce-stock/${item._id}`, {
          quantity: item.quantity,
        }, {
          withCredentials: true
        })
      }

      alert("Order placed successfully!")
      navigate("/product/all")
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message)
      alert("Failed to process payment.")
    }
  }

  // Validation functions
  const validateCardName = (value) => {
    if (!value.trim()) return "Cardholder name is required"
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Name should contain only letters"
    return ""
  }

  const validateCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "")
    if (!cleaned) return "Card number is required"
    if (!/^\d{16}$/.test(cleaned)) return "Card number must be 16 digits"
    return ""
  }

  const validateExpiryDate = (value) => {
    if (!value) return "Expiry date is required"
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return "Format must be MM/YY"

    const [month, year] = value.split("/")
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    if (
      Number.parseInt(year) < currentYear ||
      (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
    ) {
      return "Card has expired"
    }

    return ""
  }

  const validateCVV = (value) => {
    if (!value) return "CVV is required"
    if (!/^\d{3,4}$/.test(value)) return "CVV must be 3 or 4 digits"
    return ""
  }

  // Handle input changes with validation
  const handleCardNameChange = (e) => {
    const value = e.target.value
    setCardName(value)
    setErrors((prev) => ({ ...prev, cardName: validateCardName(value) }))
  }

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")
    // Format with spaces every 4 digits
    value = value
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim()
      .slice(0, 19)
    setCardNumber(value)
    setErrors((prev) => ({ ...prev, cardNumber: validateCardNumber(value) }))
  }

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setExpiryDate(value)
    setErrors((prev) => ({ ...prev, expiryDate: validateExpiryDate(value) }))
  }

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCvv(value)
    setErrors((prev) => ({ ...prev, cvv: validateCVV(value) }))
  }

  // Check if form is valid
  const isFormValid = () => {
    return (
      cardName &&
      cardNumber &&
      expiryDate &&
      cvv &&
      !errors.cardName &&
      !errors.cardNumber &&
      !errors.expiryDate &&
      !errors.cvv
    )
  }

  return (
    <div className="payment-container">
      <div className="payment-summary">
        <h2>Order Summary</h2>
        <div className="items-list">
          {cartItems.map((item) => (
            <div key={item._id} className="item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">{item.quantity} x</span>
              <span className="item-price">Rs. {item.price}.00</span>
            </div>
          ))}
        </div>
        <div className="total">
          <span>Total</span>
          <span>Rs. {totalAmount}.00</span>
        </div>
      </div>

      <div className="payment-details">
        <h2>Payment Details</h2>
        <div className="card-icon">
          <div className="chip"></div>
          <div className="card-type">VISA</div>
        </div>

        <div className="form-group">
          <label htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={handleCardNameChange}
            placeholder="John Smith"
            className={errors.cardName ? "error" : ""}
          />
          {errors.cardName && <span className="error-message">{errors.cardName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={errors.cardNumber ? "error" : ""}
          />
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/YY"
              className={errors.expiryDate ? "error" : ""}
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={handleCVVChange}
              placeholder="123"
              className={errors.cvv ? "error" : ""}
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>

        <button
          onClick={handlePay}
          className={`pay-button ${isFormValid() ? "active" : "disabled"}`}
          disabled={!isFormValid()}
        >
          Pay Now
        </button>
      </div>
    </div>
  )
}

export default PaymentPage

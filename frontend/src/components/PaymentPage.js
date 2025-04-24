import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: cartItems, totalValue: totalAmount } = location.state || { cart: [], totalValue: 0};
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Fetch the user ID from session
    fetch("http://localhost:8090/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUserId(data.user._id);
      })
      .catch((err) => console.error("Error fetching session:", err));
  }, []);

  const handlePay = async () => {
    try {
      const orderResponse = await axios.post("http://localhost:8090/order/create", {
        userId,
        items: cartItems.map(({ _id, name, price, quantity }) => ({
          productId: _id,
          name,
          price,
          quantity,
        })),
        totalAmount,
      });

      for(const item of cartItems){
        await axios.put(`http://localhost:8090/product/reduce-stock/${item._id}`, {
          quantity: item.quantity,
        });
      }

      alert("Order placed successfully!");
      navigate("/store"); // or redirect to a success page
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message);
      alert("Failed to process payment.");
    }
  };

  return (
    <div className="payment-page">
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item._id}>
            {item.name} - {item.quantity} x Rs.{item.price}
          </div>
        ))}
        <h3>Total: Rs.{totalAmount}</h3>
      </div>

      <div className="payment-form">
        <h2>Payment Details</h2>
        <input type="text" placeholder="Cardholder Name" />
        <input type="text" placeholder="Card Number" />
        <input type="text" placeholder="Expiry Date" />
        <input type="text" placeholder="CVV" />
        <button onClick={handlePay}>Pay</button>
      </div>
    </div>
  );
};

export default PaymentPage;

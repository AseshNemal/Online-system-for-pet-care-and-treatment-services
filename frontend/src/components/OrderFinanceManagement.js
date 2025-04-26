import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderFinanceManagement.css';

const OrderFinanceManagement = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateTotals = (orderData) => {
    const total = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalAmount(total);
    setOrderCount(orderData.length);
  };

  const generateReport = () => {
    const reportContent = orders.map(order => 
      `Order ID: ${order.id}\nTotal Amount: $${order.totalAmount}\n\n`
    ).join('');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="order-finance-container">
      <h2>Order Finance Management</h2>
      
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>${order.totalAmount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total Orders: {orderCount}</td>
              <td>Total Amount: ${totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button onClick={generateReport} className="generate-report-btn">
        Generate Report
      </button>
    </div>
  );
};

export default OrderFinanceManagement; 
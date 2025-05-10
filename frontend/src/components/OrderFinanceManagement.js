import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './OrderFinanceManagement.css';

const OrderFinanceManagement = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8090/order/all');
      setOrders(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const calculateTotals = (orderData) => {
    const total = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalAmount(total);
    setOrderCount(orderData.length);
  };

  const formatOrderId = (id) => {
    // Take the last 6 characters of the ID for a cleaner display
    return id.slice(-6).toUpperCase();
  };

  const generateReport = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Create table header
    const tableHeader = `
╔══════════╦════════════╦═══════╦═════════════╗
║ Order ID ║ Date       ║ Items ║ Total Amount║
╠══════════╬════════════╬═══════╬═════════════╣`;

    // Create table rows
    const tableRows = orders.map(order => {
      const orderId = formatOrderId(order._id);
      const date = new Date(order.createdAt).toLocaleDateString();
      const items = order.items.length.toString();
      const amount = `Rs. ${order.totalAmount}`;
      
      return `
║ ${orderId.padEnd(8)} ║ ${date.padEnd(10)} ║ ${items.padEnd(5)} ║ ${amount.padEnd(11)} ║`;
    }).join('');

    // Create table footer
    const tableFooter = `
╠══════════╬════════════╬═══════╬═════════════╣
║ Total Orders: ${orderCount.toString().padEnd(3)} ║ Total Amount: Rs. ${totalAmount.toString().padEnd(7)} ║
╚══════════╩════════════╩═══════╩═════════════╝`;

    const reportContent = `ORDER FINANCE REPORT
Generated on: ${currentDate} at ${currentTime}
════════════════════════════════════════════════════════════════════════════════

${tableHeader}${tableRows}${tableFooter}

SUMMARY:
════════════════════════════════════════════════════════════════════════════════
Total Number of Orders: ${orderCount}
Total Revenue: Rs. ${totalAmount}
════════════════════════════════════════════════════════════════════════════════`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_finance_report_${currentDate.replace(/\//g, '-')}.txt`;
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
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{formatOrderId(order._id)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.items.length}</td>
                <td>Rs. {order.totalAmount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Total Orders: {orderCount}</td>
              <td colSpan="2">Total Amount: Rs. {totalAmount}</td>
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
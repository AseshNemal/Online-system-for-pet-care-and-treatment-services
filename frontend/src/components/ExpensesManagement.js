import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpensesManagement.css';

const ExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    costPerItem: ''
  });
  const [totalCost, setTotalCost] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    calculateTotalCost(expenses);
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('https://online-system-for-pet-care-and-treatment.onrender.com/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://online-system-for-pet-care-and-treatment.onrender.com/api/expenses', formData);
      setExpenses(prev => [...prev, response.data]);
      setFormData({
        itemName: '',
        quantity: '',
        costPerItem: ''
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const calculateTotalCost = (expenseData) => {
    const total = expenseData.reduce((sum, expense) => sum + expense.totalCost, 0);
    setTotalCost(total);
  };

  const handleUpdate = async (id) => {
    const expenseToUpdate = expenses.find(expense => expense._id === id);
    setFormData({
      itemName: expenseToUpdate.itemName,
      quantity: expenseToUpdate.quantity,
      costPerItem: expenseToUpdate.costPerItem
    });
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL || "https://online-system-for-pet-care-and-treatment.onrender.com";
      await axios.delete(`${backendURL}/api/expenses/${id}`);
      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://online-system-for-pet-care-and-treatment.onrender.com/api/expenses/${expenseToDelete._id}`);
      setExpenses(prev => prev.filter(expense => expense._id !== expenseToDelete._id));
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setExpenseToDelete(null);
  };

  const generateReport = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Create table header
    const tableHeader = `
╔══════════════════╦════════════╦═════════════╦═════════════╗
║ Item Name        ║ Quantity   ║ Cost/Item   ║ Total Cost  ║
╠══════════════════╬════════════╬═════════════╬═════════════╣`;

    // Create table rows
    const tableRows = expenses.map(expense => {
      const itemName = expense.itemName.padEnd(16);
      const quantity = expense.quantity.toString().padEnd(10);
      const costPerItem = `Rs. ${expense.costPerItem}`.padEnd(11);
      const totalCost = `Rs. ${expense.totalCost}`.padEnd(11);
      
      return `
║ ${itemName} ║ ${quantity} ║ ${costPerItem} ║ ${totalCost} ║`;
    }).join('');

    // Create table footer
    const tableFooter = `
╠══════════════════╬════════════╬═════════════╬═════════════╣
║ Total Cost: Rs. ${totalCost.toString().padEnd(7)} ║
╚══════════════════╩════════════╩═════════════╩═════════════╝`;

    const reportContent = `EXPENSES REPORT
Generated on: ${currentDate} at ${currentTime}
════════════════════════════════════════════════════════════════════════════════

${tableHeader}${tableRows}${tableFooter}

SUMMARY:
════════════════════════════════════════════════════════════════════════════════
Total Number of Expenses: ${expenses.length}
Total Cost: Rs. ${totalCost}
════════════════════════════════════════════════════════════════════════════════`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_report_${currentDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="expenses-container">
      <h2>Expenses Management</h2>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Cost per Item:</label>
          <input
            type="number"
            name="costPerItem"
            value={formData.costPerItem}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>

      <div className="expenses-table">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Cost per Item</th>
              <th>Total Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{expense.itemName}</td>
                <td>{expense.quantity}</td>
                <td>Rs. {expense.costPerItem}</td>
                <td>Rs. {expense.totalCost}</td>
                <td>
                  <button onClick={() => handleUpdate(expense._id)}>Update</button>
                  <button onClick={() => handleDeleteClick(expense)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total Cost:</td>
              <td>Rs. {totalCost}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button onClick={generateReport} className="generate-report-btn">
        Generate Report
      </button>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this expense?</p>
            <p><strong>Item:</strong> {expenseToDelete.itemName}</p>
            <p><strong>Quantity:</strong> {expenseToDelete.quantity}</p>
            <p><strong>Cost:</strong> Rs. {expenseToDelete.totalCost}</p>
            <div className="delete-confirm-buttons">
              <button onClick={handleDeleteConfirm} className="confirm-delete">Delete</button>
              <button onClick={handleDeleteCancel} className="cancel-delete">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesManagement; 
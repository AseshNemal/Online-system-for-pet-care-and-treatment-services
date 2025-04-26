import React, { useState, useEffect } from 'react';
import './ExpensesManagement.css';

const ExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    costPerItem: ''
  });
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    calculateTotalCost();
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      ...formData,
      totalCost: formData.quantity * formData.costPerItem
    };
    setExpenses(prev => [...prev, newExpense]);
    setFormData({
      itemName: '',
      quantity: '',
      costPerItem: ''
    });
  };

  const calculateTotalCost = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.totalCost, 0);
    setTotalCost(total);
  };

  const handleUpdate = (id) => {
    const expenseToUpdate = expenses.find(expense => expense.id === id);
    setFormData({
      itemName: expenseToUpdate.itemName,
      quantity: expenseToUpdate.quantity,
      costPerItem: expenseToUpdate.costPerItem
    });
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const generateReport = () => {
    const reportContent = expenses.map(expense => 
      `Item Name: ${expense.itemName}
Quantity: ${expense.quantity}
Cost per Item: $${expense.costPerItem}
Total Cost: $${expense.totalCost}

`
    ).join('') + `\nTotal Expenses: $${totalCost}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses_report.txt';
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
              <tr key={expense.id}>
                <td>{expense.itemName}</td>
                <td>{expense.quantity}</td>
                <td>${expense.costPerItem}</td>
                <td>${expense.totalCost}</td>
                <td>
                  <button onClick={() => handleUpdate(expense.id)}>Update</button>
                  <button onClick={() => handleDelete(expense.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total Cost:</td>
              <td>${totalCost}</td>
              <td></td>
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

export default ExpensesManagement; 
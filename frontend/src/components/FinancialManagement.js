import React from 'react';
import { Link } from 'react-router-dom';
import './FinancialManagement.css';

const FinancialManagement = () => {
  return (
    <div className="financial-management-container">
      <h1>Financial Management</h1>
      <div className="financial-links">
        <Link to="/financial/expenses" className="financial-link">
          Expenses Management
        </Link>
        <Link to="/financial/orders" className="financial-link">
          Order Finance Management
        </Link>
        <Link to="/financial/hr" className="financial-link">
          HR Finance Management
        </Link>
      </div>
    </div>
  );
};

export default FinancialManagement; 
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5 home-container">
      <style>
        {`
          .home-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 50px;
            background-color: #f8f9fa;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          .home-container::before {
            content: "🐾";
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 80px;
            opacity: 0.1;
            transform: rotate(-20deg);
          }

          .home-container::after {
            content: "📊";
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 80px;
            opacity: 0.1;
            transform: rotate(20deg);
          }

          h1 {
            color: #2c3e50;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            margin-bottom: 20px;
          }

          p {
            color: #2c3e50;
            font-size: 18px;
            font-family: 'Roboto', sans-serif;
            margin-bottom: 30px;
          }

          .btn-primary {
            background-color: #17a2b8;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            color: #ffffff;
            transition: background-color 0.3s ease;
            margin: 0 10px;
          }

          .btn-primary:hover {
            background-color: #138496;
          }
        `}
      </style>

      <h1>Welcome to the Pet Care System</h1>
      <p>Manage your pets, employees, and more!</p>
      <div className="mt-4">
        <Link to="/pet/add" className="btn btn-primary">Add a Pet</Link>
        <Link to="/pet/all" className="btn btn-primary">View All Pets</Link>
        <Link to="/pet/user" className="btn btn-primary">View My Pets</Link>
        <Link to="/employee" className="btn btn-primary">Manage Employees</Link>
        <Link to="/dashboard" className="btn btn-primary">View Dashboard</Link>
      </div>
    </div>
  );
}

export default Home;
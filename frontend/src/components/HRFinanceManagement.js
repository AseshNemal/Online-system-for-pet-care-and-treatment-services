import React, { useState, useEffect } from 'react';
import './HRFinanceManagement.css';

const HRFinanceManagement = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // This would typically come from your API
    const mockEmployeeData = [
      { id: 1, name: 'John Doe', role: 'Veterinarian', appointmentsCount: 20 },
      { id: 2, name: 'Jane Smith', role: 'Nurse', appointmentsCount: 15 },
      { id: 3, name: 'Mike Johnson', role: 'Receptionist', appointmentsCount: 10 }
    ];
    setEmployees(mockEmployeeData);
  }, []);

  const calculateSalary = (appointmentsCount) => {
    return appointmentsCount * 4000;
  };

  const calculateEPF8 = (totalSalary) => {
    return (totalSalary * 8) / 100;
  };

  const calculateEPF12 = (totalSalary) => {
    return (totalSalary * 12) / 100;
  };

  const calculateTotalEPF = (epf8, epf12) => {
    return epf8 + epf12;
  };

  const calculateETF = (totalSalary) => {
    return (totalSalary * 3) / 100;
  };

  const calculateMonthlySalary = (totalSalary, totalEPF) => {
    return totalSalary - totalEPF;
  };

  const generateReport = () => {
    const reportContent = employees.map(employee => {
      const totalSalary = calculateSalary(employee.appointmentsCount);
      const epf8 = calculateEPF8(totalSalary);
      const epf12 = calculateEPF12(totalSalary);
      const totalEPF = calculateTotalEPF(epf8, epf12);
      const etf = calculateETF(totalSalary);
      const monthlySalary = calculateMonthlySalary(totalSalary, totalEPF);

      return `Employee ID: ${employee.id}
Name: ${employee.name}
Role: ${employee.role}
Appointments Count: ${employee.appointmentsCount}
Total Salary: $${totalSalary}
EPF (8%): $${epf8}
EPF (12%): $${epf12}
Total EPF: $${totalEPF}
ETF: $${etf}
Monthly Salary: $${monthlySalary}

`;
    }).join('');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hr_finance_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="hr-finance-container">
      <h2>HR Finance Management</h2>
      
      <div className="employee-table">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Appointments Count</th>
              <th>EPF (8%)</th>
              <th>EPF (12%)</th>
              <th>Total EPF</th>
              <th>ETF</th>
              <th>Monthly Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              const totalSalary = calculateSalary(employee.appointmentsCount);
              const epf8 = calculateEPF8(totalSalary);
              const epf12 = calculateEPF12(totalSalary);
              const totalEPF = calculateTotalEPF(epf8, epf12);
              const etf = calculateETF(totalSalary);
              const monthlySalary = calculateMonthlySalary(totalSalary, totalEPF);

              return (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.appointmentsCount}</td>
                  <td>${epf8}</td>
                  <td>${epf12}</td>
                  <td>${totalEPF}</td>
                  <td>${etf}</td>
                  <td>${monthlySalary}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={generateReport} className="generate-report-btn">
        Generate Report
      </button>
    </div>
  );
};

export default HRFinanceManagement; 
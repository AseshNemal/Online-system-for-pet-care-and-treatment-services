import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HRFinanceManagement.css';

const HRFinanceManagement = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/all`);
      const appointments = response.data;
      
      // Group appointments by employee and calculate counts
      const employeeMap = new Map();
      
      appointments.forEach(appointment => {
        const { employeeId, employeeFirstName, employeeRole } = appointment;
        
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            id: employeeId,
            name: employeeFirstName,
            role: employeeRole,
            appointmentsCount: 0
          });
        }
        
        const employee = employeeMap.get(employeeId);
        employee.appointmentsCount++;
      });
      
      setEmployees(Array.from(employeeMap.values()));
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

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
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Create table header
    const tableHeader = `
┌────────────┬────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Name       │ Role       │ Appointments│ Total Salary│ EPF (8%)    │ EPF (12%)   │ Total EPF   │ Monthly Salary│
├────────────┼────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤`;

    // Create table rows
    const tableRows = employees.map(employee => {
      const totalSalary = calculateSalary(employee.appointmentsCount);
      const epf8 = calculateEPF8(totalSalary);
      const epf12 = calculateEPF12(totalSalary);
      const totalEPF = calculateTotalEPF(epf8, epf12);
      const etf = calculateETF(totalSalary);
      const netSalary = calculateMonthlySalary(totalSalary, totalEPF);
      
      return `
│ ${(employee.name || 'N/A').padEnd(10)} │ ${(employee.role || 'N/A').padEnd(10)} │ ${employee.appointmentsCount.toString().padEnd(11)} │ Rs. ${totalSalary.toFixed(2).padEnd(9)} │ Rs. ${epf8.toFixed(2).padEnd(9)} │ Rs. ${epf12.toFixed(2).padEnd(9)} │ Rs. ${totalEPF.toFixed(2).padEnd(9)} │ Rs. ${netSalary.toFixed(2).padEnd(9)} │`;
    }).join('');

    // Create table footer
    const tableFooter = `
└────────────┴────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘`;

    const reportContent = `HR FINANCE REPORT
════════════════════════════════════════════════════════════════════════════════
Generated on: ${currentDate} at ${currentTime}

${tableHeader}${tableRows}${tableFooter}

SUMMARY:
════════════════════════════════════════════════════════════════════════════════
Total Number of Employees: ${employees.length}
════════════════════════════════════════════════════════════════════════════════`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr_finance_report_${currentDate.replace(/\//g, '-')}.txt`;
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
              <th>Name</th>
              <th>Role</th>
              <th>Appointments</th>
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
              const netSalary = calculateMonthlySalary(totalSalary, totalEPF);

              return (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.appointmentsCount}</td>
                  <td>Rs. {epf8.toFixed(2)}</td>
                  <td>Rs. {epf12.toFixed(2)}</td>
                  <td>Rs. {totalEPF.toFixed(2)}</td>
                  <td>Rs. {etf.toFixed(2)}</td>
                  <td>Rs. {netSalary.toFixed(2)}</td>
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
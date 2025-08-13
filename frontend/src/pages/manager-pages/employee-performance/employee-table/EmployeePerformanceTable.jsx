import React from "react";
import TransactionDetails from "./TransactionDetails";
import EmployeeRow from "./EmployeeRow";

export default function EmployeePerformanceTable({
  filteredEmployees,
  setExpandedRow,
  expandedRow,
  transactions,
  selectedDate,
  setTransactions
}) {

  const fetchEmployeeTransactions = async (empId, role) => {
    try {
      const data =
        role === "Delivery"
          ? [
              { time: "10:30 AM", item: "Latte", quantity: 2, customer: "Rahim" },
              { time: "12:15 PM", item: "Espresso", quantity: 1, customer: "Karim" },
              { time: "3:00 PM", item: "Americano", quantity: 4, customer: "Hasan" },
            ]
          : [
              { time: "9:00 AM", item: "Cappuccino", quantity: 3, customer: "Shila" },
              { time: "1:45 PM", item: "Mocha", quantity: 2, customer: "Javed" },
              { time: "4:30 PM", item: "Latte", quantity: 1, customer: "Nadia" },
            ];

      setTransactions((prev) => ({ ...prev, [empId]: data }));
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

   const handleRowClick = (emp) => {
    if (expandedRow === emp.id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(emp.id);
      if (!transactions[emp.id]) {
        fetchEmployeeTransactions(emp.id, emp.role);
      }
    }
  };

  
  return (
    <div className="bg-[#fffaf5] border border-[#e7dcd3] rounded-2xl shadow-lg overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-[#6b4226] text-white">
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Role</th>
            <th className="p-3 text-center">Orders</th>
            <th className="p-3 text-center">Customers</th>
            <th className="p-3 text-center">Total Sales</th>
            <th className="p-3 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, idx) => (
            <React.Fragment key={emp.id}>
              <EmployeeRow
                handleRowClick={handleRowClick}
                emp={emp}
                idx={idx}
                expandedRow={expandedRow}
              />

              <TransactionDetails
                isOpen={expandedRow === emp.id}
                empid={emp.id}
                transactions={transactions}
                selectedDate={selectedDate}
              />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

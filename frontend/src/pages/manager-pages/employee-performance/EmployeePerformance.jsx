import React, { useState, useEffect } from "react";
import {Coffee} from "lucide-react";

import KpiSection from "./Kpi/KpiSection";
import Filters from "./Filters";

import EmployeePerformanceTable from "./employee-table/EmployeePerformanceTable";

export default function EmployeePerformance() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [expandedRow, setExpandedRow] = useState(null);
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, [selectedDate]);

  //================================ data fetching +======================//
  const fetchEmployees = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(true);
      setError(null);

      const data = [
        {
          id: 1,
          name: "Aarav Khan",
          role: "Delivery",
          ordersDelivered: 120,
          customersHandled: 85,
          totalSales: null,
        },
        {
          id: 2,
          name: "Maya Das",
          role: "Cashier",
          ordersHandled: 95,
          customersHandled: 90,
          totalSales: 15000,
        },
        {
          id: 3,
          name: "Rafiul Hasan",
          role: "Delivery",
          ordersDelivered: 110,
          customersHandled: 80,
          totalSales: null,
        },
        {
          id: 4,
          name: "Sadia Ahmed",
          role: "Cashier",
          ordersHandled: 105,
          customersHandled: 98,
          totalSales: 17000,
        },
      ];

      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

//==============================calculation logics ===========================
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totals={
   totalOrders : filteredEmployees.reduce(
    (sum, emp) =>
      sum +
      (emp.role === "Delivery"
        ? emp.ordersDelivered || 0
        : emp.ordersHandled || 0),
    0
  ),
  totalCustomers : filteredEmployees.reduce(
    (sum, emp) => sum + (emp.customersHandled || 0),
    0
  ),
   totalSales : filteredEmployees.reduce(
    (sum, emp) => sum + (emp.totalSales || 0),
    0
  )
  }

//=====================================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold flex items-center text-[#5c4033]">
          <Coffee className="mr-3 text-[#6b4226]" /> Employee Performance
        </h1>

      {/* Filters */}
        <Filters
          roleFilter={roleFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setRoleFilter={setRoleFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">Loading employee perfomance..</span>
        </div>
      )}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* KPI Cards */}
         <KpiSection totals={totals} />

          {/* Table */}
          <EmployeePerformanceTable
            filteredEmployees={filteredEmployees}
            setExpandedRow={setExpandedRow}
            setTransactions={setTransactions}
            expandedRow={expandedRow}
            transactions={transactions}
            selectedDate={selectedDate}
          />
        </>
      )}
    </div>
  );
}



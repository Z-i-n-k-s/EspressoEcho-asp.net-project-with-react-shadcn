import React, { useState, useEffect } from "react";
import {
  Coffee,
  DollarSign,
  Users,
  Bike,
  UserCheck,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const fetchEmployees = async () => {
    try {
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

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalOrders = filteredEmployees.reduce(
    (sum, emp) =>
      sum +
      (emp.role === "Delivery"
        ? emp.ordersDelivered || 0
        : emp.ordersHandled || 0),
    0
  );
  const totalCustomers = filteredEmployees.reduce(
    (sum, emp) => sum + (emp.customersHandled || 0),
    0
  );
  const totalSales = filteredEmployees.reduce(
    (sum, emp) => sum + (emp.totalSales || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold flex items-center text-[#5c4033]">
          <Coffee className="mr-3 text-[#6b4226]" /> Employee Performance
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm"
          >
            <option value="All">All Roles</option>
            <option value="Delivery">Delivery</option>
            <option value="Cashier">Cashier</option>
          </select>

          <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
            <Calendar className="text-gray-500 mr-2" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-white">
            <span className="pl-3 text-gray-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border-none focus:ring-0 focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-[#5c4033]">Loading employee performance...</p>
      )}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard
              icon={<UserCheck />}
              label="Total Orders"
              value={totalOrders}
            />
            <KpiCard
              icon={<Users />}
              label="Total Customers"
              value={totalCustomers}
            />
            <KpiCard
              icon={<DollarSign />}
              label="Total Sales"
              value={`৳ ${totalSales.toLocaleString()}`}
            />
          </div>

          {/* Table */}
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
                    <tr
                      onClick={() => handleRowClick(emp)}
                      className={`cursor-pointer border-b border-[#e7dcd3] hover:bg-[#f5ebe0] transition ${
                        idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                      }`}
                    >
                      <td className="p-3 font-medium text-[#5c4033] text-center">
                        {emp.name}
                      </td>
                      <td className="p-3 flex justify-center gap-2 text-[#7b5e4b]">
                        {emp.role === "Delivery" ? (
                          <Bike className="text-[#6b4226]" size={18} />
                        ) : (
                          <DollarSign className="text-[#6b4226]" size={18} />
                        )}
                        {emp.role}
                      </td>
                      <td className="p-3 text-[#5c4033] text-center">
                        {emp.role === "Delivery"
                          ? emp.ordersDelivered
                          : emp.ordersHandled}
                      </td>
                      <td className="p-3 text-[#5c4033] text-center">
                        {emp.customersHandled}
                      </td>
                      <td className="p-3 text-[#5c4033] text-center">
                        {emp.totalSales
                          ? `৳ ${emp.totalSales.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-3 text-center text-[#6b4226]">
                        {expandedRow === emp.id ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </td>
                    </tr>

                    <AnimatePresence>
                      {expandedRow === emp.id && (
                        <tr className="bg-[#f9f3ef]">
                          <td colSpan="6" className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="p-4">
                                {transactions[emp.id] ? (
                                  <>
                                    <h3 className="font-semibold mb-2 text-[#5c4033]">
                                      Transactions on {selectedDate}
                                    </h3>
                                    <table className="w-full border border-[#e7dcd3] rounded-lg">
                                      <thead>
                                        <tr className="bg-[#e7dcd3] text-[#5c4033]">
                                          <th className="p-2">Time</th>
                                          <th className="p-2">Item</th>
                                          <th className="p-2">Quantity</th>
                                          <th className="p-2">Customer</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {transactions[emp.id].map((t, i) => (
                                          <tr
                                            key={i}
                                            className="text-[#5c4033] text-center"
                                          >
                                            <td className="p-2">{t.time}</td>
                                            <td className="p-2">{t.item}</td>
                                            <td className="p-2">{t.quantity}</td>
                                            <td className="p-2">{t.customer}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </>
                                ) : (
                                  <p>Loading details...</p>
                                )}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ icon, label, value }) {
  return (
    <div className="bg-[#fffaf5] border border-[#e7dcd3] rounded-2xl p-6 shadow-lg flex items-center">
      <div className="bg-[#f5ebe0] p-3 rounded-full mr-4 text-[#6b4226]">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[#7b5e4b]">{label}</h2>
        <p className="text-2xl font-bold text-[#5c4033]">{value}</p>
      </div>
    </div>
  );
}

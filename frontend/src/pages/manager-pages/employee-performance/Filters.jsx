import { Calendar, Search } from "lucide-react";
import React from "react";

export default function Filters({
  roleFilter,
  searchTerm,
  setSearchTerm,
  setRoleFilter,
  selectedDate,
  setSelectedDate,
}) {
  return (
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
        <Calendar
         className="text-gray-500 mr-2" size={18} />
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
  );
}

import { Bike, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import React from "react";

export default function EmployeeRow({ handleRowClick, emp, idx, expandedRow }) {
  
  return (
    <tr
      onClick={() => handleRowClick(emp)}
      className={`cursor-pointer border-b border-[#e7dcd3] hover:bg-[#f5ebe0] transition ${
        idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
      }`}
    >
      <td className="p-3 font-medium text-[#5c4033] text-center">{emp.name}</td>
      <td className="p-3 flex justify-center gap-2 text-[#7b5e4b]">
        {emp.role === "Delivery" ? (
          <Bike className="text-[#6b4226]" size={18} />
        ) : (
          <DollarSign className="text-[#6b4226]" size={18} />
        )}
        {emp.role}
      </td>
      <td className="p-3 text-[#5c4033] text-center">
        {emp.role === "Delivery" ? emp.ordersDelivered : emp.ordersHandled}
      </td>
      <td className="p-3 text-[#5c4033] text-center">{emp.customersHandled}</td>
      <td className="p-3 text-[#5c4033] text-center">
        {emp.totalSales ? `৳ ${emp.totalSales.toLocaleString()}` : "-"}
      </td>
      <td className="p-3 text-center text-[#6b4226]">
        {expandedRow === emp.id ? <ChevronUp /> : <ChevronDown />}
      </td>
    </tr>
  );
}

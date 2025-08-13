import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function InventoryChart({
  filteredInventory,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="bg-[#fff8f1] p-5 rounded-xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#5c4033]">
          📊 Inventory Quantity Overview
        </h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="All">All Categories</option>
          <option value="Coffees">Coffees</option>
          <option value="Desserts">Desserts</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredInventory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="item" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="tan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

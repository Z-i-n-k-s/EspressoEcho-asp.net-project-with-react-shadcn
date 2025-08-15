import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function ProductChart({
  currentBranchName,
  selectedCategory,
  setSelectedCategory,
  filteredInventory,
  branchCategories,
  currentInventory
}) {


    // Category options for the filter dropdown (for selected branch)
      const categoryOptions = useMemo(() => {
        const base = branchCategories.map((c) => c.name);
        // also include any categories present in inventory (handles orphaned values)
        currentInventory.forEach((i) => {
          if (i.category && !base.includes(i.category)) base.push(i.category);
        });
        return ["All", ...Array.from(new Set(base))];
      }, [branchCategories, currentInventory]);

  return (
    <div className="bg-[#fff8f1] p-5 rounded-xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#5c4033]">
          📊 Inventory Quantity Overview ({currentBranchName})
        </h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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

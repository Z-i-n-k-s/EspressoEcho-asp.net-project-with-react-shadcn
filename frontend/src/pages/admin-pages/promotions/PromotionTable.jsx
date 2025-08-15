import React from "react";

export default function PromotionTable({
  promotions,
  branchFilter,
  setBranchFilter,

}) {

const filteredPromotions =
    branchFilter === "all"
      ? promotions
      : promotions.filter((promo) => promo.branch === branchFilter);

  const branches = ["all", ...new Set(promotions.map((p) => p.branch))];
    
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-[#5c4033]">
          📋 Promotions List
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-[#5c4033] font-medium text-sm">Branch:</label>
          <select
            className="p-2 rounded-lg border border-[#e7dcd3] text-sm"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            {branches.map((branch, i) => (
              <option key={i} value={branch}>
                {branch === "all" ? "All" : branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[#5c4033] border-b border-[#e7dcd3]">
            <th className="p-2">Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Value</th>
            <th className="p-2">Branch</th>
            <th className="p-2">Valid</th>
            <th className="p-2">Uses</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredPromotions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-[#7b5e4b] p-4">
                No promotions for this branch.
              </td>
            </tr>
          ) : (
            filteredPromotions.map((promo, i) => (
              <tr key={i} className="border-b border-[#e7dcd3] text-[#7b5e4b]">
                <td className="p-2">{promo.code}</td>
                <td className="p-2">{promo.type}</td>
                <td className="p-2">
                  {promo.value}
                  {promo.type === "percentage" ? "%" : "$"}
                </td>
                <td className="p-2">{promo.branch}</td>
                <td className="p-2">
                  {promo.start} → {promo.end}
                </td>
                <td className="p-2">{promo.uses}</td>
                <td className="p-2">{promo.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";

export default function KpiCard({ icon, label, value }) {
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

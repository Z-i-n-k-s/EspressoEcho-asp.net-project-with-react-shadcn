import React, { useEffect, useState } from 'react'

export const BranchTable = () => {

    const [branches, setBranches] = useState([]);
    useEffect(() => {
      fetchBranches();
    }, []);
    // Fetch Branch Data
const fetchBranches = async () => {
  try {
    // const res = await fetch("/api/branches");
    // const data = await res.json();
    const data = [
      {
        name: "Central Coffee Hub",
        location: "Downtown",
        employees: 12,
        sales: "$42,000",
        promo: "Yes",
      },
      {
        name: "Bean Haven",
        location: "Uptown",
        employees: 8,
        sales: "$31,500",
        promo: "No",
      },
      {
        name: "Latte Lounge",
        location: "Westside",
        employees: 7,
        sales: "$27,800",
        promo: "Yes",
      },
      {
        name: "Mocha Magic",
        location: "East End",
        employees: 10,
        sales: "$36,200",
        promo: "No",
      },
    ];
    setBranches(data);
  } catch (error) {
    console.error("Error fetching branches:", error);
  }
};
  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
            <h2 className="text-lg font-semibold text-[#5c4033] mb-4">
              🏢 Branch Overview
            </h2>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#6b4226] text-white">
                    <th className="py-3 px-4">Branch Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Employees</th>
                    <th className="py-3 px-4">Sales</th>
                    <th className="py-3 px-4">Promotion</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                        idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-[#fff8f1]"
                      }`}
                    >
                      <td className="py-3 px-4">{branch.name}</td>
                      <td className="py-3 px-4">{branch.location}</td>
                      <td className="py-3 px-4">{branch.employees}</td>
                      <td className="py-3 px-4">{branch.sales}</td>
                      <td className="py-3 px-4">{branch.promo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  )
}

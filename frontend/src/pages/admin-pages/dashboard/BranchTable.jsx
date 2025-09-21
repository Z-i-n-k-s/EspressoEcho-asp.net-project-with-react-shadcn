
import adminDashboardApi from '@/api/Admin_dashboard_api';
import React, { useEffect, useState } from 'react';


export const BranchTable = () => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const branchList = await adminDashboardApi.getBranches();
      setBranches(branchList || []);
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
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Manager</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, idx) => (
              <tr
                key={branch.id}
                className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                  idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-[#fff8f1]"
                }`}
              >
                <td className="py-3 px-4">{branch.name}</td>
                <td className="py-3 px-4">{branch.address}</td>
                <td className="py-3 px-4">{branch.contact_phone}</td>
                <td className="py-3 px-4">{branch.manager?.full_name || "-"}</td>
                <td className="py-3 px-4">{branch.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { Edit, Trash2, UserPlus } from "lucide-react";
import React from "react";

export default function BranchTable({
  branches,
  setBranches,
  setEditingId,
  setFormData,
}) {
  //edit handler
  const handleEdit = (branch) => {
    setEditingId(branch.id);
    setFormData(branch);
  };
  //delete handler
  const handleDelete = (id) => {
    setBranches(branches.filter((b) => b.id !== id));
  };

  // time formatter
  const formatTime = (time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 to 12
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const statusColor = {
    Active: "text-green-700 bg-green-100",
    Inactive: "text-yellow-700 bg-yellow-100",
    Closed: "text-red-700 bg-red-100",
  };
  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4">
        📋 Branch List
      </h2>
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#6b4226] text-white">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Opening</th>
              <th className="py-3 px-4">Closing</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Manager</th>
              <th className="py-3 px-4">Actions</th>
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
                <td className="py-3 px-4">{branch.contact}</td>
                <td className="py-3 px-4">{branch.email}</td>
                <td className="py-3 px-4">{formatTime(branch.opening)}</td>
                <td className="py-3 px-4">{formatTime(branch.closing)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColor[branch.status]
                    }`}
                  >
                    {branch.status}
                  </span>
                </td>
                <td className="py-3 px-4">{branch.manager}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>

                  <button
                    onClick={() =>
                      alert(`Assigning manager for ${branch.name}`)
                    }
                    className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full"
                    title="Assign Manager"
                  >
                    <UserPlus size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan="9" className="py-3 text-center text-[#7b5e4b]">
                  No branches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

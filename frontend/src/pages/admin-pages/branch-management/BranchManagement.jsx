import React, { useState } from "react";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";

const BranchManagement = () => {
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Central Coffee Hub",
      address: "123 Main St, Downtown",
      contact: "0123456789",
      manager: "John Doe",
    },
    {
      id: 2,
      name: "Bean Haven",
      address: "45 Uptown Ave",
      contact: "0198765432",
      manager: "Jane Smith",
    },
  ]);

  const [formData, setFormData] = useState({ name: "", address: "", contact: "", manager: "" });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBranches(
        branches.map((b) => (b.id === editingId ? { ...b, ...formData } : b))
      );
      setEditingId(null);
    } else {
      setBranches([
        ...branches,
        { id: Date.now(), ...formData },
      ]);
    }
    setFormData({ name: "", address: "", contact: "", manager: "" });
  };

  const handleEdit = (branch) => {
    setEditingId(branch.id);
    setFormData(branch);
  };

  const handleDelete = (id) => {
    setBranches(branches.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-3xl font-extrabold text-[#5c4033]">🏢 Branch Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Branch Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Manager Name"
            value={formData.manager}
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#6b4226] hover:bg-[#5c3620] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {editingId ? <Edit size={16} /> : <Plus size={16} />}
          {editingId ? "Update Branch" : "Add Branch"}
        </button>
      </form>

      {/* Branch List Table */}
      <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
        <h2 className="text-lg font-semibold text-[#5c4033] mb-4">📋 Branch List</h2>
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b4226] text-white">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch,idx) => (
                <tr
                  key={branch.id}
                  className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                  idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-[#fff8f1]"
                }`}
                >
                  <td className="py-3 px-4">{branch.name}</td>
                  <td className="py-3 px-4">{branch.address}</td>
                  <td className="py-3 px-4">{branch.contact}</td>
                  <td className="py-3 px-4">{branch.manager}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <button
                      onClick={() => alert(`Assigning manager for ${branch.name}`)}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      <UserPlus size={16} /> Assign Manager
                    </button>
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-3 text-center text-[#7b5e4b]">
                    No branches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchManagement;

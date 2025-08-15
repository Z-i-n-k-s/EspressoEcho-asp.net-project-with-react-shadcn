import { Edit, Plus } from "lucide-react";
import React from "react";

export default function BranchForm({
  formData,
  setFormData,
  editingId,
  setBranches,
  setEditingId,
  branches,
}) {
  //add or update button handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBranches(
        branches.map((b) => (b.id === editingId ? { ...b, ...formData } : b))
      );
      setEditingId(null);
    } else {
      setBranches([...branches, { id: Date.now(), ...formData }]);
    }
    setFormData({
      name: "",
      address: "",
      contact: "",
      email: "",
      opening: "",
      closing: "",
      status: "Active",
      manager: "",
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#fff8f1] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Branch Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
          required
        />
        <input
          type="number"
          placeholder="Contact"
          value={formData.contact}
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
          className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
          required
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 pl-2">
            Opening Hour
          </label>
          <input
            type="time"
            placeholder="Opening Hour"
            value={formData.opening}
            onChange={(e) =>
              setFormData({ ...formData, opening: e.target.value })
            }
            className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 pl-2">
            Closing Hour
          </label>
          <input
            type="time"
            placeholder="Closing Hour"
            value={formData.closing}
            onChange={(e) =>
              setFormData({ ...formData, closing: e.target.value })
            }
            className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
            required
          />
        </div>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
          required
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Closed</option>
        </select>
        <input
          type="text"
          placeholder="Manager Name"
          value={formData.manager}
          onChange={(e) =>
            setFormData({ ...formData, manager: e.target.value })
          }
          className="p-2 border border-[#e7dcd3] rounded-lg focus:outline-none focus:border-[#6b4226] focus:ring-2 focus:ring-[#d4a373]"
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
  );
}

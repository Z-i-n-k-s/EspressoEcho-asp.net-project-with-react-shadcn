import React, { useEffect, useState } from "react";
import { Tag, Edit3, Trash2 } from "lucide-react";
import categoryApi from "@/api/Catergory_api";
import branchApi from "@/api/Branch_api";
import { useSelector } from "react-redux";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [assigningCategory, setAssigningCategory] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]);
   const user = useSelector((state) => state.user.user);
  

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      const cats = Array.isArray(res.data) ? res.data : [];
      setCategories(cats);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      const res = await categoryApi.createCategory({
        name,
        description: newCategoryDesc,
      });
      setCategories(prev => [...prev, res.data]);
      setNewCategoryName("");
      setNewCategoryDesc("");
    } catch (err) {
      console.error(err);
      alert("Failed to create category.");
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name || !editingId) return;
    try {
      const res = await categoryApi.updateCategory(editingId, {
        name,
        description: newCategoryDesc,
      });
      setCategories(prev => prev.map(c => (c.id === editingId ? res.data : c)));
      setEditingId(null);
      setNewCategoryName("");
      setNewCategoryDesc("");
    } catch (err) {
      console.error(err);
      alert("Failed to update category.");
    }
  };

  // Delete category
  const handleDeleteCategory = async catId => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryApi.deleteCategory(catId);
      setCategories(prev => prev.filter(c => c.id !== catId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  // Start editing
  const startEdit = cat => {
    setEditingId(cat.id);
    setNewCategoryName(cat.name);
    setNewCategoryDesc(cat.description);
  };

  // Toggle branch selection
  const toggleBranch = branchId => {
    setSelectedBranches(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  // Open assign branches modal
  const openAssignBranches = async cat => {
    try {
      const res = await branchApi.getAllBranches();
      const allBranches = Array.isArray(res.data) ? res.data : [];
      setBranches(allBranches);
      setAssigningCategory(cat);

      // Map existing branch assignments to IDs
      const assignedBranchIds = cat.branches
        ? cat.branches.map(b => (typeof b === "string" ? b : b.id))
        : [];
      setSelectedBranches(assignedBranchIds);
    } catch (err) {
      console.error(err);
      alert("Failed to load branches");
    }
  };

  // Save branch assignments
  const handleAssignBranches = async () => {
    if (!assigningCategory) return;
    try {
      const payload = {
        branch_ids: selectedBranches,
        assigned_by:  user.id,
        action: "assign",
      };

      const updated = await categoryApi.manageBranchAssignment(assigningCategory.id, payload);

      setCategories(prev =>
        prev.map(cat =>
          cat.id === assigningCategory.id
            ? { ...cat, branches: updated.branches || selectedBranches }
            : cat
        )
      );
      setAssigningCategory(null);
      setSelectedBranches([]);
    } catch (err) {
      console.error("assign branches error:", err);
      alert("Failed to assign branches.");
    }
  };

  // Helper to check if branch is already assigned
  const isBranchAssigned = branchId => {
    if (!assigningCategory?.branches) return false;
    const assignedIds = assigningCategory.branches.map(b => (typeof b === "string" ? b : b.id));
    return assignedIds.includes(branchId);
  };

  return (
    <div className="bg-[#fff8f1] p-5 rounded-2xl shadow-md border border-[#e7dcd3] mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#5c4033] flex items-center gap-2">
          <Tag className="text-[#6b4226]" /> Category Management
        </h2>
      </div>

      {/* Add / Edit Category */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <input
          type="text"
          placeholder="Category Description"
          value={newCategoryDesc}
          onChange={e => setNewCategoryDesc(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <button
          onClick={editingId ? handleUpdateCategory : handleAddCategory}
          className={`px-4 py-2 ${
            editingId
              ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-800"
              : "bg-green-200 hover:bg-green-300 text-green-800"
          } rounded-lg shadow`}
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewCategoryName("");
              setNewCategoryDesc("");
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Category Table */}
      {categories.length === 0 ? (
        <p className="text-gray-600 italic">No categories yet.</p>
      ) : (
        <table className="w-full border rounded-lg bg-white shadow">
          <thead>
            <tr className="bg-[#f3eae3] text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border">{cat.description}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 rounded-lg"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    onClick={() => openAssignBranches(cat)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-lg"
                  >
                    Assign Branches
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Assign Branches Modal */}
      {assigningCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Assign branches to{" "}
              <span className="text-[#6b4226]">{assigningCategory.name}</span>
            </h3>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {branches.length > 0 ? (
                branches.map(b => {
                  const alreadyAssigned = isBranchAssigned(b.id);
                  return (
                    <label
                      key={b.id}
                      className={`flex items-center gap-2 ${
                        alreadyAssigned ? "text-gray-400 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={alreadyAssigned}
                        checked={alreadyAssigned || selectedBranches.includes(b.id)}
                        onChange={() => toggleBranch(b.id)}
                        className={`form-checkbox h-4 w-4 ${
                          alreadyAssigned ? "bg-gray-300 border-gray-400" : ""
                        }`}
                      />
                      <span>
                        {b.name}{" "}
                        {alreadyAssigned && (
                          <span className="text-sm text-gray-600">(Already assigned)</span>
                        )}
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="text-gray-500">No branches available.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setAssigningCategory(null);
                  setSelectedBranches([]);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignBranches}
                className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded-lg text-green-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

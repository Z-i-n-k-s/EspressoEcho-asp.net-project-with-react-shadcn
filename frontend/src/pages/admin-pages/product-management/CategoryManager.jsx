import { Tag } from "lucide-react";
import React from "react";

export default function CategoryManager({
  currentBranchName,
  newCategoryName,
  setNewCategoryName,
  branchCategories,
  upsertBranchCategories,
  currentInventory,
}) {
  return (
    <div className="bg-[#fff8f1] p-5 rounded-2xl shadow-md border border-[#e7dcd3] mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#5c4033] flex items-center gap-2">
          <Tag className="text-[#6b4226]" /> Categories for {currentBranchName}
        </h2>
      </div>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <button
          onClick={() => {
            const name = newCategoryName.trim();
            if (!name) return;
            const exists = branchCategories.some(
              (c) => c.name.toLowerCase() === name.toLowerCase()
            );
            if (exists) {
              alert("Category already exists for this branch");
              return;
            }
            upsertBranchCategories((prev) => [
              ...prev,
              { id: Date.now(), name },
            ]);
            setNewCategoryName("");
          }}
          className="px-4 py-2 bg-green-200 hover:bg-green-300 text-green-800 rounded-lg shadow"
        >
          Add Category
        </button>
      </div>

      {/* Category List */}
      {branchCategories.length === 0 ? (
        <p className="text-gray-600 italic">
          No categories yet for this branch.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {branchCategories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between items-center p-2 bg-white rounded-lg shadow border"
            >
              <span>{cat.name}</span>
              <button
                onClick={() => {
                  const inUse = currentInventory.some(
                    (i) => i.category === cat.name
                  );
                  if (inUse) {
                    alert(
                      `Cannot delete "${cat.name}" because products are using it.`
                    );
                    return;
                  }
                  upsertBranchCategories((prev) =>
                    prev.filter((c) => c.id !== cat.id)
                  );
                }}
                className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-700 rounded-lg"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

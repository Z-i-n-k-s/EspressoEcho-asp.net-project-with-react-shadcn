import { PackagePlus, Search } from 'lucide-react';
import React from 'react';

export default function InventoryActions({
  inventory,
  setShowDialog,
  searchTerm,
  setSearchTerm,
}) {
  

  // ---------------- CSV EXPORT ----------------
  const handleDownloadCSV = () => {
    if (inventory.length === 0) return;

    // Updated headers to match table
    const headers = [
      "Item",
      "Category",
      "Quantity On Hand",
      "Reorder Level",
      "Price",
      "Status",
    ];

    const csvContent =
      headers.join(",") +
      "\n" +
      inventory
        .map((inv) => {
          const status =
            inv.quantity <= inv.reorderLevel ? "Low Stock" : "OK";
          return [
            inv.item,
            inv.category,
            inv.quantity,
            inv.reorderLevel,
            inv.basePrice,
            status,
          ].join(",");
        })
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      {/* Left Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 bg-blue-200 hover:bg-blue-300 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow"
        >
          <PackagePlus size={18} /> Add New Item
        </button>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 bg-green-200 hover:bg-green-300 text-green-800 px-4 py-2 rounded-lg font-semibold shadow"
        >
          📥 Download CSV
        </button>
      </div>

      {/* Right Search Bar */}
      <div className="w-full sm:w-auto max-w-xl">
        <div className="flex items-center w-full border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 font-[Inter]">
          <span className="pl-3 text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by item or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 font-sans bg-transparent placeholder:text-gray-500 placeholder:font-[Inter]"
          />
        </div>
      </div>
    </div>
  );
}

import { Clock, PackagePlus, Search } from 'lucide-react';
import React, { useRef } from 'react'

export default function InventoryActions({ inventory, setInventory,setShowDialog, searchTerm ,setIsAddMode, setSearchTerm,setCurrentItem }) {
      const csvInputRef = useRef(null);

    const openAddDialog = () => {
    setCurrentItem({
      id: Date.now(),
      item: "",
      category: "Coffees",
      quantity: 0,
      reorderLevel: 0,
      basePrice: 0,
      expiryDate: "",
    });
    setIsAddMode(true);
    setShowDialog(true);
  };
    const discardExpired = () => {
    const today = new Date();
    setInventory(prev => prev.filter(inv => new Date(inv.expiryDate) >= today));
  
  };

      // ---------------- CSV IMPORT ----------------
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").filter((row) => row.trim() !== "");
      const headers = rows[0].split(",").map((h) => h.trim());

      const newItems = rows.slice(1).map((row) => {
        const values = row.split(",").map((v) => v.trim());
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });

        return {
          id: Date.now() + Math.random(),
          item: obj.item || "",
          category: obj.category || "Coffees",
          quantity: Number(obj.quantity) || 0,
          reorderLevel: Number(obj.reorderLevel) || 0,
          basePrice: Number(obj.basePrice) || 0,
          expiryDate: obj.expiryDate || "",
          description: obj.description || "",
        };
      });

      setInventory((prev) => [...prev, ...newItems]);
    };

    reader.readAsText(file);
    e.target.value = null;
  };

  // ---------------- CSV EXPORT ----------------
  const handleDownloadCSV = () => {
    if (inventory.length === 0) return;

    const headers = [
      "item",
      "category",
      "quantity",
      "reorderLevel",
      "basePrice",
      "expiryDate",
      "description",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      inventory
        .map((inv) =>
          [
            inv.item,
            inv.category,
            inv.quantity,
            inv.reorderLevel,
            inv.basePrice,
            inv.expiryDate,
            inv.description || "",
          ].join(",")
        )
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
      onClick={discardExpired}
      className="flex items-center gap-2 bg-red-200 hover:bg-red-300 text-red-800 px-5 py-3 rounded-lg font-semibold shadow"
    >
      <Clock size={18} /> Discard Expired Items
    </button>
    <button
      onClick={openAddDialog}
      className="flex items-center gap-2 bg-blue-200 hover:bg-blue-300 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow"
    >
      <PackagePlus size={18} /> Add New Item
    </button>

    <input
      type="file"
      accept=".csv"
      ref={csvInputRef}
      onChange={handleImportCSV}
      className="hidden"
    />
    <button
      onClick={() => csvInputRef.current.click()}
      className="flex items-center gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-4 py-2 rounded-lg font-semibold shadow"
    >
      📤 Import CSV
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

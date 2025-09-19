import React from "react";
import { PackagePlus, Search } from "lucide-react";

export default function ProductActions({
  searchTerm,
  setSearchTerm,
  currentInventory,
  setCurrentItem,
  setIsAddMode,
  setShowDialog,
  filteredInventory,
}) {


  // Open Add Dialog
  const openAddDialog = () => {
    setCurrentItem({
      id: Date.now(),
      name: "",
      category: "",
      base_price: 0,
      description: "",
      image_url: null,
      imageFile: null,
    });
    setIsAddMode(true);
    setShowDialog(true);
  };

  // CSV Download
  const handleDownloadCSV = () => {
    const dataToDownload = filteredInventory?.length
      ? filteredInventory
      : currentInventory;

    if (!dataToDownload || dataToDownload.length === 0) {
      alert("No inventory data to download.");
      return;
    }

    const headers = ["name", "category", "base_price", "description", "image_url"];
    const csvRows = [
      headers.join(","),
      ...dataToDownload.map((item) =>
        [
          item.name || "",
          item.category?.name || "",
          item.base_price || 0,
          item.description || "",
          item.image_url || "",
        ]
          .map((v) => `"${v.toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Product.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={openAddDialog}
          className="flex items-center gap-2 bg-blue-200 hover:bg-blue-300 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow"
        >
          <PackagePlus size={18} /> Add Product
        </button>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 bg-green-200 hover:bg-green-300 text-green-800 px-4 py-2 rounded-lg font-semibold shadow"
        >
          📥 Download CSV
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center w-full sm:w-auto max-w-xl">
        <div className="flex items-center w-full border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 font-[Inter] flex-1">
          <span className="pl-3 text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by item, category, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 bg-transparent placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}

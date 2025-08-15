import { Clock, PackagePlus, Search } from "lucide-react";
import React, { useRef } from "react";

export default function ProductActions({
  selectedBranch,
  searchTerm,
  setSearchTerm,
  setCurrentInventory,
  upsertBranchCategories,
  currentInventory,
  setCurrentItem,
  branchCategories,
  setIsAddMode,
  setShowDialog,
  isExpired
}) {
  const csvInputRef = useRef(null);

const openAddDialog = () => {
    setCurrentItem({
      id: Date.now(),
      item: "",
      category: branchCategories[0]?.name || "",
      quantity: 0,
      reorderLevel: 0,
      basePrice: 0,
      expiryDate: "",
      description: "",
      image: null,
      imageFile: null,
    });
    setIsAddMode(true);
    setShowDialog(true);
  };

  const discardExpired = () => {
    if (!selectedBranch) return;
    setCurrentInventory((prev) =>
      prev.filter((inv) => !isExpired(inv.expiryDate))
    );
  };

  

  // ---------- CSV Import/Export (Selected Branch Only) ----------
  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBranch) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const rows = text.split(/\r?\n/).filter((row) => row.trim() !== "");
      if (rows.length === 0) return;
      const headers = rows[0].split(",").map((h) => h.trim());

      const newItems = rows.slice(1).map((row) => {
        const values = row.split(",").map((v) => v.trim());
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });

        const qty = Number(obj.quantity) || 0;
        const rl = Number(obj.reorderLevel) || 0;
        const bp = Number(obj.basePrice) || 0;

        const categoryName = obj.category || "";

        return {
          id: Date.now() + Math.random(),
          item: obj.item || "",
          category: categoryName,
          quantity: Math.max(0, Math.floor(qty)),
          reorderLevel: Math.max(0, Math.floor(rl)),
          basePrice: Math.max(0, bp),
          expiryDate: obj.expiryDate || "",
          description: obj.description || "",
        };
      });

      // Ensure categories exist
      const importedCategories = Array.from(
        new Set(newItems.map((n) => n.category).filter(Boolean))
      );
      upsertBranchCategories((prev) => {
        const existing = new Set(prev.map((c) => c.name));
        const toAdd = importedCategories
          .filter((c) => !existing.has(c))
          .map((name) => ({ id: Date.now() + Math.random(), name }));
        return [...prev, ...toAdd];
      });

      setCurrentInventory((prev) => [...prev, ...newItems]);
    };

    reader.readAsText(file);
    e.target.value = null;
  };


  //====================== CSV export========================
  const handleDownloadCSV = () => {
    if (!selectedBranch) return;
    const inv = currentInventory;
    if (inv.length === 0) return;

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
      inv
        .map((i) =>
          [
            i.item,
            i.category,
            i.quantity,
            i.reorderLevel,
            i.basePrice,
            i.expiryDate,
            i.description || "",
          ]
            .map((v) => `${v}`.replaceAll(",", " ")) // simple comma guard
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inventory-branch-${selectedBranch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
//=====================================

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
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
          onClick={() => csvInputRef.current?.click()}
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

      {/* Search */}
      <div className="w-full sm:w-auto max-w-xl">
        <div className="flex items-center w-full border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 font-[Inter]">
          <span className="pl-3 text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by item, category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 font-sans bg-transparent placeholder:text-gray-500 placeholder:font-[Inter]"
          />
        </div>
      </div>
    </div>
  );
}

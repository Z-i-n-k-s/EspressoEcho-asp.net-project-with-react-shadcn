import { Edit3, MinusCircle, Package, PlusCircle, Trash2 } from "lucide-react";
import React from "react";

export default function ProductTable({
  currentBranchName,
  loading,
  currentInventory,
  filteredInventory,
  isExpired,
  setCurrentItem,
  setIsAddMode,
  setShowDialog,
  selectedBranch,
  setCurrentInventory,
}) {
  const openEditDialog = (item) => {
    setCurrentItem({ ...item });
    setIsAddMode(false);
    setShowDialog(true);
  };

  const discardItem = (id) => {
    if (!selectedBranch) return;
    setCurrentInventory((prev) => prev.filter((inv) => inv.id !== id));
  };

  const updateStock = (id, type) => {
      if (!selectedBranch) return;
      setCurrentInventory((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                quantity:
                  type === "receive"
                    ? inv.quantity + 1
                    : type === "discard"
                    ? Math.max(0, inv.quantity - 1)
                    : inv.quantity,
              }
            : inv
        )
      );
    };
  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <Package className="text-[#6b4226]" /> {currentBranchName} Inventory
      </h2>
      {loading ? (
        <p className="text-center text-[#5c4033] italic">
          Loading inventory...
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b4226] text-white">
                <th className="p-3 text-center">Item</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Quantity On Hand</th>
                <th className="p-3 text-center">Reorder Level</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Expiry Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center text-[#5c4033] italic"
                  >
                    No inventory data for this branch
                  </td>
                </tr>
              ) : (
                filteredInventory.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                      idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-medium text-center relative group">
                      <span>{inv.item}</span>
                      {inv.description && (
                        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-max max-w-xs px-3 py-2 bg-[#5c4033] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                          {inv.description}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">{inv.category}</td>
                    <td className="p-3 text-center">{inv.quantity}</td>
                    <td className="p-3 text-center">{inv.reorderLevel}</td>
                    <td className="p-3 text-center">{inv.basePrice}</td>
                    <td className="p-3 text-center">{inv.expiryDate}</td>
                    <td className="p-3 text-center">
                      {isExpired(inv.expiryDate) ? (
                        <span className="text-red-700 font-semibold">
                          Expired
                        </span>
                      ) : inv.quantity <= inv.reorderLevel ? (
                        <span className="text-red-600 font-semibold">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">OK</span>
                      )}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => updateStock(inv.id, "receive")}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full"
                      >
                        <PlusCircle size={18} />
                      </button>
                      <button
                        onClick={() => updateStock(inv.id, "discard")}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                      >
                        <MinusCircle size={18} />
                      </button>
                      <button
                        onClick={() => openEditDialog(inv)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-full"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => discardItem(inv.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

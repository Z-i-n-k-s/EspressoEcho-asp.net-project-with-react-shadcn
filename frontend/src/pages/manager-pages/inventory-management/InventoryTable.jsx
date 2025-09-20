import { MinusCircle, PlusCircle } from "lucide-react";

export default function InventoryTable({
  loading,
  filteredInventory,
  adjustInventory 
}) {
  const updateStock = (id, action) => {
    adjustInventory(id, action);
  };

  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        Branch Inventory
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">Loading inventory...</span>
        </div>
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
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-[#5c4033] italic">
                    No inventory data
                  </td>
                </tr>
              ) : (
                filteredInventory.map((inv, idx) => {
                  const isLowStock = inv.quantity <= inv.reorderLevel;
                  return (
                    <tr
                      key={inv.id}
                      className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                        idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                      }`}
                    >
                      <td className="p-3 font-medium text-center">{inv.item}</td>
                      <td className="p-3 text-center">{inv.category}</td>
                      <td className="p-3 text-center">{inv.quantity}</td>
                      <td className="p-3 text-center">{inv.reorderLevel}</td>
                      <td className="p-3 text-center">৳{inv.basePrice}</td>
                      <td className={`p-3 text-center font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}>
                        {isLowStock ? "Low Stock" : "OK"}
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => updateStock(inv.id, "add")}
                          className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full"
                        >
                          <PlusCircle size={16} />
                        </button>
                        <button
                          onClick={() => updateStock(inv.id, "remove")}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                        >
                          <MinusCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

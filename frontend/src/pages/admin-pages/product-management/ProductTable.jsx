import { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import productApi from "@/api/Product_api";

export default function ProductTable({
  selectedBranch,
  setCurrentItem,
  setIsAddMode,
  setShowDialog,
  filteredInventory,
}) {
  const [loading, setLoading] = useState(true);
  const [, setInventory] = useState([]);

  // Fetch products from backend
  const fetchInventory = async () => {
    
    setLoading(true);
    try {
      const res = await productApi.getAllProducts();
      
      const products = Array.isArray(res.data) ? res.data : [];
      
      setInventory(products);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Delete product
  const deleteItem = async (id) => {
    if (!selectedBranch) return;
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await productApi.deleteProduct(id);
       window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const openEditDialog = (item) => {
    setCurrentItem({ ...item });
    setIsAddMode(false);
    setShowDialog(true);
  };

  return (
    <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
         Inventory
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
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
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
                    <td className="p-3 text-center font-medium">{inv.name}</td>
                    <td className="p-3 text-center">
                      {inv.category?.name || "-"}
                    </td>
                    <td className="p-3 text-center">{inv.base_price}</td>
                    <td className="p-3 text-center">
                      {inv.description || "-"}
                    </td>
                  
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => openEditDialog(inv)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-full"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteItem(inv.id)}
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

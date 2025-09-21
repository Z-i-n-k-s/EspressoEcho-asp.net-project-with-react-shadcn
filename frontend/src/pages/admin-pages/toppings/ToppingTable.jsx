import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import toppingApi from "@/api/Toppings_api";

export default function ToppingTable({
  toppings,
  setFormData,
  setEditingId,
  setToppings,
  products,
}) {
  const user = useSelector((state) => state.user.user);
  const employeeId = user?.id;

  const [activeTopping, setActiveTopping] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ensure we always have arrays
  const safeToppings = Array.isArray(toppings) ? toppings : [];
  const safeProducts = Array.isArray(products) ? products : [];

  // Get assigned product IDs from topping data
  const getAssignedProductIds = (topping) => {
    if (!topping || !topping.products) return [];
    return topping.products.map(p => p.id || p.product_id);
  };

  // Open assign modal
  const openAssignModal = (topping) => {
    setActiveTopping(topping);
    // Initialize selected products with currently assigned ones
    const assignedIds = getAssignedProductIds(topping);
    setSelectedProducts(assignedIds);
  };

  // Toggle product selection
  const toggleProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Save assignments
  const handleSaveAssignments = async () => {
    if (!activeTopping) return;
    
    setLoading(true);
    try {
      // Get current assignments
      const currentAssigned = getAssignedProductIds(activeTopping);
      
      // Determine what to add and remove
      const toAdd = selectedProducts.filter(id => !currentAssigned.includes(id));
      const toRemove = currentAssigned.filter(id => !selectedProducts.includes(id));
      
      // Process additions
      for (const productId of toAdd) {
        await toppingApi.assignToProduct(activeTopping.id, productId, false, employeeId);
      }
      
      // Process removals
      for (const productId of toRemove) {
        await toppingApi.removeFromProduct(activeTopping.id, productId);
      }
      
      // Refresh toppings data
      const updatedToppings = await toppingApi.getAllToppings();
      if (setToppings && typeof setToppings === 'function') {
        setToppings(updatedToppings);
      }
      
      setActiveTopping(null);
      setSelectedProducts([]);
      alert("Assignments updated successfully!");
    } catch (err) {
      console.error("Assignment error:", err);
      alert("Failed to update assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toppingId) => {
    if (!window.confirm("Are you sure you want to delete this topping?")) return;
    try {
      await toppingApi.deleteTopping(toppingId);
      if (setToppings && typeof setToppings === 'function') {
        setToppings?.((prev) => (Array.isArray(prev) ? prev.filter((t) => t.id !== toppingId) : []));
      }
      alert("Topping deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete topping");
    }
  };

  // Check if a product is assigned to the active topping
  const isProductAssigned = (productId) => {
    return selectedProducts.includes(productId);
  };

  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4">
        🍩 Toppings List
      </h2>

      {safeToppings.length === 0 ? (
        <p>No toppings available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f5e6d3] text-[#5c4033]">
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeToppings.map((t) => (
              <tr key={t.id} className="border-b border-[#e7dcd3]">
                <td className="p-3 ">{t.name}</td>
                <td className="p-3 text-center">{t.price}</td>
                <td className="p-3 text-center">
                  {t.is_active ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      if (setFormData && typeof setFormData === 'function') {
                        setFormData({
                          name: t.name,
                          description: t.description,
                          price: t.price,
                          is_active: t.is_active,
                          created_by: t.created_by,
                        });
                      }
                      if (setEditingId && typeof setEditingId === 'function') {
                        setEditingId(t.id);
                      }
                    }}
                    className="px-3 py-1 bg-[#6b4226] text-white rounded-lg flex items-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  {/* Assign */}
                  <button
                    onClick={() => openAssignModal(t)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    Assign
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Assign Modal */}
      {activeTopping && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
            <h3 className="text-lg font-semibold mb-4">
              Assign Topping: {activeTopping.name}
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
              {safeProducts.length === 0 ? (
                <p>No products available.</p>
              ) : (
                safeProducts.map((p) => {
                  const assigned = isProductAssigned(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span>{p.name}</span>
                      <input
                        type="checkbox"
                        checked={assigned}
                        onChange={() => toggleProduct(p.id)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </label>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveTopping(null);
                  setSelectedProducts([]);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignments}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Assignments"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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
  const [selectedProducts, setSelectedProducts] = useState({}); // { productId: true/false }
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const safeToppings = Array.isArray(toppings) ? toppings : [];
  const safeProducts = Array.isArray(products) ? products : [];

  // Open assign modal → fetch per-product toppings
  const openAssignModal = async (topping) => {
    setActiveTopping(topping);
    setModalLoading(true); // start modal loading
    const assignments = {};

    try {
      for (const product of safeProducts) {
        const res = await toppingApi.getProductsByTopping(topping.id);
        const productToppings = res.data || [];
        assignments[product.id] = productToppings.some((t) => t.id === product.id);
      }
      setSelectedProducts(assignments);
    } catch (err) {
      console.error("Error fetching toppings:", err);
    } finally {
      setModalLoading(false); // stop modal loading
    }
  };

  // Toggle selection for unassigned products
  const toggleProduct = (productId) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Save assignments
  const handleSaveAssignments = async () => {
    if (!activeTopping) return;

    setLoading(true);
    try {
      for (const product of safeProducts) {
        const shouldHave = selectedProducts[product.id];
        const res = await toppingApi.getProductsByTopping(activeTopping.id);
        const currentlyHas = (res.data || []).some((t) => t.id === product.id);

        if (shouldHave && !currentlyHas) {
          await toppingApi.assignToProduct(activeTopping.id, product.id, false, employeeId);
        } else if (!shouldHave && currentlyHas) {
          await toppingApi.removeFromProduct(activeTopping.id, product.id);
        }
      }

      const updatedToppings = await toppingApi.getAllToppings();
      setToppings?.(updatedToppings);

      setActiveTopping(null);
      setSelectedProducts({});
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
      setToppings?.((prev) =>
        Array.isArray(prev) ? prev.filter((t) => t.id !== toppingId) : []
      );
      alert("Topping deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete topping");
    }
  };

  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4">🍩 Toppings List</h2>

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
                <td className="p-3">{t.name}</td>
                <td className="p-3 text-center">{t.price}</td>
                <td className="p-3 text-center">
                  {t.is_active ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() =>
                      setFormData?.({
                        name: t.name,
                        description: t.description,
                        price: t.price,
                        is_active: t.is_active,
                        created_by: t.created_by,
                      }) || setEditingId?.(t.id)
                    }
                    className="px-3 py-1 bg-[#6b4226] text-white rounded-lg flex items-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={() => openAssignModal(t)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    Assign
                  </button>

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
              {modalLoading ? (
                <p className="text-center text-gray-500">Loading products...</p>
              ) : safeProducts.length === 0 ? (
                <p>No products available.</p>
              ) : (
                safeProducts.map((p) => {
                  const isAssigned = selectedProducts[p.id] || false;

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <span className="font-medium">{p.name}</span>
                          <p className="text-sm text-gray-500">{p.category?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAssigned ? (
                          <button
                            onClick={async () => {
                              try {
                                await toppingApi.removeFromProduct(activeTopping.id, p.id);
                                setSelectedProducts((prev) => ({
                                  ...prev,
                                  [p.id]: false,
                                }));
                                alert(`Topping removed from ${p.name}`);
                              } catch (err) {
                                console.error(err);
                                alert("Failed to remove topping");
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg"
                          >
                            Remove
                          </button>
                        ) : (
                          <input
                            type="checkbox"
                            checked={selectedProducts[p.id] || false}
                            onChange={() => toggleProduct(p.id)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveTopping(null);
                  setSelectedProducts({});
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

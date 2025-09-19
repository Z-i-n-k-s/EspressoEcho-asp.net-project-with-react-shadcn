import { XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import productApi from "@/api/Product_api";
import inventoryApi from "@/api/Inventory_api";

export default function InventoryDialog({ setShowDialog, setInventory }) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(0);
  const [reason, setReason] = useState("");

  const branchId = "019952e5-0100-7162-917e-9e66e0ef527b";
  const employeeId = "019952e6-1409-707a-9c6b-52413b059b8b";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await productApi.getAllProducts();
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
      setLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const toggleSelectProduct = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const saveItems = async () => {
    if (!selectedProducts.length) return;
    setSaving(true);
    try {
      const payload = {
        branch_id: branchId,
        updates: selectedProducts.map((p) => ({
          product_id: p.id,
          quantity: Number(quantity),
          reorder_level: Number(reorderLevel),
          reason: reason || "",
          employee_id: employeeId,
        })),
      };

      const response = await inventoryApi.bulkUpdate(payload);
      const savedItems = response.data || [];

      setInventory((prev) => [...prev, ...savedItems]);
      setShowDialog(false);
       window.location.reload();
    } catch (err) {
      console.error("Error saving inventory adjustment:", err);
      alert("Failed to save adjustments. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center blur-sm"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative bg-[#fffaf5] p-6 rounded-2xl shadow-lg w-[950px] max-w-[95vw] border border-[#e7dcd3] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#5c4033] mb-6">
          Bulk Inventory Adjustment
        </h2>

        {/* Product Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-[#f8f3ef] text-[#5c4033]">
              <tr>
                <th className="p-3 border">Product Name</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Base Price</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Select</th>
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Loading products...
                  </td>
                </tr>
              ) : products.length ? (
                products.map((p) => {
                  const isSelected = !!selectedProducts.find(
                    (sp) => sp.id === p.id
                  );
                  return (
                    <tr
                      key={p.id}
                      className={`${
                        isSelected
                          ? "bg-blue-50 border-l-4 border-blue-400"
                          : ""
                      }`}
                    >
                      <td className="p-3 border">{p.name}</td>
                      <td className="p-3 border">{p.category?.name || "—"}</td>
                      <td className="p-3 border">৳{p.base_price}</td>
                      <td className="p-3 border">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded cursor-pointer hover:scale-150 transition-transform"
                          onClick={() => setZoomImage(p.image_url)}
                        />
                      </td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => toggleSelectProduct(p)}
                          className={`px-3 py-1 rounded-lg ${
                            isSelected
                              ? "bg-green-200 text-green-800 cursor-default"
                              : "bg-blue-200 hover:bg-blue-300 text-blue-900"
                          }`}
                        >
                          {isSelected ? "Selected ✅" : "Select"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-4 text-gray-500 italic"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quantity / Reorder / Reason Form */}
        {selectedProducts.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-[#5c4033]">
                Quantity
              </label>
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#5c4033]">
                Reorder Level
              </label>
              <input
                type="number"
                min={0}
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="col-span-3">
              <label className="block mb-2 font-semibold text-[#5c4033]">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowDialog(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={saveItems}
            className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 flex items-center gap-2"
            disabled={saving || selectedProducts.length === 0}
          >
            {saving && (
              <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Zoom Image Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative">
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full shadow p-1"
            >
              <XCircle size={28} className="text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

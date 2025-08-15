import { XCircle } from 'lucide-react';
import React, { useRef } from 'react'

export default function InventoryDialog({ isAddMode, currentItem, setCurrentItem, setShowDialog,setInventory }) {
    const fileInputRef = useRef(null);

    const saveItem = () => {
    if (isAddMode) {
      setInventory((prev) => [...prev, currentItem]);
    } else {
      setInventory((prev) =>
        prev.map((inv) => (inv.id === currentItem.id ? currentItem : inv))
      );
    }
    setShowDialog(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center blur-sm"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative bg-[#fffaf5] p-6 rounded-2xl shadow-lg w-[600px] max-w-[90vw] border border-[#e7dcd3] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#5c4033] mb-6">
              {isAddMode ? "Add New Item" : "Edit Item"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Item Name */}
              <div className="col-span-2">
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Item Name
                </label>
                <input
                  type="text"
                  value={currentItem.item}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, item: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Category
                </label>
                <select
                  value={currentItem.category || "Coffees"}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Coffees">Coffees</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Description
                </label>
                <textarea
                  value={currentItem.description || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                />
              </div>


              {/* Base Price */}
              <div>
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Base Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={currentItem.basePrice}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      basePrice: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Reorder Level
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentItem.reorderLevel}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      reorderLevel: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={currentItem.expiryDate}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Product Image */}
              <div className="col-span-2">
                <label className="block mb-2 font-semibold text-[#5c4033]">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setCurrentItem({
                        ...currentItem,
                        image: imageUrl,
                        imageFile: file,
                      });
                      e.target.value = null;
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-lg shadow"
                >
                  + Add Image
                </button>

                {currentItem.image && (
                  <div className="relative mt-3 w-28 h-28 group">
                    <img
                      src={currentItem.image}
                      alt="Product Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentItem({
                          ...currentItem,
                          image: null,
                          imageFile: null,
                        });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = null;
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <XCircle
                        className="text-red-500 hover:text-red-600"
                        size={20}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
  )
}

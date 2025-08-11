import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  PlusCircle,
  MinusCircle,
  Edit3,
  Trash2,
  Clock,
  PackagePlus,
  XCircle,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = [
        {
          id: 1,
          item: "Espresso Beans",
          category: "Coffees",
          quantity: 20,
          reorderLevel: 5,
          basePrice: 15.99,
          expiryDate: "2025-08-07",
        },
        {
          id: 2,
          item: "Milk Cake",
          category: "Desserts",
          quantity: 8,
          reorderLevel: 4,
          basePrice: 2.99,
          expiryDate: "2025-08-10",
        },
        {
          id: 3,
          item: "Caramel Syrup",
          category: "Coffees",
          quantity: 3,
          reorderLevel: 2,
          basePrice: 5.99,
          expiryDate: "2025-09-01",
        },
        {
          id: 4,
          item: "Chocolate Muffin",
          category: "Desserts",
          quantity: 15,
          reorderLevel: 6,
          basePrice: 4.99,
          expiryDate: "2026-01-01",
        },
      ];
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = (id, type) => {
    setInventory((prev) =>
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

  const discardItem = (id) => {
    setInventory((prev) => prev.filter((inv) => inv.id !== id));
  };

  const isExpired = (date) => {
    const today = new Date();
    return new Date(date) < today;
  };

  const discardExpired = () => {
    setInventory((prev) => prev.filter((inv) => !isExpired(inv.expiryDate)));
  };

  const openEditDialog = (item) => {
    setCurrentItem({ ...item });
    setIsAddMode(false);
    setShowDialog(true);
  };

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

 // --- Filter inventory for chart + search ---
const filteredInventory = inventory.filter((item) => {
  const matchesCategory =
    selectedCategory === "All" || item.category === selectedCategory;
  const matchesSearch =
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesCategory && matchesSearch;
});

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        📦 Inventory Management
      </h1>
      

      

      {/* Global Actions */}
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

   
   
      {/* Category Filter + Chart */}
      <div className="bg-[#fff8f1] p-5 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#5c4033]">📊 Inventory Quantity Overview</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="All">All Categories</option>
            <option value="Coffees">Coffees</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredInventory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="item" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="tan" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#d0b8a8] p-6 rounded-2xl shadow-lg border border-[#b08968]">
        <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
          <Package className="text-[#6b4226]" /> Branch Inventory
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
                {/* "bg-[#f0e4d6] text-[#5c4033]" */}
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
                {inventory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center text-[#5c4033] italic"
                    >
                      No inventory data
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((inv,idx) => (
                    <tr
                      key={inv.id}
                      
                       className={`border-b border-[#e7dcd3] last:border-b-0 hover:bg-[#f5ebe0] transition ${
                  idx % 2 === 0 ? "bg-[#fcf9f6]" : "bg-white"
                }`}
                      // "border-b border-[#e7dcd3] hover:bg-[#fdf7f2]"
                    >
                      {/* <td className="p-3 font-medium text-center">
                        {inv.item}
                      </td> */}
                      <td className="p-3 font-medium text-center relative group">
                        <span>{inv.item}</span>
                     {/*tooltip*/}
                        {inv.description && (
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -top-10 w-max max-w-xs px-3 py-2 
                    bg-[#5c4033] text-white text-sm rounded-lg shadow-lg opacity-0 
                    group-hover:opacity-100 transition-opacity z-50"
                          >
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
                          <span className="text-green-600 font-semibold">
                            OK
                          </span>
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

      {/* Dialog */}
      {showDialog && (
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
                  value={currentItem.basePrice}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      basePrice: Number(e.target.value),
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
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: Number(e.target.value),
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
                  value={currentItem.reorderLevel}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      reorderLevel: Number(e.target.value),
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
      )}
    </div>
  );
}

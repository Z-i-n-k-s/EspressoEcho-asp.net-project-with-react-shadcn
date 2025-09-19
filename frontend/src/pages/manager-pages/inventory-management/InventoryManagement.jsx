import React, { useState, useEffect } from "react";
import InventoryDialog from "./InventoryDialog";
import InventoryTable from "./InventoryTable";
import InventoryActions from "./InventoryActions";
import InventoryChart from "./InventoryChart";
import branchApi from "@/api/Branch_api";
import inventoryApi from "@/api/Inventory_api";
import productApi from "@/api/Product_api";


export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  // Manual branch and employee IDs
  const branchId = "019952e5-0100-7162-917e-9e66e0ef527b";
  const employeeId = "019952e6-1409-707a-9c6b-52413b059b8b";

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
  setLoading(true);
  try {
    // fetch branch inventory
    const branchInventoryRes = await branchApi.getInventoryByBranch(branchId); 
    const inventoryData = branchInventoryRes.data || [];

    // fetch all products
    const productsRes = await productApi.getAllProducts();
    const products = productsRes.data || [];

     const uniqueCategories = [
      ...new Set(products.map(p => p.category?.name).filter(Boolean))
    ];
    setCategories(uniqueCategories);
    // merge product info into inventory
    const mergedInventory = inventoryData.map((inv) => {
      const product = products.find(p => p.id === inv.product_id) || {};
      return {
        id: inv.product_id,
        item: inv.product_name,
        category: product.category?.name || "—",
        quantity: inv.quantity_on_hand,
        reorderLevel: inv.reorder_level,
        basePrice: product.base_price || 0,
      };
    });

    setInventory(mergedInventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    setInventory([]);
     setCategories([]);
  } finally {
    setLoading(false);
  }
};

  // Filtered inventory for search + category
  const filteredInventory = inventory.filter((item) => {
    const itemName = (item.item || "").toLowerCase();
    const itemCategory = (item.category || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesCategory =
      selectedCategory === "All" || (item.category || "") === selectedCategory;
    const matchesSearch = itemName.includes(search) || itemCategory.includes(search);

    return matchesCategory && matchesSearch;
  });

  // Handle + / - button click
  const adjustInventory = async (id, action) => {
    const item = inventory.find(inv => inv.id === id);
    if (!item) return;

    try {
      await inventoryApi.adjustInventory({
        branch_id: branchId,
        adjustments: [
          {
            product_id: id,
            action: action, // "add" or "remove"
            quantity: 1,
            reorder_level: item.reorderLevel,
            reason: "",
            employee_id: employeeId,
          }
        ]
      });

      // Update local state immediately
      setInventory(prev =>
        prev.map(inv =>
          inv.id === id
            ? { ...inv, quantity: action === "add" ? inv.quantity + 1 : Math.max(0, inv.quantity - 1) }
            : inv
        )
      );
    } catch (err) {
      console.error("Failed to adjust inventory:", err);
      alert("Failed to update inventory. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6 flex items-center gap-3">
        📦 Inventory Management
      </h1>

      <InventoryActions
        inventory={inventory}
        setShowDialog={setShowDialog}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <InventoryChart
        filteredInventory={filteredInventory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <InventoryTable
        loading={loading}
        filteredInventory={filteredInventory}
        adjustInventory={adjustInventory} 
      />

      {showDialog && (
        <InventoryDialog
          setShowDialog={setShowDialog}
          setInventory={setInventory}
        />
      )}
    </div>
  );
}

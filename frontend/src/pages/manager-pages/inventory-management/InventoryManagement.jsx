import React, { useState, useEffect } from "react";
import InventoryDialog from "./InventoryDialog";
import InventoryTable from "./InventoryTable";
import InventoryActions from "./InventoryActions";
import InventoryChart from "./InventoryChart";
import branchApi from "@/api/Branch_api";
import inventoryApi from "@/api/Inventory_api";
import categoryApi from "@/api/Catergory_api";


export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  // Manual branch and employee IDs
  const branchId = "01996313-96b7-71c2-b7fc-c2ec3d1f4844";
  const employeeId = "01996313-3dbb-7361-aa4a-8fb6cd927423";

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
  setLoading(true);
  try {
    //  Fetch branch inventory
    const branchInventoryRes = await branchApi.getInventoryByBranch(branchId);
    const inventoryData = branchInventoryRes.data || [];

    //  Fetch categories assigned to this branch
    const categoryRes = await categoryApi.getByBranch(branchId);
    const branchCategories = categoryRes.success ? categoryRes.data : [];

    //  Flatten all products under these categories
    const branchProducts = branchCategories.flatMap(cat =>
      (cat.products || []).map(p => ({
        ...p,
        categoryName: cat.name,
      }))
    );

    // Build unique category list for dropdown
    const uniqueCategories = [...new Set(branchProducts.map(p => p.categoryName))];
    setCategories(uniqueCategories);

    //  Merge inventory data with branchProducts info
    const mergedInventory = inventoryData.map(inv => {
      const product = branchProducts.find(p => p.id === inv.product_id) || {};
      return {
        id: inv.product_id,
        item: product.name || inv.product_name,
        category: product.categoryName || "—",
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

import React, { useState, useEffect} from "react";
import InventoryDialog from "./InventoryDialog";
import InventoryTable from "./InventoryTable";
import InventoryActions from "./InventoryActions";
import InventoryChart from "./InventoryChart";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [searchTerm, setSearchTerm] = useState("");


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
    <InventoryActions
      inventory={inventory}
      setInventory={setInventory}
      setCurrentItem={setCurrentItem}
      setIsAddMode={setIsAddMode}
      setShowDialog={setShowDialog}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />

      {/* Category Filter + Chart */}
      <InventoryChart
        filteredInventory={filteredInventory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Inventory Table - handles : Display table Status logic Action buttons */}
      <InventoryTable
        inventory={inventory}
        loading={loading}
        filteredInventory={filteredInventory}
        setInventory={setInventory}
        setCurrentItem={setCurrentItem}
        setIsAddMode={setIsAddMode}
        setShowDialog={setShowDialog}
      />

      {/* Dialog handles- add/edit item and image upload */}
      {showDialog && (
        <InventoryDialog
          isAddMode={isAddMode}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          setShowDialog={setShowDialog}
          setInventory={setInventory}
        />
      )}
    </div>
  );
}

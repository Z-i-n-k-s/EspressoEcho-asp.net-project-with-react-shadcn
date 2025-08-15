import React, { useEffect, useMemo, useState } from "react";

import ProductDialog from "./ProductDialog";
import ProductTable from "./ProductTable";
import CategoryManager from "./CategoryManager";
import ProductChart from "./ProductChart";
import BranchSelector from "./BranchSelector";
import ProductActions from "./ProductActions";

export default function ProductManagement() {
  // ----- Branches -----
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(""); // branch id (string for select)

  // ----- Per-branch data stores -----
  const [inventoriesByBranch, setInventoriesByBranch] = useState({});
  const [categoriesByBranch, setCategoriesByBranch] = useState({}); // { [branchId]: [{id,name}] }

  // ----- UI/Inventory states (scoped to selected branch) -----
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // ---------- Mock API load ----------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      
      // ----- Branches -----
      const mockBranches = [
        { id: "1", name: "Central Coffee Hub" },
        { id: "2", name: "North Side Café" },
        { id: "3", name: "Airport Kiosk" },
      ];
      setBranches(mockBranches);

      // ----- Inventories -----
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      const todayISO = `${y}-${m}-${d}`;

      const mockInventories = {
        1: [
          {
            id: 1,
            item: "Espresso Beans",
            category: "Coffees",
            quantity: 20,
            reorderLevel: 5,
            basePrice: 15.99,
            expiryDate: todayISO,
            description: "Rich Arabica blend",
          },
          {
            id: 2,
            item: "Milk Cake",
            category: "Desserts",
            quantity: 8,
            reorderLevel: 4,
            basePrice: 2.99,
            expiryDate: `${y}-08-10`,
            description: "Fresh & creamy",
          },
        ],
        2: [
          {
            id: 3,
            item: "Caramel Syrup",
            category: "Coffees",
            quantity: 3,
            reorderLevel: 2,
            basePrice: 5.99,
            expiryDate: `${y}-09-01`,
            description: "For lattes & frappes",
          },
          {
            id: 4,
            item: "Chocolate Muffin",
            category: "Desserts",
            quantity: 15,
            reorderLevel: 6,
            basePrice: 4.99,
            expiryDate: `${y + 1}-01-01`,
            description: "Baked daily",
          },
        ],
        3: [
          {
            id: 5,
            item: "Sandwich",
            category: "Snacks",
            quantity: 10,
            reorderLevel: 3,
            basePrice: 3.99,
            expiryDate: `${y}-12-31`,
            description: "Quick airport snack",
          },
        ],
      };
      setInventoriesByBranch(mockInventories);

      // ----- Categories -----
      const mockCategories = {
        1: [
          { id: 101, name: "Coffees" },
          { id: 102, name: "Desserts" },
        ],
        2: [
          { id: 201, name: "Coffees" },
          { id: 202, name: "Tea" },
        ],
        3: [{ id: 301, name: "Snacks" }],
      };
      setCategoriesByBranch(mockCategories);

      setLoading(false);
    };

    loadData();
  }, []);

  // Show loading on branch change
  useEffect(() => {
    if (!selectedBranch) return;

    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // simulate network delay per branch
    return () => clearTimeout(timer);
  }, [selectedBranch]);

  // Reset filters when branch changes
  useEffect(() => {
    setSelectedCategory("All");
    setSearchTerm("");
  }, [selectedBranch]);

  // Helpers to work on the selected branch's inventory
  const currentInventory = useMemo(() => {
    return selectedBranch ? inventoriesByBranch[selectedBranch] || [] : [];
  }, [inventoriesByBranch, selectedBranch]);

  const setCurrentInventory = (updater) => {
    setInventoriesByBranch((prev) => {
      const copy = { ...prev };
      const prevArr = copy[selectedBranch] || [];
      copy[selectedBranch] =
        typeof updater === "function" ? updater(prevArr) : updater;
      return copy;
    });
  };

  const branchCategories = useMemo(() => {
    return selectedBranch ? categoriesByBranch[selectedBranch] || [] : [];
  }, [categoriesByBranch, selectedBranch]);

  const upsertBranchCategories = (next) => {
    setCategoriesByBranch((prev) => ({
      ...prev,
      [selectedBranch]:
        typeof next === "function" ? next(prev[selectedBranch] || []) : next,
    }));
  };

  // ---------- Inventory Operations ----------
  const isExpired = (date) => {
    if (!date) return false;
    const today = new Date();
    const dt = new Date(date);
    // ignore time of day: compare YYYY-MM-DD
    return dt.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
  };

  // ---------- Derived: Filtered Inventory for chart+table ----------
  const filteredInventory = useMemo(() => {
    const list = currentInventory;

    const matchCat = (it) =>
      selectedCategory === "All" || it.category === selectedCategory;

    const q = searchTerm.trim().toLowerCase();
    const matchSearch = (it) =>
      !q ||
      it.item.toLowerCase().includes(q) ||
      (it.category || "").toLowerCase().includes(q) ||
      (it.description || "").toLowerCase().includes(q);

    return list.filter((it) => matchCat(it) && matchSearch(it));
  }, [currentInventory, selectedCategory, searchTerm]);

  const currentBranchName = useMemo(
    () => branches.find((b) => b.id === selectedBranch)?.name || "",
    [branches, selectedBranch]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h1 className="text-4xl font-extrabold text-[#5c4033] flex items-center gap-3">
          📦 Product Management
        </h1>

        {/* Branch Selector */}
        <BranchSelector
          branches={branches}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      </div>

      {!selectedBranch ? (
        <div className="bg-[#fff8f1] p-6 rounded-2xl shadow-md border border-[#e7dcd3]">
          <p className="text-[#5c4033] text-lg">
            Please select a branch to manage its products and categories.
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading products...
          </span>
        </div>
      ) : (
        <>
          {/* Admin: Branch Category Management */}
          <CategoryManager
            currentBranchName={currentBranchName}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            branchCategories={branchCategories}
            upsertBranchCategories={upsertBranchCategories}
            currentInventory={currentInventory}
          />

          {/* Global Actions (Products) */}
          <ProductActions
            selectedBranch={selectedBranch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentItem={setCurrentItem}
            setIsAddMode={setIsAddMode}
            setShowDialog={setShowDialog}
            setCurrentInventory={setCurrentInventory}
            upsertBranchCategories={upsertBranchCategories}
            currentInventory={currentInventory}
            isExpired={isExpired}
            branchCategories={branchCategories}
          />

          {/* Category Filter + Chart */}
          <ProductChart
            currentBranchName={currentBranchName}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            branchCategories={branchCategories}
            currentInventory={currentInventory}
            filteredInventory={filteredInventory}
          />

          {/* Inventory Table */}
          <ProductTable
            currentBranchName={currentBranchName}
            loading={loading}
            currentInventory={currentInventory}
            filteredInventory={filteredInventory}
            isExpired={isExpired}
            setCurrentItem={setCurrentItem}
            setIsAddMode={setIsAddMode}
            setShowDialog={setShowDialog}
            selectedBranch={selectedBranch}
            setCurrentInventory={setCurrentInventory}
          />

          {/* Dialog handles add,edit,delete */}
          {showDialog && (
            <ProductDialog
              isAddMode={isAddMode}
              currentItem={currentItem}
              setCurrentItem={setCurrentItem}
              branchCategories={branchCategories}
              upsertBranchCategories={upsertBranchCategories}
              setCurrentInventory={setCurrentInventory}
              setShowDialog={setShowDialog}
              selectedBranch={selectedBranch}
            />
          )}
        </>
      )}
    </div>
  );
}

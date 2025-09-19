import React, { useEffect, useMemo, useState } from "react";
import ProductDialog from "./ProductDialog";
import ProductTable from "./ProductTable";
import CategoryManager from "./CategoryManager";
import ProductActions from "./ProductActions";
import branchApi from "@/api/Branch_api";
import categoryApi from "@/api/Catergory_api";
import productApi from "@/api/Product_api";

export default function ProductManagement() {
  const [, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  
  const [, setCategoriesByBranch] = useState({});

  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
const [products, setProducts] = useState([]);
  // ---------- Load branches and categories ----------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allBranches = await branchApi.getAllBranches();
        const normalizedBranches = Array.isArray(allBranches.data) ? allBranches.data : [];
        setBranches(normalizedBranches);
        setSelectedBranch(normalizedBranches[0]?.id || "");

        const allCategories = await categoryApi.getAllCategories();
        const normalizedCategories = Array.isArray(allCategories) ? allCategories : [];

        // Group categories by branch
        const byBranch = {};
        normalizedCategories.forEach(cat => {
          cat.branches?.forEach(branchId => {
            if (!byBranch[branchId]) byBranch[branchId] = [];
            byBranch[branchId].push(cat);
          });
        });
        setCategoriesByBranch(byBranch);

         // Load all products
        const res = await productApi.getAllProducts();
        const productList = Array.isArray(res?.data) ? res.data : [];
        setProducts(productList);

      } catch (err) {
        console.error(err);
        alert("Failed to load data.");
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // Show loading on branch change
  useEffect(() => {
    if (!selectedBranch) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedBranch]);

  // Reset filters when branch changes
  useEffect(() => {
    setSelectedCategory("All");
    setSearchTerm("");
  }, [selectedBranch]);

  const currentInventory = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  // ---------- Filtering ----------
 const filteredInventory = useMemo(() => {
  if (!Array.isArray(products)) return [];

  const query = searchTerm.trim().toLowerCase();

  return products.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const category = item.category?.name?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";

    const matchesSearch =
      !query ||
      name.includes(query) ||
      category.includes(query) ||
      description.includes(query);

    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });
}, [products, searchTerm, selectedCategory]);


  // ---------- Update products ----------
  const setCurrentInventory = (updater) => {
    setProducts((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter]">
      {/* Category Management */}
      <CategoryManager/>

      {/* Product Actions */}
      <ProductActions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentItem={setCurrentItem}
        setIsAddMode={setIsAddMode}
        setShowDialog={setShowDialog}
        currentInventory={currentInventory}
        filteredInventory={filteredInventory}
      />

      {/* Inventory Table */}
      <ProductTable
        loading={loading}
        currentInventory={currentInventory}
        filteredInventory={filteredInventory}
        setCurrentItem={setCurrentItem}
        setIsAddMode={setIsAddMode}
        setShowDialog={setShowDialog}
        selectedBranch={selectedBranch}
        setCurrentInventory={setCurrentInventory}
      />

      {showDialog && (
        <ProductDialog
          isAddMode={isAddMode}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          setCurrentInventory={setCurrentInventory}
          setShowDialog={setShowDialog}
        />
      )}
    </div>
  );
}

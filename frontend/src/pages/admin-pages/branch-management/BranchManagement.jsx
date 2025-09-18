import React, { useEffect, useState } from "react";
import BranchForm from "./BranchForm";
import BranchTable from "./BranchTable";
import branchApi from "@/api/Branch_api";

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_phone: "",
    status: "open",
    manager_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch branches from API
 useEffect(() => {
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await branchApi.getAllBranches(); 

      // If API returns { data: [...] }, pick data
      const branchesArray = Array.isArray(res) ? res : res.data;

      const formattedBranches = branchesArray.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        contact_phone: b.contact_phone,
        status: b.status,
        manager: b.manager || null, 
      }));

      setBranches(formattedBranches);
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
    setLoading(false);
  };

  fetchBranches();
}, []);


  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-3xl font-extrabold text-[#5c4033]">
        🏢 Branch Management
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading branch management page...
          </span>
        </div>
      ) : (
        <>
          {/* Branch Form */}
          <BranchForm
            formData={formData}
            setFormData={setFormData}
            setBranches={setBranches}
            branches={branches}
            setEditingId={setEditingId}
            editingId={editingId}
          />

          {/* Branch Table */}
          <BranchTable
            branches={branches}
            setEditingId={setEditingId}
            setFormData={setFormData}
            setBranches={setBranches}
          />
        </>
      )}
    </div>
  );
};

export default BranchManagement;

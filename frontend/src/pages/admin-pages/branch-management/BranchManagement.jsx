import React, { useEffect, useState } from "react";
import BranchForm from "./BranchForm";
import BranchTable from "./BranchTable";

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  // ----- Mock API: Load branches -----
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockBranches = [
        {
          id: 1,
          name: "Central Coffee Hub",
          address: "123 Main St, Downtown",
          contact: "0123456789",
          email: "central@coffeehub.com",
          opening: "08:00",
          closing: "10:00",
          status: "Active",
          manager: "John Doe",
        },
        {
          id: 2,
          name: "Bean Haven",
          address: "45 Uptown Ave",
          contact: "0198765432",
          email: "bean@haven.com",
          opening: "09:00",
          closing: "18:00",
          status: "Inactive",
          manager: "Jane Smith",
        },
      ];

      setBranches(mockBranches);
      setLoading(false);
    };

    fetchBranches();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    opening: "",
    closing: "",
    status: "Active",
    manager: "",
  });
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-3xl font-extrabold text-[#5c4033]">
        🏢 Branch Management
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading branche management page...
          </span>
        </div>
      ):(
        <>
      {/*branchin Form */}
      <BranchForm
        formData={formData}
        setFormData={setFormData}
        setBranches={setBranches}
        branches={branches}
        setEditingId={setEditingId}
        editingId={editingId}
      />

      {/* Branch List Table */}
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

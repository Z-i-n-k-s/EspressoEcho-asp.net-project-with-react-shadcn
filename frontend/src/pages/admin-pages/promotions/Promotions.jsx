import React, { useState, useEffect } from "react";
import PromotionForm from "./PromotionForm";
import PromotionTable from "./PromotionTable";
import promotionsApi from "@/api/Promotions_api";


export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [newPromo, setNewPromo] = useState({
    code: "",
    discountType: "percentage",
    value: "",
    branch: "",
    startDate: "",
    endDate: "",
    description: "",
    maxUses: "",
    ruleType: "",
    ruleCriteria: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await promotionsApi.getAllPromotions();
      if (res.success) {
        setPromotions(res.data);
      } else {
        console.error(res.message || "Failed to fetch promotions");
      }
    } catch (err) {
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        🎯 Manage Promotions
      </h1>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading promotions...
          </span>
        </div>
      ) : (
        <>
          {/* Create Promotion Form */}
          <PromotionForm
            newPromo={newPromo}
            setNewPromo={setNewPromo}
            setPromotions={setPromotions}
          />

          {/* Promotions Table */}
          <PromotionTable
            promotions={promotions}
          />
        </>
      )}
    </div>
  );
}

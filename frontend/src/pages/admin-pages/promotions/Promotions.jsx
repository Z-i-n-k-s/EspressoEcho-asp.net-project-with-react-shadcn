import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import PromotionForm from "./PromotionForm";
import PromotionTable from "./PromotionTable";

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [newPromo, setNewPromo] = useState({
    code: "",
    discountType: "percentage",
    value: "",
    branch: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);

    // Mock data
    const mockData = [
      {
        code: "COFFEE10",
        type: "percentage",
        value: 10,
        branch: "Downtown",
        start: "2025-08-01",
        end: "2025-08-31",
        description: "10% off all coffee drinks",
        uses: 42,
      },
      {
        code: "BEANS5",
        type: "fixed",
        value: 5,
        branch: "Uptown",
        start: "2025-08-10",
        end: "2025-08-20",
        description: "$5 off coffee beans",
        uses: 15,
      },
      {
        code: "LATTE15",
        type: "percentage",
        value: 15,
        branch: "Downtown",
        start: "2025-08-05",
        end: "2025-08-25",
        description: "15% off all lattes",
        uses: 27,
      },
    ];

    try {
      // Simulate API call delay
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve(mockData), 800)
      );

      setPromotions(data);
    } catch (err) {
      console.error(err);
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
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            promotions={promotions}
          />
        </>
      )}
    </div>
  );
}

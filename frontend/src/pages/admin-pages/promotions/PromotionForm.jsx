import promotionsApi from "@/api/Promotions_api";
import { PlusCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function PromotionForm({ newPromo, setNewPromo, setPromotions }) {
  const [loading, setLoading] = useState(false);
   const user = useSelector((state) => state.user.user);

  const createPromotion = async () => {
    // Basic validation
    if (
      !newPromo.code ||
      !newPromo.discountType ||
      !newPromo.value ||
      !newPromo.startDate ||
      !newPromo.endDate
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    // Conditional validation: if rule_type is selected, rule_criteria must be a number
    if (newPromo.ruleType && (newPromo.ruleCriteria === "" || newPromo.ruleCriteria === null)) {
      alert("Please provide a numeric value for Rule Criteria.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: newPromo.code.replace(/[^a-zA-Z0-9-_]/g, ""), 
        description: newPromo.description || "",
        discount_type: newPromo.discountType,
        discount_value: Number(newPromo.value),
        valid_from: newPromo.startDate,
        valid_to: newPromo.endDate,
        rule_type: newPromo.ruleType || null,
        rule_criteria: newPromo.ruleCriteria ? Number(newPromo.ruleCriteria) : null,
        is_active: newPromo.isActive ?? true,
        created_by: user.id,// temp user ID
        ...(newPromo.maxUses ? { max_uses: Number(newPromo.maxUses) } : {}),
      };

      const res = await promotionsApi.createPromotion(payload);

      if (res.success) {
        const createdPromo = res.data;

        // Add to promotions list
        setPromotions((prev) => [createdPromo, ...prev]);

        // Reset form
        setNewPromo({
          code: "",
          discountType: "percentage",
          value: "",
          startDate: "",
          endDate: "",
          description: "",
          maxUses: "",
          ruleType: "",
          ruleCriteria: "",
          isActive: true,
        });

        console.log("Promotion created:", createdPromo);
      } else {
        alert(res.message || "Failed to create promotion.");
      }
    } catch (err) {
      console.error("Failed to create promotion:", err);
      alert("An error occurred while creating the promotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <PlusCircle /> Create New Promotion
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Promo Code */}
        <input
          className="p-3 rounded-lg border border-[#e7dcd3]"
          placeholder="Promo Code"
          value={newPromo.code}
          onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
        />

        {/* Discount Type */}
        <select
          className="p-3 rounded-lg border border-[#e7dcd3]"
          value={newPromo.discountType}
          onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value })}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed_amount">Fixed Amount</option>
        </select>

        {/* Discount Value */}
        <input
          type="number"
          min={0}
          className="p-3 rounded-lg border border-[#e7dcd3]"
          placeholder="Discount Value"
          value={newPromo.value}
          onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
        />

        {/* Max Uses */}
        <input
          type="number"
          min={1}
          className="p-3 rounded-lg border border-[#e7dcd3]"
          placeholder="Max Uses (optional)"
          value={newPromo.maxUses || ""}
          onChange={(e) =>
            setNewPromo({ ...newPromo, maxUses: e.target.value ? Number(e.target.value) : "" })
          }
        />

        {/* Valid From */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 pl-2">Valid From</label>
          <input
            type="date"
            className="p-3 rounded-lg border border-[#e7dcd3]"
            value={newPromo.startDate}
            onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
          />
        </div>

        {/* Valid To */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 pl-2">Valid To</label>
          <input
            type="date"
            className="p-3 rounded-lg border border-[#e7dcd3]"
            value={newPromo.endDate}
            onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
          />
        </div>

        {/* Description */}
        <textarea
          className="p-3 rounded-lg border border-[#e7dcd3] col-span-1 md:col-span-2"
          placeholder="Promotion Description"
          value={newPromo.description}
          onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
        />

        {/* Rule Type Dropdown */}
        <select
          className="p-3 rounded-lg border border-[#e7dcd3] col-span-1 md:col-span-2"
          value={newPromo.ruleType}
          onChange={(e) => setNewPromo({ ...newPromo, ruleType: e.target.value })}
        >
          <option value="">Select Rule Type (optional)</option>
          <option value="order_count">Order Count</option>
          <option value="customer_duration">Customer Duration</option>
          <option value="order_amount">Order Amount</option>
        </select>

        {/* Rule Criteria Number */}
        <input
          type="number"
          min={0}
          className="p-3 rounded-lg border border-[#e7dcd3] col-span-1 md:col-span-2"
          placeholder="Rule Criteria (number, required if Rule Type selected)"
          value={newPromo.ruleCriteria || ""}
          onChange={(e) =>
            setNewPromo({ ...newPromo, ruleCriteria: e.target.value ? Number(e.target.value) : "" })
          }
        />
      </div>

      <button
        onClick={createPromotion}
        disabled={loading}
        className={`mt-4 flex items-center justify-center gap-2 bg-[#6b4226] text-white px-5 py-2 rounded-lg transition ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5a3620]"
        }`}
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Create Promotion"}
      </button>
    </div>
  );
}

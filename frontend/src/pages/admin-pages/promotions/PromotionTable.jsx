import React from "react";

export default function PromotionTable({ promotions }) {

  // Helper to display rule criteria with description
  const formatRuleCriteria = (type, criteria) => {
    if (!type || !criteria) return "-";

    switch (type) {
      case "order_count":
        return `${criteria} → the customer must have ${criteria} order${criteria > 1 ? "s" : ""} to use this promo.`;
      case "customer_duration":
        return `${criteria} → the customer must be registered for ${criteria} day${criteria > 1 ? "s" : ""}.`;
      case "order_amount":
        return `${criteria} → the total order amount must be $${criteria} or more.`;
      default:
        return criteria;
    }
  };

  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-[#5c4033]">
          📋 Promotions List
        </h2>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[#5c4033] border-b border-[#e7dcd3]">
            <th className="p-2">Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Value</th>
            <th className="p-2">Branch</th>
            <th className="p-2">Valid</th>
            <th className="p-2">Max Uses</th>
            <th className="p-2">Rule Type</th>
            <th className="p-2">Rule Criteria</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center text-[#7b5e4b] p-4">
                No promotions available.
              </td>
            </tr>
          ) : (
            promotions.map((promo, i) => (
              <tr key={i} className="border-b border-[#e7dcd3] text-[#7b5e4b]">
                <td className="p-2">{promo.code}</td>
                <td className="p-2">{promo.discount_type}</td>
                <td className="p-2">
                  {promo.discount_value}
                  {promo.discount_type === "percentage" ? "%" : "$"}
                </td>
                <td className="p-2">{promo.branch || "All"}</td>
                <td className="p-2">
                  {promo.valid_from.slice(0, 10)} → {promo.valid_to.slice(0, 10)}
                </td>
                <td className="p-2">{promo.max_uses || "∞"}</td>
                <td className="p-2">{promo.rule_type || "-"}</td>
                <td className="p-2">{formatRuleCriteria(promo.rule_type, promo.rule_criteria)}</td>
                <td className="p-2">{promo.description || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

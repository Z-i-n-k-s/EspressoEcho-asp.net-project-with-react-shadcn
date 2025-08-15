import { PlusCircle } from "lucide-react";
import React from "react";

export default function PromotionForm({
  newPromo,
  setNewPromo,
  setPromotions
}) {
  const createPromotion = () => {
    // Make sure all fields are filled before adding
    if (
      !newPromo.code ||
      !newPromo.value ||
      !newPromo.branch ||
      !newPromo.startDate ||
      !newPromo.endDate
    ) {
      alert("Please fill out all fields.");
      return;
    }

    // New promotion object matching table structure
    const newPromoEntry = {
      code: newPromo.code,
      type: newPromo.discountType,
      value: Number(newPromo.value),
      branch: newPromo.branch,
      start: newPromo.startDate,
      end: newPromo.endDate,
      uses: 0, // starts unused
    };

    // Add the new promotion at the top of the list
    setPromotions((prevPromotions) => [newPromoEntry, ...prevPromotions]);

    // Reset form
    setNewPromo({
      code: "",
      discountType: "percentage",
      value: "",
      branch: "",
      startDate: "",
      endDate: "",
    });

    console.log("Promotion added:", newPromoEntry);
  };
  
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <PlusCircle /> Create New Promotion
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="p-3 rounded-lg border border-[#e7dcd3]"
          placeholder="Promo Code"
          value={newPromo.code}
          onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
        />
        <select
          className="p-3 rounded-lg border border-[#e7dcd3]"
          value={newPromo.discountType}
          onChange={(e) =>
            setNewPromo({ ...newPromo, discountType: e.target.value })
          }
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input
          type="number"
          min={0}
          className="p-3 rounded-lg border border-[#e7dcd3]"
          placeholder="Value"
          value={newPromo.value}
          onChange={(e) =>
            setNewPromo({
              ...newPromo,
              value: Math.max(0, Number(e.target.value)),
            })
          }
        />
        <input
          type="text"
          className="p-3 rounded-lg border border-[#e7dcd3]"
          placeholder="Branch"
          value={newPromo.branch}
          onChange={(e) => setNewPromo({ ...newPromo, branch: e.target.value })}
        />
        <div className="flex flex-col ">
          <label className="text-sm font-medium text-gray-700 mb-1 pl-2">
            Valid from
          </label>
          <input
            type="date"
            className="p-3 rounded-lg border border-[#e7dcd3]"
            value={newPromo.startDate}
            onChange={(e) =>
              setNewPromo({ ...newPromo, startDate: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 pl-2">
            Valid to
          </label>
          <input
            type="date"
            className="p-3 rounded-lg border border-[#e7dcd3]"
            value={newPromo.endDate}
            onChange={(e) =>
              setNewPromo({ ...newPromo, endDate: e.target.value })
            }
          />
        </div>
        <textarea
          className="p-3 rounded-lg border border-[#e7dcd3] col-span-1 md:col-span-2"
          placeholder="Promotion Description"
          value={newPromo.description}
          onChange={(e) =>
            setNewPromo({ ...newPromo, description: e.target.value })
          }
        />
      </div>
      <button
        onClick={createPromotion}
        className="mt-4 bg-[#6b4226] text-white px-5 py-2 rounded-lg hover:bg-[#5a3620] transition"
      >
        Create Promotion
      </button>
    </div>
  );
}

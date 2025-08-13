import { Package } from 'lucide-react'
import React, { useState } from 'react'

export default function TransferForm() {
  const [formData, setFormData] = useState({
      fromBranch: "",
      toBranch: "",
      item: "",
      quantity: "",
      notes: "",
    });
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };
  return (
    <div className="bg-[#fff8f1] p-6 rounded-2xl shadow-lg border border-[#e7dcd3]">
          <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
            <Package className="text-[#6b4226]" /> Create Transfer Request
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={formData.fromBranch}
              onChange={(e) =>
                setFormData({ ...formData, fromBranch: e.target.value })
              }
            >
              <option value="">From Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
            <select
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={formData.toBranch}
              onChange={(e) =>
                setFormData({ ...formData, toBranch: e.target.value })
              }
            >
              <option value="">To Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
            <select
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
            >
              <option value="">Select Item</option>
            </select>
            <input
              type="number"
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
            <textarea
              className="p-3 border border-[#e7dcd3] rounded-lg bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#d4a373] col-span-2"
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-[#d4a373] hover:bg-[#b5835a] text-white font-semibold py-2 px-4 rounded-lg shadow-md col-span-2 transition"
            >
              Submit Transfer Request
            </button>
          </form>
        </div>
  )
}

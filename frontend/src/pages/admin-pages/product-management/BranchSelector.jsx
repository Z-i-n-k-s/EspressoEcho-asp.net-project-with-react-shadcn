import { Store } from 'lucide-react'
import React from 'react'

export default function BranchSelector({ branches, selectedBranch, setSelectedBranch }) {
  return (
    <div className="flex items-center gap-3 bg-white/80 border rounded-xl px-3 py-2 shadow-sm">
          <Store size={18} className="text-[#6b4226]" />
          <label className="font-semibold text-[#5c4033]">Branch:</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="p-2 border rounded-lg min-w-[220px]"
          >
            <option value="">-- Select Branch --</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
  )
}

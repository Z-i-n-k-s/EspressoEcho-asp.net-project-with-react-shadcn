import { Store } from 'lucide-react'
import React from 'react'

export default function BranchSelector({ branches, selectedBranch, setSelectedBranch }) {
  return (
    <div className="mb-6 flex gap-3 items-center">
        <Store className="text-[#5c4033]" />
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="p-2 border bg-[#fff8f1] border-[#eaa66f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c19a6b]"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
  )
}

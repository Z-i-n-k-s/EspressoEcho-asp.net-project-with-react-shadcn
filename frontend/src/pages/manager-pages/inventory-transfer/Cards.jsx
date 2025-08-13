import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import React from 'react'

export default function Cards({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#fffaf5] p-4 rounded-xl shadow-lg border border-[#e7dcd3] flex items-center gap-3">
          <Clock className="text-[#6b4226]" />
          <div>
            <p className="text-sm text-[#5c4033]">Pending Transfers</p>
            <h3 className="text-xl font-bold">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-lg border border-green-200 flex items-center gap-3">
          <CheckCircle className="text-green-700" />
          <div>
            <p className="text-sm text-green-700">Completed</p>
            <h3 className="text-xl font-bold">{stats.completed}</h3>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-lg border border-red-200 flex items-center gap-3">
          <XCircle className="text-red-700" />
          <div>
            <p className="text-sm text-red-700">Rejected</p>
            <h3 className="text-xl font-bold">{stats.rejected}</h3>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-lg border border-yellow-200 flex items-center gap-3">
          <AlertTriangle className="text-yellow-700" />
          <div>
            <p className="text-sm text-yellow-700">Low Stock Alerts</p>
            <h3 className="text-xl font-bold">{stats.lowStock}</h3>
          </div>
        </div>
      </div>
  )
}

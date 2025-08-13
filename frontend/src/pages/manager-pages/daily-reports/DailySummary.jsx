import { TrendingUp } from 'lucide-react'
import React from 'react'

export default function DailySummary({ dailyData }) {
  return (
    <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-[#6b4226] mb-4 flex items-center gap-2">
          <TrendingUp /> Daily Summary
        </h2>
        {dailyData ? (
          <div className="space-y-2 text-[#7b5e4b] text-lg ">
            <p>
              <strong>Date:</strong> {dailyData.date}
            </p>
            <p>
              <strong>Total Sales:</strong> ৳
              {dailyData.totalSales.toLocaleString()}
            </p>
            <p>
              <strong>Total Profit:</strong> ৳
              {dailyData.totalProfit.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Select a date to view details</p>
        )}
      </div>
  )
}

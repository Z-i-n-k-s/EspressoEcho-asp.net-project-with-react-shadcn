import { Package } from 'lucide-react'
import React from 'react'

export default function ProductBreakdown({ dailyData }) {
  return (
    <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-[#6b4226] mb-4 flex items-center gap-2">
          <Package /> Product Breakdown
        </h2>
        {dailyData ? (
          <table className="w-full text-left text-[#7b5e4b] text-lg">
            <thead>
              <tr className="border-b border-[#c89f94]">
                <th className="py-2">Product</th>
                <th className="py-2">Quantity Sold</th>
                <th className="py-2">Customers</th>
                <th className="py-2">Sales (৳)</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.products.map((p, idx) => (
                <tr key={idx} className="border-b border-[#f0e0d6]">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 pl-[calc(4.5%-1ch)]">{p.sold}</td>
                  <td className="py-2 pl-[calc(3.5%-1ch)]">{p.customers}</td>
                  <td className="py-2">৳{p.sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No product data available</p>
        )}
      </div>
  )
}

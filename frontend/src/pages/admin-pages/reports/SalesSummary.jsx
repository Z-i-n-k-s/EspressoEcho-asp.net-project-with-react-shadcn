import { Calendar, TrendingUp } from 'lucide-react'

export default function SalesSummary({ monthlyData }) {
  return (
    <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#6b4226] flex items-center gap-2">
            <TrendingUp /> Sales Summary
          </h2>
          {monthlyData?.monthName && (
            <div className="flex items-center gap-2 text-[#6b4226] font-semibold">
              <Calendar className="w-5 h-5" />
              <span>{monthlyData.monthName}</span>
            </div>
          )}
        </div>
        {monthlyData ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[#7b5e4b]">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Branch</p>
              <p className="text-lg font-bold">{monthlyData.branchName}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-lg font-bold">{monthlyData.totalOrders.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Online Sales</p>
              <p className="text-lg font-bold text-green-600">৳{monthlyData.onlineSales.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Offline Sales</p>
              <p className="text-lg font-bold text-blue-600">৳{monthlyData.offlineSales.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm sm:col-span-2 lg:col-span-4">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-[#6b4226]">
                ৳{(monthlyData.onlineSales + monthlyData.offlineSales).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading sales summary...</p>
        )}
      </div>
  )
}

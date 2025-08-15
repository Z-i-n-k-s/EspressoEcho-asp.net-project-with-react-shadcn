import { Calendar, TrendingUp } from 'lucide-react'

export default function DailySummary({ dailyData }) {
  const total = dailyData
    ? dailyData.totalSales + dailyData.totalProfit
    : 0
  const salesPercentage = total ? ((dailyData.totalSales / total) * 100).toFixed(1) : 0

  return (
    <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#6b4226] flex items-center gap-2">
          <TrendingUp /> Daily Summary
        </h2>
        {dailyData?.date && (
          <div className="flex items-center gap-2 text-[#6b4226] font-semibold">
            <Calendar className="w-5 h-5" />
            <span>{dailyData.date}</span>
          </div>
        )}
      </div>

      {dailyData ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[#7b5e4b]">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-lg font-bold text-green-600">
              ৳{dailyData.totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Profit</p>
            <p className="text-lg font-bold text-blue-600">
              ৳{dailyData.totalProfit.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Tota Sales in %</p>
            <p className="text-lg font-bold text-orange-600">
              {salesPercentage}%
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Select a date to view details</p>
      )}
    </div>
  )
}

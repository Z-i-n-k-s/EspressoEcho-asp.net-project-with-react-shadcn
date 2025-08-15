import { Package } from "lucide-react";

export default function InventoryReport({ monthlyData }) {
  return (
    <div className="bg-[#fff8f1] rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-[#6b4226] mb-4 flex items-center gap-2">
        <Package /> Top Selling Products - {monthlyData.monthName}
      </h2>
      {monthlyData?.sales?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#7b5e4b]">
            <thead>
              <tr className="border-b-2 border-[#c89f94]">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold text-center">Qty Sold</th>
                <th className="py-3 px-4 font-bold text-center">Revenue ($)</th>
                <th className="py-3 px-4 font-bold text-center">Profit ($)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.sales
                .sort((a, b) => b.revenue - a.revenue) // highest first
                .map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#f0e0d6] hover:bg-[#fef7f0]"
                  >
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-green-700">
                      ${item.profit.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No sales data for this month</p>
      )}
    </div>
  );
}

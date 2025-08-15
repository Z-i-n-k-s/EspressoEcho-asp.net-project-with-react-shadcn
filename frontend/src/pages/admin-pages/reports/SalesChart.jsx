import { ShoppingBag } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export default function SalesChart({ monthlyData }) {
  const pieColors = ["#6b4226", "#e6b17e"];

  // Pie chart data for current month
  const pieData = monthlyData
    ? [
        { name: "Online Sales", value: monthlyData.onlineSales || 0 },
        { name: "Offline Sales", value: monthlyData.offlineSales || 0 },
      ]
    : [];

  // Use the monthly breakdown data from the API
  const barData = monthlyData?.monthlyBreakdown || [];

  return (
    <div className="bg-[#fff8f1] rounded-xl shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#6b4226] flex items-center gap-2">
          <ShoppingBag /> Sales Analysis
        </h2>
        {monthlyData?.monthName && (
          <div className="text-sm text-[#6b4226] font-medium">
            Last 6 months trend
          </div>
        )}
      </div>

      {monthlyData && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Pie Chart - Current Month Distribution */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#6b4226] mb-3 text-center">
              {monthlyData.monthName} - Sales Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ৳${value.toLocaleString()}`}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`৳${value.toLocaleString()}`, 'Sales']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - 6 Month Trend */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#6b4226] mb-3 text-center">
              6-Month Sales Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#6b4226', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#6b4226', fontSize: 12 }}
                  tickFormatter={(value) => `৳${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`৳${value.toLocaleString()}`, 'Sales']}
                  labelStyle={{ color: '#6b4226' }}
                />
                <Legend />
                <Bar 
                  dataKey="online" 
                  fill="#6b4226" 
                  name="Online Sales"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="offline" 
                  fill="#e6b17e" 
                  name="Offline Sales"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {monthlyData && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#6b4226]">
              ৳{(monthlyData.onlineSales + monthlyData.offlineSales).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {((monthlyData.onlineSales / (monthlyData.onlineSales + monthlyData.offlineSales)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Online Sales %</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {((monthlyData.offlineSales / (monthlyData.onlineSales + monthlyData.offlineSales)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Offline Sales %</div>
          </div>
        </div>
      )}
    </div>
  );
}

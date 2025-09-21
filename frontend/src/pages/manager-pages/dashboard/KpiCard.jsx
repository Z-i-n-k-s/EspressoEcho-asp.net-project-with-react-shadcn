import { AlarmClock, ShoppingCart, Star, TrendingUp } from "lucide-react";

export const KpiCard = ({ data }) => {
  const metrics = data
    ? [
        { icon: <TrendingUp />, label: "Daily Sales", value: `$${data.daily_sales}` },
        { icon: <ShoppingCart />, label: "Orders Completed", value: data.orders_completed },
        { icon: <AlarmClock />, label: "Avg Order Time", value: data.avg_order_time },
        { icon: <Star />, label: "Top Product", value: data.top_product },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, index) => (
        <div
          key={index}
          className="bg-[#fffaf5] p-5 rounded-2xl shadow-lg border border-[#e7dcd3] hover:shadow-2xl transition duration-200 ease-in-out"
        >
          <div className="flex items-center gap-4">
            <div className="text-[#6b4226] bg-[#e8d8c3] p-3 rounded-full">
              {m.icon}
            </div>
            <div>
              <p className="text-sm text-[#7b5e4b]">{m.label}</p>
              <p className="text-xl font-bold text-[#3f2c1d]">{m.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

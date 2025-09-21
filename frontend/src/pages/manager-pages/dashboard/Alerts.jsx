import { AlertTriangle } from "lucide-react";

export const Alerts = ({ data }) => {
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] h-72">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-3 flex items-center gap-2">
        <AlertTriangle className="text-yellow-600" size={20} />
        Low Stock Alerts
      </h2>
      <ul className="text-base text-[#7b5e4b] mt-3 space-y-2 list-disc list-inside text-lg">
        {data.length === 0 ? (
          <li>No low stock items</li>
        ) : (
          data.map((item, i) => (
            <li key={i}>
              {item.product} - {item.quantity}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

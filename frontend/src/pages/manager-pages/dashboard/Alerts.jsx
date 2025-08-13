import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

export const Alerts = () => {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchLowStockAlerts();
  }, []);

  const fetchLowStockAlerts = async () => {
    try {
      // const res = await fetch("/api/inventory/low-stock");
      // const data = await res.json();
      const data = [
        { item: "Espresso Beans", qty: "4 left" },
        { item: "Milk", qty: "2 cartons" },
        { item: "Caramel Syrup", qty: "1 bottle" },
      ];
      setLowStock(data);
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
    }
  };

  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] h-72">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-3 flex items-center gap-2">
        <AlertTriangle className="text-yellow-600" size={20} />
        Low Stock Alerts
      </h2>
      <ul className="text-base text-[#7b5e4b] mt-3 space-y-2 list-disc list-inside text-lg">
        {lowStock.length === 0 ? (
          <li>No low stock items</li>
        ) : (
          lowStock.map((item, i) => (
            <li key={i}>
              {item.item} - {item.qty}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

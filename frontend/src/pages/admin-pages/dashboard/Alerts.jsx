import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import adminDashboardApi from "@/api/Admin_dashboard_api";



export const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await adminDashboardApi.getDashboard();

      const formattedAlerts = [
        ...(data.priority_alerts.low_stock || []),
        ...(data.priority_alerts.pending_transfers || []),
      ];
      if (data.priority_alerts.pending_feedback) formattedAlerts.push(data.priority_alerts.pending_feedback);

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  return (
    <div className="bg-[#fff8f3] p-6 rounded-xl shadow-md border border-[#e4c8a8]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <AlertTriangle className="text-[#b77f2f]" size={20} /> Priority Alerts
      </h2>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">✅ No alerts</span>
        ) : (
          alerts.map((a, idx) => (
            <span key={idx} className="block px-3 py-2 bg-[#fef3e6] text-[#8b5e3c] rounded-lg text-sm border border-[#e4c8a8]">
              {a}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

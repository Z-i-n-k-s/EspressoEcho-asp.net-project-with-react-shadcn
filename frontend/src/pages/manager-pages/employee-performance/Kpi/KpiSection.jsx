import React from "react";

import { DollarSign, UserCheck, Users } from "lucide-react";
import KpiCard from "./KpiCard";

export default function KpiSection({ totals }) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <KpiCard
        icon={<UserCheck />}
        label="Total Orders"
        value={totals.totalOrders}
      />
      <KpiCard
        icon={<Users />}
        label="Total Customers"
        value={totals.totalCustomers}
      />
      <KpiCard
        icon={<DollarSign />}
        label="Total Sales"
        value={`৳ ${totals.totalSales.toLocaleString()}`}
      />
    </div>
  );
}

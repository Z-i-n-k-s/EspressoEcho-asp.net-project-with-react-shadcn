
import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function SalesChart({ dailyData }) {
  return (
   <div className="bg-[#fff8f1] rounded-xl shadow p-6">
           <h2 className="text-lg font-bold text-[#6b4226] mb-4">
             Product Sales Chart
           </h2>
           {dailyData && (
             <ResponsiveContainer width="100%" height={300}>
               <BarChart data={dailyData.products}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="sales" fill="#6b4226" name="Sales (৳)" />
                 <Bar dataKey="sold" fill="#e6b17e" name="Times Sold" />
               </BarChart>
             </ResponsiveContainer>
           )}
         </div>
  )
}

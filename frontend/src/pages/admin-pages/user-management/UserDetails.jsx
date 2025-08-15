import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import React from "react";

export default function UserDetails({ selectedUser }) {
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] overflow-y-auto max-h-[75vh]">
      {selectedUser ? (
        <>
          <h2 className="text-lg font-semibold text-[#5c4033] mb-3">
                User Details
          </h2>
          
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="text-[#6b4226]" />{" "}
                {selectedUser.email || "No email"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="text-[#6b4226]" />{" "}
                {selectedUser.address || "No address"}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="text-[#6b4226]" />{" "}
                {selectedUser.contact || "No contact"}
              </p>
            </div>
          

          {/* Online Orders */}
          
            <div className="mt-5">
              <h3 className="font-semibold text-[#5c4033] flex items-center gap-2">
                <ShoppingBag /> Online Orders
              </h3>
              {selectedUser.ordersOnline.length === 0 ? (
                <p className="text-sm text-[#7b5e4b] italic">
                  No online orders
                </p>
              ) : (
                selectedUser.ordersOnline.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#fdf7f2] p-4 mt-2 rounded-lg border border-[#e7dcd3]"
                  >
                    <p className="text-sm text-[#7b5e4b]">
                      Time: {order.time} | Bill: ${order.bill} | Status:{" "}
                      {order.status}
                    </p>
                    <ul className="list-disc list-inside text-[#3f2c1d] mt-1">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.name} - {item.qty}x (${item.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          

          {/* Branch Orders */}
          <div className="mt-5">
            <h3 className="font-semibold text-[#5c4033] flex items-center gap-2">
              <ShoppingBag /> Branch Orders
            </h3>
            {selectedUser.ordersBranch.length === 0 ? (
              <p className="text-sm text-[#7b5e4b] italic">No branch orders</p>
            ) : (
              selectedUser.ordersBranch.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#fdf7f2] p-4 mt-2 rounded-lg border border-[#e7dcd3]"
                >
                  <p className="text-sm text-[#7b5e4b]">
                    Branch: {order.branch} | Time: {order.time} | Bill: $
                    {order.bill}
                  </p>
                  <p className="text-sm text-[#3f2c1d]">
                    Customer Name: {order.customerName || "Unknown"}
                  </p>
                  <p className="text-sm text-[#3f2c1d]">
                    Contact: {order.customerContact || "Unknown"}
                  </p>
                  <ul className="list-disc list-inside text-[#3f2c1d] mt-1">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} - {item.qty}x (${item.price})
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-[#7b5e4b] italic">
          Select a user to view details
        </p>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Coffee } from "lucide-react";
import Ready from "./Ready";
import Details from "./Details";

const StaffDashboard = () => {
  // Demo confirmed online orders
  const demoOrders = [
    {
      id: "order-001",
      customer_name: "John Doe",
      customer_phone: "+1 (555) 123-4567",
      order_type: "online",
      order_status: "confirmed",
      total_amount: 45.5,
      placed_at: "2025-08-14T09:30:00",
      delivery_address: {
        street: "123 Oak Street, Apt 4B",
        city: "Downtown",
        postal_code: "12345",
        instructions: "Ring twice, leave at door",
      },
      items: [
        { product_id: "p1", name: "Latte", quantity: 2, unit_price: 5.5 },
        { product_id: "p2", name: "Blueberry Muffin", quantity: 1, unit_price: 3.5 },
      ],
    },
    {
      id: "order-002",
      customer_name: "Mike Johnson",
      customer_phone: "+1 (555) 456-7890",
      order_type: "online",
      order_status: "confirmed",
      total_amount: 30.0,
      placed_at: "2025-08-14T10:15:00",
      delivery_address: {
        street: "456 Pine Ave, Suite 201",
        city: "Business District",
        postal_code: "12346",
        instructions: "Call when arrived",
      },
      items: [
        { product_id: "p3", name: "Cappuccino", quantity: 1, unit_price: 4.5 },
        { product_id: "p4", name: "Espresso", quantity: 3, unit_price: 3.5 },
      ],
    },
  ];

  const [orders, setOrders] = useState(demoOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleMarkDelivered = (orderId) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, order_status: "completed" } : o
    );
    setOrders(updated);
    setSelectedOrder(null);
    alert("Order marked as delivered!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f3ed] to-[#e9dfd0] p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center text-[#5c4033]">
        <Coffee className="mr-3 text-[#d4a373]" size={36} /> Staff Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Ready
          orders={orders}
          selectedOrder={selectedOrder}
          handleSelectOrder={handleSelectOrder}
        />
        <Details
          selectedOrder={selectedOrder}
          handleMarkDelivered={handleMarkDelivered}
        />
      </div>
    </div>
  );
};

export default StaffDashboard;

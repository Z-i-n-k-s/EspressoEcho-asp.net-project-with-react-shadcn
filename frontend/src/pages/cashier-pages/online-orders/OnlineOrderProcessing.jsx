import React, { useState, useEffect } from "react";
import { Coffee, Sparkles } from "lucide-react";
import OrderDetails from "./OrderDetails";
import PendingOrders from "./PendingOrders";

const OnlineOrderProcessing = () => {
  // Demo data with coffee shop products
  const demoOrders = [
    {
      id: "order-001",
      customer_name: "John Doe",
      customer_phone: "+1 (555) 123-4567",
      order_type: "delivery",
      order_status: "pending",
      total_amount: 18.5,
      placed_at: "2025-08-14T09:30:00",
      delivery_address: {
        street: "123 Oak Street, Apt 4B",
        city: "Downtown",
        postal_code: "12345",
        instructions: "Ring doorbell twice, leave at door",
      },
      estimated_delivery: "2025-08-14T10:15:00",
      delivery_fee: 2.99,
      items: [
        {
          product_id: "prod-1",
          name: "Cappuccino",
          image_url:
            "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop&crop=center",
          quantity: 2,
          unit_price: 4.5,
        },
        {
          product_id: "prod-2",
          name: "Chocolate Croissant",
          image_url:
            "https://images.unsplash.com/photo-1555507036-ab794f04d2fb?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 3.5,
        },
        {
          product_id: "prod-3",
          name: "Americano",
          image_url:
            "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 6.0,
        },
      ],
    },
    {
      id: "order-002",
      customer_name: "Sarah Wilson",
      customer_phone: "+1 (555) 987-6543",
      order_type: "pickup",
      order_status: "pending",
      total_amount: 15.75,
      placed_at: "2025-08-14T09:45:00",
      pickup_time: "2025-08-14T10:30:00",
      items: [
        {
          product_id: "prod-4",
          name: "Latte",
          image_url:
            "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=100&h=100&fit=crop&crop=center",
          quantity: 2,
          unit_price: 5.25,
        },
        {
          product_id: "prod-5",
          name: "Blueberry Muffin",
          image_url:
            "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 5.25,
        },
      ],
    },
    {
      id: "order-003",
      customer_name: "Mike Johnson",
      customer_phone: "+1 (555) 456-7890",
      order_type: "home_delivery",
      order_status: "pending",
      total_amount: 25.5,
      placed_at: "2025-08-14T10:15:00",
      delivery_address: {
        street: "789 Maple Drive, House #12",
        city: "Residential Area",
        postal_code: "12347",
        instructions: "Call when arrived, front door delivery",
        is_home: true,
        landmark: "Blue house with white fence",
      },
      estimated_delivery: "2025-08-14T11:00:00",
      delivery_fee: 3.5,
      items: [
        {
          product_id: "prod-1",
          name: "Cappuccino",
          image_url:
            "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 4.5,
        },
        {
          product_id: "prod-6",
          name: "Espresso",
          image_url:
            "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=100&h=100&fit=crop&crop=center",
          quantity: 3,
          unit_price: 3.5,
        },
        {
          product_id: "prod-7",
          name: "Avocado Toast",
          image_url:
            "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 7.5,
        },
      ],
    },
    {
      id: "order-004",
      customer_name: "Emily Chen",
      customer_phone: "+1 (555) 321-9876",
      order_type: "delivery",
      order_status: "pending",
      total_amount: 19.25,
      placed_at: "2025-08-14T10:30:00",
      delivery_address: {
        street: "456 Pine Avenue, Suite 201",
        city: "Business District",
        postal_code: "12346",
        instructions: "Call when arrived, office building reception",
      },
      estimated_delivery: "2025-08-14T11:15:00",
      delivery_fee: 2.99,
      items: [
        {
          product_id: "prod-4",
          name: "Latte",
          image_url:
            "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=100&h=100&fit=crop&crop=center",
          quantity: 3,
          unit_price: 5.25,
        },
        {
          product_id: "prod-2",
          name: "Chocolate Croissant",
          image_url:
            "https://images.unsplash.com/photo-1555507036-ab794f04d2fb?w=100&h=100&fit=crop&crop=center",
          quantity: 1,
          unit_price: 3.5,
        },
      ],
    },
  ];

  const demoInventory = [
    { product_id: "prod-1", quantity_on_hand: 15, reorder_level: 5 },
    { product_id: "prod-2", quantity_on_hand: 0, reorder_level: 3 }, // Out of stock
    { product_id: "prod-3", quantity_on_hand: 8, reorder_level: 2 },
    { product_id: "prod-4", quantity_on_hand: 12, reorder_level: 4 },
    { product_id: "prod-5", quantity_on_hand: 2, reorder_level: 3 }, // Low stock
    { product_id: "prod-6", quantity_on_hand: 0, reorder_level: 5 }, // Out of stock
    { product_id: "prod-7", quantity_on_hand: 6, reorder_level: 2 },
  ];

  const [orders, setOrders] = useState(demoOrders);
  const [selectedOrder, setSelectedOrder] = useState(demoOrders[0]);

  const getStockStatus = (productId, quantity) => {
    const stock = demoInventory.find((inv) => inv.product_id === productId);
    if (!stock || stock.quantity_on_hand < quantity) {
      return {
        status: "out",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }
    if (stock.quantity_on_hand <= stock.reorder_level) {
      return {
        status: "low",
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    }
    return {
      status: "good",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    };
  };

  const canConfirmOrder = (order) => {
    return order.items.every((item) => {
      const stock = demoInventory.find(
        (inv) => inv.product_id === item.product_id
      );
      return stock && stock.quantity_on_hand >= item.quantity;
    });
  };

  const handleConfirm = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId && canConfirmOrder(order)) {
        return { ...order, order_status: "confirmed" };
      }
      return order;
    });
    setOrders(updatedOrders);

    if (selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: "confirmed" });
    }

    alert("Order confirmed and sent to preparation!");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 pt-3 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 bg-amber-100 rounded-lg">
                <Coffee className="h-6 w-6 text-amber-700" />
                <Sparkles className="h-3 w-3 text-amber-500 absolute -top-0.5 -right-0.5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Brew & Bean
                </h1>
                <p className="text-sm text-gray-500">
                  Order Processing System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {orders.filter((o) => o.order_status === "pending").length}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Pending
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  $
                  {orders
                    .reduce((sum, o) => sum + o.total_amount, 0)
                    .toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Total Value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <PendingOrders
            orders={orders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            formatTime={formatTime}
          />

          {/* Order Details */}
          <OrderDetails
            selectedOrder={selectedOrder}
            demoInventory={demoInventory}
            getStockStatus={getStockStatus}
            canConfirmOrder={canConfirmOrder}
            handleConfirm={handleConfirm}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
};

export default OnlineOrderProcessing;
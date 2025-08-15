import React from "react";
import { Clock, MapPin, DollarSign, Package, ChevronRight } from "lucide-react";

const Ready = ({ orders, selectedOrder, handleSelectOrder }) => {
  const readyOrders = orders.filter((o) => o.order_status === "confirmed");
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Ready for Delivery
          </h2>
          <p className="text-gray-500 mt-1">
            {readyOrders.length} order{readyOrders.length !== 1 ? 's' : ''} waiting
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {readyOrders.length}
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {readyOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-500 text-center">
              No orders are ready for delivery at the moment.
            </p>
          </div>
        ) : (
          readyOrders.map((order) => (
            <div
              key={order.id}
              className={`group relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedOrder?.id === order.id
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg ring-2 ring-blue-100"
                  : "bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
              onClick={() => handleSelectOrder(order)}
            >
              {/* Selection Indicator */}
              {selectedOrder?.id === order.id && (
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r-full"></div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Customer Info */}
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4">
                      <span className="font-bold text-blue-600 text-lg">
                        {order.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {order.customer_name}
                      </h3>
                      <div className="flex items-center mt-1 text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm truncate max-w-48">
                          {order.delivery_address.street}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-white/60 px-3 py-1 rounded-full">
                        <Package className="w-4 h-4 text-gray-600 mr-1" />
                        <span className="text-sm font-medium text-gray-700">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-bold text-green-700">
                          {order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className={`ml-4 transition-all duration-200 ${
                  selectedOrder?.id === order.id 
                    ? 'text-blue-500 transform rotate-90' 
                    : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                selectedOrder?.id === order.id 
                  ? 'bg-blue-500/5' 
                  : 'bg-gray-900/0 group-hover:bg-gray-900/5'
              }`}></div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {readyOrders.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Revenue</span>
            <span className="font-bold text-green-600 text-lg">
              ${readyOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ready;
import React from "react";
import { Coffee, Calendar, MapPin, Package, RefreshCw, MoreVertical } from "lucide-react";

const OrderList = ({ filteredOrders, searchQuery, statusConfig, formatDate, RatingStars }) => {
  return (
    <>
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No orders found
          </h2>
          <p className="text-gray-600 mb-8">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start your coffee journey today!"}
          </p>
          {!searchQuery && (
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Order Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon;

            return (
              <div
                key={order.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${statusConfig[order.status].bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <StatusIcon
                        className={`w-6 h-6 ${statusConfig[order.status].textColor}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-lg text-gray-800">
                          {order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status].bgColor} ${statusConfig[order.status].textColor}`}
                        >
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.date)} at {order.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {order.address}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      ${order.total.toFixed(2)}
                    </div>
                    {order.status === "preparing" && order.timeRemaining && (
                      <div className="text-sm text-amber-600 font-semibold">
                        {order.timeRemaining} remaining
                      </div>
                    )}
                    {order.status === "delivered" && order.actualTime && (
                      <div className="text-sm text-green-600">
                        Delivered in {order.actualTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center space-x-5 bg-gray-50/70 rounded-xl p-5"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          ${item.price} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    {order.status === "preparing" && (
                      <div className="flex items-center space-x-2 text-amber-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          Being prepared with love
                        </span>
                      </div>
                    )}
                    {order.status === "ready" && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Ready for pickup!
                        </span>
                      </div>
                    )}
                    {order.status === "delivered" && (
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          Rate your experience:
                        </span>
                        <RatingStars
                          rating={order.rating || 0}
                          orderId={order.id}
                          editable={!order.rating}
                        />
                      </div>
                    )}
                    {order.status === "cancelled" && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">
                          Refunded: ${order.refundAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {(order.status === "ready" || order.status === "preparing") && (
                      <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                        {order.status === "ready" ? "Get Directions" : "Track Order"}
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200">
                        Reorder
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default OrderList;

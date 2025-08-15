import React from "react";
import { Clock, User, ShoppingBag, Timer, MapPin, Package, Home, Truck } from "lucide-react";

const PendingOrders = ({ orders, selectedOrder, setSelectedOrder, formatTime }) => {
  const getOrderTypeConfig = (orderType) => {
    switch (orderType) {
      case 'home_delivery':
        return {
          icon: Home,
          label: '🏠 Home',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800'
        };
      case 'delivery':
        return {
          icon: Truck,
          label: '🚚 Delivery',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
      case 'pickup':
        return {
          icon: Package,
          label: '🥤 Pickup',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      default:
        return {
          icon: Package,
          label: orderType,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  const pendingOrders = orders.filter(order => order.order_status === 'pending');

  const getOrderPriority = (placedAt) => {
    const now = new Date();
    const orderTime = new Date(placedAt);
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffMinutes > 15) return { level: 'high', color: 'bg-red-500', textColor: 'text-red-600', pulse: 'animate-pulse', label: '🔥 Hot!' };
    if (diffMinutes > 10) return { level: 'medium', color: 'bg-orange-500', textColor: 'text-orange-600', pulse: '', label: '☕ Warm' };
    return { level: 'normal', color: 'bg-green-500', textColor: 'text-green-600', pulse: '', label: '✨ Fresh' };
  };

  return (
    <div className="lg:col-span-1 h-full ">
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg border border-amber-200 h-[81vh] flex flex-col overflow-hidden">
        {/* Coffee Shop Header */}
        <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100/20 rounded-xl backdrop-blur-sm">
                <Timer className="h-5 w-5 text-amber-100" />
              </div>
              <div>
                <h2 className="text-amber-50 font-bold text-lg">☕ Brewing Orders</h2>
                <p className="text-amber-200 text-sm">{pendingOrders.length} orders in queue</p>
              </div>
            </div>
            <div className="bg-amber-100/20 px-3 py-1 rounded-full text-amber-100 text-sm font-bold backdrop-blur-sm">
              {pendingOrders.length}
            </div>
          </div>
        </div>

        {/* Enhanced Orders List */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {pendingOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <Timer className="h-12 w-12 text-amber-300 mb-3" />
              <p className="text-amber-700">No pending orders</p>
              <p className="text-amber-600 text-sm mt-1">Perfect time for a coffee break!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-amber-50 min-h-0">
              <div className="divide-y divide-amber-100">
                {pendingOrders.map((order) => {
                  const typeConfig = getOrderTypeConfig(order.order_type);
                  const priority = getOrderPriority(order.placed_at);
                  const TypeIcon = typeConfig.icon;

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-5 cursor-pointer transition-all duration-200 hover:bg-amber-100/50 ${
                        selectedOrder?.id === order.id 
                          ? 'bg-amber-100 border-r-4 border-amber-500 shadow-sm' 
                          : 'hover:shadow-sm'
                      }`}
                    >
                      {/* Coffee Shop Order Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${typeConfig.bgColor} flex-shrink-0`}>
                            <TypeIcon className={`h-4 w-4 ${typeConfig.textColor}`} />
                          </div>
                          <span className="font-semibold text-base">☕ #{order.id.slice(-3)}</span>
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${priority.color} ${priority.pulse}`} 
                               title={`${priority.label}`} />
                        </div>
                        <span className={`text-sm font-semibold ${typeConfig.textColor} ${typeConfig.bgColor} px-3 py-1 rounded-full flex-shrink-0`}>
                          {typeConfig.label}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center space-x-2 mb-3">
                        <User className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-amber-900">👤 {order.customer_name}</span>
                      </div>

                      {/* Location */}
                      {order.delivery_address && (
                        <div className="flex items-start space-x-2 mb-3">
                          <MapPin className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-amber-800 leading-relaxed break-words">
                            📍 {order.delivery_address.street}, {order.delivery_address.city}
                          </span>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="flex items-center space-x-3 mb-3">
                        <ShoppingBag className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        <span className="text-sm text-amber-800">
                          🛍️ {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-amber-500">•</span>
                        <span className="text-sm font-semibold text-amber-900">
                          💰 ${order.total_amount?.toFixed(2) || '0.00'}
                        </span>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center justify-between bg-amber-100/70 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-700 flex-shrink-0" />
                          <span className="text-sm text-amber-800">
                            🕐 {formatTime ? formatTime(order.placed_at) : new Date(order.placed_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <span className={`text-sm font-medium ${priority.textColor}`}>
                            {Math.floor((new Date() - new Date(order.placed_at)) / (1000 * 60))}m ago
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
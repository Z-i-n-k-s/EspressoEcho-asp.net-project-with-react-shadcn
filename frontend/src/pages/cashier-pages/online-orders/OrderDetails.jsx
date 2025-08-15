import React from "react";
import { Coffee, CheckCircle, XCircle, User, Calendar, Package, AlertTriangle, Clock, MapPin, Phone, Truck, Home } from "lucide-react";

const OrderDetails = ({ 
  selectedOrder, 
  demoInventory, 
  getStockStatus, 
  canConfirmOrder, 
  handleConfirm, 
  formatTime 
}) => {
  const getOrderAge = (placedAt) => {
    const now = new Date();
    const orderTime = new Date(placedAt);
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    return diffMinutes;
  };

  const getOrderTypeConfig = (orderType) => {
    switch (orderType) {
      case 'home_delivery':
        return {
          icon: Home,
          label: 'Home Delivery',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          badgeBg: 'bg-purple-100',
          badgeText: 'text-purple-800'
        };
      case 'delivery':
        return {
          icon: Truck,
          label: 'Business Delivery',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          badgeBg: 'bg-blue-100',
          badgeText: 'text-blue-800'
        };
      case 'pickup':
        return {
          icon: Package,
          label: 'Store Pickup',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          badgeBg: 'bg-green-100',
          badgeText: 'text-green-800'
        };
      default:
        return {
          icon: Package,
          label: orderType,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          badgeBg: 'bg-gray-100',
          badgeText: 'text-gray-800'
        };
    }
  };

  const orderAge = getOrderAge(selectedOrder.placed_at);
  const orderTypeConfig = getOrderTypeConfig(selectedOrder.order_type);
  const IconComponent = orderTypeConfig.icon;

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Enhanced Header with gradient */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Order #{selectedOrder.id.slice(-3)}</h2>
                <div className="flex items-center space-x-6 mt-2 text-sm text-gray-200">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-mono text-sm">{selectedOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatTime(selectedOrder.placed_at)} ({orderAge}m ago)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">${selectedOrder.total_amount.toFixed(2)}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${orderTypeConfig.badgeBg} ${orderTypeConfig.badgeText} mt-2 shadow-sm`}>
                <IconComponent className="h-4 w-4 mr-2" />
                {orderTypeConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Delivery/Pickup Information */}
        <div className="p-6 border-b border-gray-100">
          {(selectedOrder.order_type === 'delivery' || selectedOrder.order_type === 'home_delivery') ? (
            <div className={`${orderTypeConfig.bgColor} ${orderTypeConfig.borderColor} border-l-4 p-4 rounded-lg shadow-sm`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <IconComponent className={`h-5 w-5 ${orderTypeConfig.textColor} mt-1 flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <h4 className={`${orderTypeConfig.textColor} font-semibold text-base mb-2`}>
                      {selectedOrder.order_type === 'home_delivery' ? 'Home Delivery' : 'Business Delivery'}
                    </h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p className="font-medium">{selectedOrder.delivery_address.street}</p>
                      <p className="text-gray-600">{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.postal_code}</p>
                      {selectedOrder.delivery_address.landmark && (
                        <p className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{selectedOrder.delivery_address.landmark}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                  <p className={`${orderTypeConfig.textColor} font-semibold text-sm`}>Est. Delivery</p>
                  <p className="text-gray-700 font-medium">{formatTime(selectedOrder.estimated_delivery)}</p>
                </div>
              </div>
              {selectedOrder.delivery_address.instructions && (
                <div className="mt-3 bg-white/70 p-3 rounded-lg border border-white/50">
                  <p className="text-sm text-gray-700 italic">
                    <span className="font-medium">Instructions:</span> "{selectedOrder.delivery_address.instructions}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`${orderTypeConfig.bgColor} ${orderTypeConfig.borderColor} border-l-4 p-4 rounded-lg shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-5 w-5 ${orderTypeConfig.textColor}`} />
                  <div>
                    <h4 className={`${orderTypeConfig.textColor} font-semibold text-base`}>Store Pickup</h4>
                    <p className="text-sm text-gray-600">Customer collection</p>
                  </div>
                </div>
                <div className="text-right bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                  <p className={`${orderTypeConfig.textColor} font-semibold text-sm`}>Pickup Time</p>
                  <p className="text-gray-700 font-medium">{formatTime(selectedOrder.pickup_time)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Alert */}
        {orderAge > 15 && selectedOrder.order_status === 'pending' && (
          <div className="mx-6 mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-red-800 font-semibold">Order is taking longer than usual</p>
                <p className="text-red-600 text-sm">Placed {orderAge} minutes ago - consider prioritizing</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-3 text-gray-600" />
              Order Items
            </h3>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {selectedOrder.items.length} items
            </div>
          </div>

          {/* Enhanced Items List */}
          <div className="space-y-4">
            {selectedOrder.items.map((item, index) => {
              const stockInfo = getStockStatus(item.product_id, item.quantity);
              const stock = demoInventory.find((inv) => inv.product_id === item.product_id);
              
              return (
                <div
                  key={item.product_id}
                  className={`border rounded-xl p-4 transition-all duration-300 hover:shadow-md ${
                    stockInfo.status === 'out' 
                      ? 'border-red-200 bg-red-50 shadow-sm' 
                      : stockInfo.status === 'low' 
                      ? 'border-amber-200 bg-amber-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Enhanced Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 bg-slate-700 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base">{item.name}</h4>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-1">
                        <span>Quantity: <span className="font-medium">{item.quantity}</span></span>
                        <span>Unit Price: <span className="font-medium">${item.unit_price.toFixed(2)}</span></span>
                      </div>
                    </div>
                    
                    {/* Price and Stock */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-lg">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </p>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                        stockInfo.status === 'out' 
                          ? 'bg-red-100 text-red-800' 
                          : stockInfo.status === 'low' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {stockInfo.status === 'out' && <XCircle className="h-4 w-4 mr-1" />}
                        {stockInfo.status === 'good' && <CheckCircle className="h-4 w-4 mr-1" />}
                        {stockInfo.status === 'low' && <AlertTriangle className="h-4 w-4 mr-1" />}
                        {stockInfo.status === 'out' ? 'Out of Stock' : 
                         stockInfo.status === 'low' ? `Low Stock (${stock?.quantity_on_hand})` : 
                         `In Stock (${stock?.quantity_on_hand})`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Action Buttons */}
          {selectedOrder.order_status === "pending" && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              {canConfirmOrder(selectedOrder) ? (
                <button
                  onClick={() => handleConfirm(selectedOrder.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    Confirm Order & Send to Preparation
                  </div>
                </button>
              ) : (
                <div className="w-full bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl font-semibold text-base text-center shadow-sm">
                  <div className="flex items-center justify-center">
                    <XCircle className="h-5 w-5 mr-3" />
                    Cannot Confirm - Insufficient Stock
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedOrder.order_status === "confirmed" && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="w-full bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl font-semibold text-base text-center shadow-sm">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  Order Confirmed - In Preparation
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
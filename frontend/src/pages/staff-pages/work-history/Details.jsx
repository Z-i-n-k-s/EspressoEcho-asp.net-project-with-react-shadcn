import React from 'react';
import { X, Calendar, User, ShoppingBag, DollarSign, Clock, Package, CheckCircle, MapPin, Phone, Coffee } from "lucide-react";

const Details = ({ selectedWork, setSelectedWork }) => {
  if (!selectedWork) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'delivery':
      case 'home_delivery':
        return <Package className="text-purple-600" size={18} />;
      case 'pickup':
        return <Coffee className="text-green-600" size={18} />;
      default:
        return <ShoppingBag className="text-blue-600" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 animate-in">
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setSelectedWork(null)}
        >
          <X size={20} />
        </button>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ShoppingBag className="text-amber-600" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              Order Details
            </h3>
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
            {selectedWork.id}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Customer & Order Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="text-blue-600" size={18} />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                <p className="font-semibold text-gray-800">{selectedWork.customer_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedWork.customer_phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-green-600" size={18} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order Placed</p>
                <p className="font-semibold text-gray-800">{formatDate(selectedWork.placed_at)}</p>
                <p className="text-sm text-gray-600">{formatTime(selectedWork.placed_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {getOrderTypeIcon(selectedWork.order_type)}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order Type</p>
                <p className="font-semibold text-gray-800 capitalize">{selectedWork.order_type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Info & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="text-green-600" size={18} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                <p className="font-semibold text-gray-800">${selectedWork.total_amount.toFixed(2)}</p>
                {selectedWork.delivery_fee && (
                  <p className="text-sm text-gray-500">Incl. delivery fee: ${selectedWork.delivery_fee.toFixed(2)}</p>
                )}
              </div>
            </div>

            {(selectedWork.order_type === 'delivery' || selectedWork.order_type === 'home_delivery') && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-red-500 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Address</p>
                  <p className="font-semibold text-gray-800">{selectedWork.delivery_address.street}</p>
                  <p className="text-sm text-gray-600">{selectedWork.delivery_address.city}, {selectedWork.delivery_address.postal_code}</p>
                  {selectedWork.delivery_address.landmark && (
                    <p className="text-sm text-blue-600 mt-1">📍 {selectedWork.delivery_address.landmark}</p>
                  )}
                  {selectedWork.delivery_address.instructions && (
                    <p className="text-sm text-amber-700 mt-1 bg-amber-50 p-2 rounded border">
                      💡 {selectedWork.delivery_address.instructions}
                    </p>
                  )}
                  {selectedWork.estimated_delivery && (
                    <p className="text-sm text-gray-500 mt-1">
                      Est. delivery: {formatTime(selectedWork.estimated_delivery)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedWork.order_type === 'pickup' && selectedWork.pickup_time && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="text-orange-600" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup Time</p>
                  <p className="font-semibold text-gray-800">{formatTime(selectedWork.pickup_time)}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-500" size={18} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
              </div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedWork.order_status)}`}>
                {selectedWork.order_status}
              </span>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={18} />
            Items Ordered ({selectedWork.items.length})
          </h4>
          <div className="space-y-3">
            {selectedWork.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Unit Price: ${item.unit_price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${(item.quantity * item.unit_price).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">total</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Subtotal:</span>
              <span>${(selectedWork.total_amount - (selectedWork.delivery_fee || 0)).toFixed(2)}</span>
            </div>
            {selectedWork.delivery_fee && (
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Delivery Fee:</span>
                <span>${selectedWork.delivery_fee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-semibold text-gray-800 pt-2 border-t">
              <span>Total:</span>
              <span>${selectedWork.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
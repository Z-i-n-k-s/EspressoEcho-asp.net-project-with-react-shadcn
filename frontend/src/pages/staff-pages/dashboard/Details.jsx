import React from "react";
import { CheckCircle, User, Phone, MapPin, MessageSquare, Package } from "lucide-react";

const Details = ({ selectedOrder, handleMarkDelivered }) => {
  return (
    <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      {selectedOrder ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Order Details
            </h2>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Active</span>
            </div>
          </div>

          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Customer Details Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Customer Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                Delivery Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold text-gray-900 leading-relaxed">
                      {selectedOrder.delivery_address.street}<br />
                      {selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.postal_code}
                    </p>
                  </div>
                </div>
                {selectedOrder.delivery_address.instructions && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <MessageSquare className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Instructions</p>
                      <p className="font-medium text-gray-700">{selectedOrder.delivery_address.instructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-600" />
              Order Items
            </h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.unit_price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <span className="text-xl font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                ${selectedOrder.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleMarkDelivered(selectedOrder.id)}
            className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <CheckCircle className="mr-3 w-6 h-6" />
            Mark as Delivered
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Order Selected</h3>
          <p className="text-gray-500 text-center max-w-md">
            Select an order from the list to view detailed information and manage delivery status.
          </p>
        </div>
      )}
    </div>
  );
};

export default Details;
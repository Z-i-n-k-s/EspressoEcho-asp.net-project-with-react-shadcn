import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Coffee,
  Clock,
  Star,
} from "lucide-react";

const UserCart = () => {
  // Demo cart data with enhanced properties
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Cappuccino",
      description: "Rich espresso with steamed milk foam",
      price: 3.5,
      quantity: 2,
      category: "Beverage",
      rating: 4.8,
      image_url:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
    },
    {
      id: "2",
      name: "Blueberry Muffin",
      description: "Freshly baked with juicy blueberries",
      price: 2.75,
      quantity: 1,
      category: "Bakery",
      rating: 4.6,
      image_url:
        "https://images.unsplash.com/photo-1605479448657-d8c5a6445f89?w=500",
    },
    {
      id: "3",
      name: "Iced Latte",
      description: "Smooth espresso with chilled milk & ice",
      price: 4.25,
      quantity: 1,
      category: "Beverage",
      rating: 4.7,
      image_url:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
    },
  ]);

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change);
            return newQuantity === 0
              ? null
              : { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    setIsOrdering(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOrderPlaced(true);
    setIsOrdering(false);

    // Reset after showing success
    setTimeout(() => {
      setCartItems([]);
      setOrderPlaced(false);
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto animate-pulse">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-green-600 text-4xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-600 mb-4">
            Your delicious order is being prepared
          </p>
          <div className="flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Est. 15-20 minutes</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Header */}
      <div className="text-center pt-16 pb-12 px-4 sm:px-6">
        <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
          <h1 className="text-4xl md:text-5xl font-bold">Your Cart</h1>
        </div>
        <p className="text-lg text-gray-600 mb-6">Brew House Coffee</p>

        {/* Cart Badge */}
        <div className="inline-flex items-center space-x-2 bg-amber-100 px-5 py-2 rounded-full shadow-md">
          <ShoppingCart className="w-5 h-5 text-amber-700" />
          <span className="font-semibold text-amber-700">
            {totalItems} items
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items to get started!
            </p>
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-3"></span>
                Order Items
              </h2>

              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-7 border border-white/20"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-start gap-5">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">
                                {item.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price & Controls */}
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-amber-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-amber-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 mt-16">
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 sticky top-32 border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></span>
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span>$0.50</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>${(totalPrice + 0.5 - 1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isOrdering ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-5 h-5" />
                      <span>Place Order</span>
                    </>
                  )}
                </button>

                <div className="mt-5 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Ready in 15-20 minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCart;

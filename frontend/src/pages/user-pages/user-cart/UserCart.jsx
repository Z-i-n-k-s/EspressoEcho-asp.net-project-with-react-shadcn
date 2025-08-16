import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Coffee, Clock } from "lucide-react";
import Header from "@/pages/user-without-login/componets/Header";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Cappuccino",
      description: "Rich espresso with steamed milk foam",
      price: 3.5,
      quantity: 2,
      category: "Beverage",
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
      image_url:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
    },
  ]);

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change);
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setCartItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderPlaced(true);
    setIsOrdering(false);
    setTimeout(() => {
      setCartItems([]);
      setOrderPlaced(false);
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f5f0e6]">
        <Header />
        <div className="max-w-3xl mx-auto mt-24 bg-[#d9c4a8] rounded-3xl shadow-lg p-8 text-center animate-pulse">
          <div className="w-20 h-20 bg-[#c5a76d] rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-white text-4xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-[#4b3621] mb-2">Order Placed!</h2>
          <p className="text-[#4b3621] mb-4">Your delicious order is being prepared</p>
          <div className="flex items-center justify-center text-[#4b3621]">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Est. 15-20 minutes</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5c185] w-full">
      <Header />

      {/* Hero Section */}
      <div className="text-center pt-24 pb-12 px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#4b3621] mt-10 mb-2">Your Cart</h1>
        <p className="text-lg text-[#4b3621] mb-6">Espresso Echo</p>
        <div className="inline-flex items-center space-x-2 bg-[#d9c4a8] px-5 py-2 rounded-full shadow-md">
          <ShoppingCart className="w-5 h-5 text-[#4b3621]" />
          <span className="font-semibold text-[#4b3621]">{totalItems} items</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex gap-10">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-[#d9c4a8] rounded-2xl shadow-md p-6 flex gap-5">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#4b3621]">{item.name}</h3>
                    <p className="text-sm text-[#4b3621]">{item.description}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-[#4b3621]">${(item.price * item.quantity).toFixed(2)}</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-[#c5a76d] hover:bg-[#b28c5f] flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="w-12 text-center font-semibold text-[#4b3621]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-[#c5a76d] hover:bg-[#b28c5f] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-96 sticky top-32">
          <div className="bg-[#d9c4a8] rounded-2xl shadow-md p-6 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-[#4b3621]">Order Summary</h3>
            <div className="flex justify-between text-[#4b3621]">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#4b3621]">
              <span>Service Fee</span>
              <span>$0.50</span>
            </div>
            <div className="border-t border-[#b28c5f] pt-4 flex justify-between font-bold text-[#4b3621] text-lg">
              <span>Total</span>
              <span>${(totalPrice + 0.5).toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="w-full bg-[#4b3621] hover:bg-[#362314] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isOrdering ? "Processing..." : <><Coffee className="w-5 h-5" /> Place Order</>}
            </button>
            <div className="text-sm text-[#4b3621] flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Ready in 15-20 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCart;

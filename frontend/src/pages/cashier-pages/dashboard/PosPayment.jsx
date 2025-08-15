import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Coffee,
  Trash2,
  Receipt,
  CheckCircle,
} from "lucide-react";

const PosPayment = ({
  cart = [],
  updateQuantity = () => {},
  onPay = () => {},
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.base_price * item.quantity,
    0
  );
  const taxAmount = totalAmount * 0.08;
  const finalTotal = totalAmount + taxAmount;
  const handlePayment = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);

      // Clear the cart after payment
      clearCart();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  const removeFromCart = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      updateQuantity(id, -item.quantity);
    }
  };

  const clearCart = () => {
    cart.forEach((item) => {
      updateQuantity(item.id, -item.quantity);
    });
  };

  const paymentOptions = [
    {
      value: "cash",
      label: "Cash Payment",
      icon: Banknote,
      color: "text-green-600",
      description: "Pay with physical cash",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      value: "card",
      label: "Credit/Debit Card",
      icon: CreditCard,
      color: "text-blue-600",
      description: "Visa, Mastercard, etc.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      value: "upi",
      label: "Digital Wallet",
      icon: Smartphone,
      color: "text-purple-600",
      description: "UPI, PayPal, Apple Pay",
      gradient: "from-amber-600 to-orange-600",
    },
  ];

  // Sample cart data for demo purposes only
  const sampleCart = [
    {
      id: 1,
      name: "Espresso Americano",
      base_price: 4.5,
      quantity: 2,
      image_url:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "Caramel Macchiato",
      base_price: 5.75,
      quantity: 1,
      image_url:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center",
    },
  ];

  // Use actual cart if provided, otherwise show empty state
  const displayCart = cart;
  const displayTotal = finalTotal;

  return (
    <div className="w-[520px] bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-yellow-50/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/70 overflow-hidden relative">
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-amber-700">
              Order confirmed • ${displayTotal.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Coffee-Themed Header */}
      <div className="bg-gradient-to-br from-amber-800 via-orange-700 to-yellow-800 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute top-8 right-8 w-6 h-6 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-6 left-12 w-4 h-4 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-8 right-16 w-5 h-5 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1 text-amber-50">
                  Coffee Cart
                </h2>
                <p className="text-white/90 text-sm">
                  {displayCart.length}{" "}
                  {displayCart.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl mb-3 border border-white/30">
                <span className="text-lg font-bold text-amber-50">
                  {displayCart.length}
                </span>
              </div>
              {displayCart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-white/80 hover:text-white text-xs flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coffee Bean Decorations */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full transform rotate-45"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full transform -rotate-12"></div>
      </div>

      {/* Cart Items */}
      <div className="p-8">
        <div className="max-h-96 overflow-y-auto space-y-5 mb-8 custom-scrollbar">
          {displayCart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-amber-200/50">
                <Coffee className="w-14 h-14 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-amber-700">
                Add some delicious coffee to get started
              </p>
            </div>
          ) : (
            displayCart.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-xl rounded-3xl p-6 transition-all duration-300 border border-amber-200/60 hover:border-amber-300/80"
              >
                {/* Main Content Layout */}
                <div className="flex items-start gap-6">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white group-hover:ring-amber-100 transition-all duration-300 bg-gradient-to-br from-amber-100 to-orange-100">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center">
                        <Coffee className="w-8 h-8 text-amber-600" />
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 transform"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Info - Flexible Width */}
                  <div className="flex-1 min-w-0 mr-4">
                    <h4 className="font-bold text-base text-amber-900 mb-1 group-hover:text-amber-800 transition-colors leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-amber-700 text-sm font-semibold mb-2">
                      ${item.base_price.toFixed(2)} each
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-sm"></div>
                      <span className="text-xs text-green-700 font-semibold">
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="text-right flex-shrink-0 min-w-[100px]">
                    <div className="font-bold text-amber-900 text-lg mb-1">
                      ${(item.base_price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-xs text-amber-600 font-medium">
                      {item.quantity} × ${item.base_price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls - Positioned Below */}
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-2 shadow-lg border border-amber-200/60">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-105 shadow-sm border border-red-200/50"
                      title="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="font-bold text-amber-900 text-base min-w-[40px] text-center px-2 py-1 bg-white/80 rounded-lg border border-amber-200/60 shadow-inner">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 hover:from-amber-200 hover:to-orange-300 flex items-center justify-center text-amber-700 hover:text-amber-800 transition-all duration-200 hover:scale-105 shadow-sm border border-amber-200/50"
                      title="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400/10 to-orange-400/10" />
                </div>
              </div>
            ))
          )}
        </div>

        {displayCart.length > 0 && (
          <>
            {/* Coffee-Themed Summary */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-200/70 shadow-lg">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-amber-800">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span className="font-semibold">Tax (8%)</span>
                  <span className="font-bold">${taxAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-amber-900 pt-4 border-t-2 border-amber-300/60">
                <span>Total</span>
                <span className="bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                  ${displayTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Coffee-Themed Payment Methods */}
            <div className="mb-6">
              <label className="block text-base font-bold text-amber-900 mb-4  items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-3 h-3 text-white" />
                </div>
                Payment Method
              </label>
              <div className="space-y-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                        paymentMethod === option.value
                          ? "border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg ring-2 ring-amber-200/40"
                          : "border-amber-200 hover:border-amber-300 hover:bg-amber-50/50 bg-white/70 backdrop-blur-sm"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
                          paymentMethod === option.value
                            ? `bg-gradient-to-br ${option.gradient}`
                            : "bg-gradient-to-br from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            paymentMethod === option.value
                              ? "text-white"
                              : "text-amber-700"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-amber-900 text-sm mb-1">
                          {option.label}
                        </div>
                        <div className="text-amber-700 font-medium text-xs">
                          {option.description}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          paymentMethod === option.value
                            ? "border-amber-600 bg-amber-600 shadow-md"
                            : "border-amber-300 hover:border-amber-400"
                        }`}
                      >
                        {paymentMethod === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Coffee-Themed Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                isProcessing
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-700 hover:from-amber-800 hover:via-orange-800 hover:to-yellow-800 text-white border border-amber-600/50"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Coffee className="w-5 h-5" />
                  Complete Order • ${displayTotal.toFixed(2)}
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Custom Coffee Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #fef3c7, #fed7aa);
          border-radius: 6px;
          border: 1px solid #f3e8c8;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #d97706, #ea580c);
          border-radius: 6px;
          border: 1px solid #c2410c;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #b45309, #c2410c);
        }
      `}</style>
    </div>
  );
};

export default PosPayment;

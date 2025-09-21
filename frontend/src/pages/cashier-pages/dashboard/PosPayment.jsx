import React, { useState } from "react";
import {
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Coffee,
  Trash2,
  CheckCircle,
} from "lucide-react";

const PosPayment = ({ cart = [], updateQuantity = () => {}, onPay = async () => {} }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.base_price * item.quantity, 0);
  const taxAmount = totalAmount * 0.08;
  const finalTotal = totalAmount + taxAmount;

  const removeFromCart = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) updateQuantity(id, -item.quantity);
  };

  const clearCart = () => {
    cart.forEach((item) => updateQuantity(item.id, -item.quantity));
  };

  const handlePayment = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      // Call parent onPay with cart & payment method
      const response = await onPay(cart, paymentMethod);

      // Save backend order ID for display
      if (response?.id) setOrderId(response.id);

      setShowSuccess(true);
      clearCart();

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentOptions = [
    { value: "cash", label: "Cash Payment", icon: Banknote, gradient: "from-emerald-500 to-green-600" },
    { value: "card", label: "Credit/Debit Card", icon: CreditCard, gradient: "from-blue-500 to-indigo-600" },
    { value: "upi", label: "Digital Wallet", icon: Smartphone, gradient: "from-amber-600 to-orange-600" },
  ];

  return (
    <div className="w-[520px] bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-yellow-50/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/70 overflow-hidden relative">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce shadow-2xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-amber-900">
            Payment Successful!
          </h3>
          <p className="text-amber-700">
            Order confirmed {orderId && `(ID: ${orderId})`} • ${finalTotal.toFixed(2)}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-amber-800 via-orange-700 to-yellow-800 p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-50">Coffee Cart</h2>
              <p className="text-white/90 text-sm">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-white/80 hover:text-white text-xs flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
            >
              <Trash2 className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-8 max-h-[500px] overflow-y-auto space-y-5">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-amber-200/50">
              <Coffee className="w-14 h-14 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-amber-700">Add some coffee to get started</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="relative bg-white/90 rounded-3xl p-6 shadow border border-amber-200/60">
              <div className="flex items-start gap-6">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shadow" />
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900">{item.name}</h4>
                  <p className="text-amber-700 text-sm mb-1">${item.base_price.toFixed(2)} each</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 font-semibold">Available</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 min-w-[100px]">
                  <div className="font-bold text-amber-900 text-lg mb-1">
                    ${(item.base_price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-xs text-amber-600 font-medium">
                    {item.quantity} × ${item.base_price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-2 border border-amber-200/60">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-red-100 rounded-lg">-</button>
                  <div className="font-bold px-4">{item.quantity}</div>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-amber-100 rounded-lg">+</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary & Payment */}
      {cart.length > 0 && (
        <div className="p-8">
          <div className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-200/70 shadow-lg">
            <div className="flex justify-between text-amber-800 mb-2">
              <span className="font-semibold">Subtotal</span>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-amber-800 mb-2">
              <span className="font-semibold">Tax (8%)</span>
              <span className="font-bold">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-amber-900 pt-4 border-t-2 border-amber-300/60">
              <span>Total</span>
              <span className="bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer ${
                    paymentMethod === option.value
                      ? "border-amber-400 bg-amber-50 shadow"
                      : "border-amber-200 bg-white/70"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === option.value ? `bg-gradient-to-br ${option.gradient}` : "bg-amber-100"}`}>
                    <Icon className={paymentMethod === option.value ? "text-white" : "text-amber-700"} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-amber-900">{option.label}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === option.value ? "border-amber-600 bg-amber-600" : "border-amber-300"}`}></div>
                </label>
              );
            })}
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-base shadow-xl ${
              isProcessing ? "bg-amber-400 cursor-not-allowed" : "bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-700 text-white"
            }`}
          >
            {isProcessing ? "Processing Payment..." : `Complete Order • $${finalTotal.toFixed(2)}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PosPayment;

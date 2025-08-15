import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

const CartIcon = ({ count = 0, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const handleCartClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="relative">
      <div 
        className="relative cursor-pointer group"
        onClick={handleCartClick}
      >
        {/* Main cart button with enhanced styling */}
        <div className="relative p-3 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-200/50">
          <ShoppingCart 
            size={24} 
            className={`text-gray-700 group-hover:text-amber-600 transition-all duration-200 ${
              isAnimating ? 'animate-bounce' : ''
            }`}
          />
          
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 to-orange-400/0 group-hover:from-amber-400/10 group-hover:to-orange-400/10 transition-all duration-300"></div>
        </div>

        {/* Enhanced badge with better positioning and styling */}
        {count > 0 && (
          <div className="absolute -top-2 -right-2">
            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold shadow-lg shadow-red-500/30 border-2 border-white transition-all duration-300 ${
              isAnimating ? 'animate-pulse scale-110' : ''
            }`}>
              {count > 99 ? '99+' : count}
            </span>
          </div>
        )}
        
        {/* Ripple effect for cart updates */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 opacity-30 animate-ping pointer-events-none"></div>
        )}
      </div>

      {/* Enhanced tooltip */}
      <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
        <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-xl border border-gray-700 whitespace-nowrap">
          <div className="text-center">
            <div className="font-semibold">Shopping Cart</div>
            <div className="text-xs text-gray-300">{count} {count === 1 ? 'item' : 'items'}</div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

// Demo component to showcase the CartIcon
const CartIconDemo = () => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const clearCart = () => {
    setCartCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/20 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced Cart Icon</h1>
          <p className="text-xl text-gray-600">Clean, modern design with smooth animations</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
          <div className="text-center">
            <div className="inline-block mb-8">
              <CartIcon 
                count={cartCount} 
                onClick={() => console.log('Cart clicked!')}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Cart Items: {cartCount}
              </h3>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={addToCart}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 hover:-translate-y-0.5 transform"
                >
                  Add Item
                </button>
                
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-gray-200 hover:shadow-xl hover:shadow-gray-300 hover:-translate-y-0.5 transform"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Features:</h4>
          <ul className="space-y-2 text-gray-600">
            <li>• Smooth hover animations with scale effects</li>
            <li>• Animated badge that pulses when count changes</li>
            <li>• Enhanced tooltip with item count</li>
            <li>• Modern gradient styling with subtle glows</li>
            <li>• Responsive design that works on all devices</li>
            <li>• Clean, minimalist appearance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartIcon;
// CashierDashboard.jsx
import React, { useState } from 'react';
import PosDisplay from './PosDisplay';
import PosPayment from './PosPayment';

const CashierDashboard = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev
      .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">☕ Coffee House POS</h1>
          <p className="text-amber-700 text-base">Cashier Dashboard</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <PosDisplay addToCart={addToCart} />
          <PosPayment cart={cart} updateQuantity={updateQuantity} />
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;

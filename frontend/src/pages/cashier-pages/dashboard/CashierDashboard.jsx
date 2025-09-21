import React, { useState, useEffect } from 'react';
import PosDisplay from './PosDisplay';
import PosPayment from './PosPayment';
import productApi from '@/api/Product_api';
import offlineOrdersApi from '@/api/Offline_order_api';


const CashierDashboard = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

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

  // Handle order submission
  const handlePayment = async (cartItems, paymentMethod) => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.base_price,
        })),
        payment_method: paymentMethod,
        total_amount: cartItems.reduce((sum, item) => sum + item.base_price * item.quantity, 0)
      };

      await offlineOrdersApi.createOrder(orderData);
      // Clear cart after successful order
      setCart([]);
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">☕ Coffee House POS</h1>
          <p className="text-amber-700 text-base">Cashier Dashboard</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <PosDisplay products={products} addToCart={addToCart} />
          <PosPayment
            cart={cart}
            updateQuantity={updateQuantity}
            onPay={handlePayment}
          />
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;

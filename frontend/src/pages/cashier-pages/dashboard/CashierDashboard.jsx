import React, { useState, useEffect } from 'react';
import PosDisplay from './PosDisplay';
import PosPayment from './PosPayment';
import productApi from '@/api/Product_api';
import offlineOrdersApi from '@/api/Offline_order_api';
import { useSelector } from 'react-redux';


const CashierDashboard = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
 const user = useSelector((state) => state.user.user);
  const branchId = user?.employee?.branch_id;
const cashierID = user.id
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
      // Prevent quantity exceeding inventory
      if (exists.quantity >= product.quantity_on_hand) {
        alert(`Cannot add more than ${product.quantity_on_hand} items for "${product.name}"`);
        return prev;
      }
      return prev.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    if (product.quantity_on_hand === 0) {
      alert(`"${product.name}" is out of stock`);
      return prev;
    }
    return [...prev, { ...product, quantity: 1 }];
  });
};


  const updateQuantity = (id, delta) => {
  setCart(prev => {
    return prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        // Prevent exceeding stock
        if (newQty > item.quantity_on_hand) {
          alert(`Cannot exceed stock: ${item.quantity_on_hand}`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0);
  });
};


  // Handle order submission
  const handlePayment = async (cartItems, paymentMethod) => {
  try {
    const orderData = {
      branch_id: branchId,       // Add branch
      cashier_id: cashierID,     // Add cashier
      payment_method: paymentMethod,
      total_amount: cartItems.reduce((sum, item) => sum + item.base_price * item.quantity, 0),
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.base_price,  // backend expects this field
      }))
    };

    await offlineOrdersApi.createOrder(orderData);
    setCart([]); // Clear cart after success
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

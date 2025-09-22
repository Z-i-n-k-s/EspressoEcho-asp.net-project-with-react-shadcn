import React, { useState, useContext, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Coffee,
  Clock,
  PlusCircle,
  X,
  CheckCircle
} from "lucide-react";
import Header from "@/pages/user-without-login/componets/Header";
import { CartContext } from "../../user-without-login/componets/CartContext";
import { useSelector } from "react-redux";
import toppingApi from "@/api/Toppings_api";
import ordersApi from "@/api/Customer_Oder_api";

const UserCart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    addToCart,
  } = useContext(CartContext);
const user = useSelector((state) => state.user.user);
  const customerId = user?.customer?.id;

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showToppingsModal, setShowToppingsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toppingMessage, setToppingMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [availableToppings, setAvailableToppings] = useState([]);



  const totalPrice = getCartTotal();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch available toppings for a product
  useEffect(() => {
    const fetchToppings = async () => {
      if (selectedItem) {
        try {
          const res = await toppingApi.getToppingsByProduct(selectedItem.id);
          if (res.data.success) {
            setAvailableToppings(res.data.data);
          } else {
            setAvailableToppings([]);
          }
        } catch (err) {
          console.error("Failed to load toppings:", err);
          setAvailableToppings([]);
        }
      }
    };

    if (showToppingsModal && selectedItem) {
      fetchToppings();
    }
  }, [showToppingsModal, selectedItem]);

  const handleRemoveItem = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(id);
    }
  };

  const handleAddToppingClick = (item) => {
    setSelectedItem(item);
    setShowToppingsModal(true);
  };

  const handleAddTopping = (topping) => {
    // Create updated item with topping
    const itemWithTopping = {
      ...selectedItem,
      toppings: [...(selectedItem.toppings || []), topping]
    };

    // Update the cart
    removeFromCart(selectedItem.id);
    addToCart(itemWithTopping);

    // Show success message
    setToppingMessage(`${topping.name} added successfully!`);
    setShowMessage(true);

    // Hide message and modal after delay
    setTimeout(() => {
      setShowMessage(false);
      setShowToppingsModal(false);
    }, 2000);
  };

const handlePlaceOrder = async () => {
    setIsOrdering(true);
    
    try {
      // Prepare order data in the required format
      const orderData = {
        customer_id: customerId,
        order_type: "online",
        delivery_address: "Default address", // You might want to get this from user input
        default_address: true,
        special_instructions: "No special instructions", // You might want to get this from user input
        promo_code_used: "",
        payment_method: "cash",
        transaction_id: "",
        order_items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          toppings: item.toppings ? item.toppings.map(topping => topping.id) : []
        }))
      };

      // Call the createOrder API
      const response = await ordersApi.createOrder(orderData);
      
      // If successful, show success message and clear cart
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        setOrderPlaced(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };


  // Calculate total price with toppings
  const calculateItemTotal = (item) => {
    const base = item.base_price || parseFloat(item.price);
    const toppingsTotal = item.toppings 
      ? item.toppings.reduce((sum, topping) => sum + parseFloat(topping.price), 0) 
      : 0;
    return (base + toppingsTotal) * item.quantity;
  };

  // Check if an item can have toppings
  const canHaveToppings = (item) => {
    return item.category?.name === 'Coffee' || item.category?.name === 'Sweet' || 
           (item.name && (item.name.toLowerCase().includes('coffee') || 
                          item.name.toLowerCase().includes('espresso') || 
                          item.name.toLowerCase().includes('cappuccino') || 
                          item.name.toLowerCase().includes('latte') || 
                          item.name.toLowerCase().includes('muffin') || 
                          item.name.toLowerCase().includes('tart') || 
                          item.name.toLowerCase().includes('pie') || 
                          item.name.toLowerCase().includes('croissant')));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-[#d9c4a8] to-[#c5a76d] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-16 h-16 text-[#7b5e34]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4b3621] mb-2">
                Your cart is empty
              </h2>
              <p className="text-[#7b5e34] mb-8">
                Add some delicious items from our menu
              </p>
              <button 
                className="bg-gradient-to-r from-[#c5a76d] to-[#a67c52] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => window.history.back()}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-[#d9c4a8] rounded-2xl shadow-md p-6 flex gap-5 transition-all duration-300 hover:shadow-lg">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner border-2 border-[#b28c5f]">
                  <img src={item.image_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"} 
                       alt={item.name} 
                       className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-[#4b3621]">{item.name}</h3>
                      <p className="text-sm text-[#7b5e34]">{item.description}</p>
                      
                      {/* Display existing toppings */}
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-[#4b3621]">Toppings:</p>
                          {item.toppings.map((topping, index) => (
                            <div key={index} className="flex justify-between text-sm text-[#a67c52]">
                              <span>+ {topping.name}</span>
                              <span>Tk {parseFloat(topping.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)} 
                      className="text-[#7b5e34] hover:text-red-700 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-[#4b3621]">
                      Tk {calculateItemTotal(item).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-[#c5a76d] hover:bg-[#a67c52] flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="w-12 text-center font-semibold text-[#4b3621]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-[#c5a76d] hover:bg-[#a67c52] flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Add Toppings Button - Only show for items that can have toppings */}
                  {canHaveToppings(item) && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleAddToppingClick(item)}
                        className="flex items-center gap-2 text-[#7b5e34] hover:text-[#5a3e1b] transition-colors group"
                      >
                        <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">
                          {item.toppings && item.toppings.length > 0 ? "Add More Toppings" : "Add Toppings"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary - Only show if cart has items */}
        {cartItems.length > 0 && (
          <div className="lg:w-96 lg:sticky lg:top-32">
            <div className="bg-[#d9c4a8] rounded-2xl shadow-md p-6 flex flex-col gap-6 border border-[#b28c5f]">
              <h3 className="text-xl font-bold text-[#4b3621] border-b border-[#b28c5f] pb-2">Order Summary</h3>
              <div className="flex justify-between text-[#4b3621]">
                <span>Subtotal ({totalItems} items)</span>
                <span>Tk {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#4b3421]">
                <span>Service Fee</span>
                <span>Tk 50.00</span>
              </div>
              <div className="border-t border-[#b28c5f] pt-4 flex justify-between font-bold text-[#4b3421] text-lg">
                <span>Total</span>
                <span>Tk {(totalPrice + 50).toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full bg-gradient-to-r from-[#4b3421] to-[#362314] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
              >
                {isOrdering ? "Processing..." : <><Coffee className="w-5 h-5" /> Place Order</>}
              </button>
              <div className="text-sm text-[#4b3421] flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Ready in 15-20 minutes
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toppings Modal */}
      {showToppingsModal && selectedItem && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#f5f1e6] rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-[#d9c4a8]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#4e342e]">
                Add Topping to {selectedItem.name}
              </h2>
              <button
                onClick={() => setShowToppingsModal(false)}
                className="text-[#7b5e34] hover:text-[#4e342e] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {availableToppings.length === 0 ? (
              <p className="text-center text-[#7b5e34] italic py-4">
                No toppings available for this product.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 mb-6">
                {availableToppings.map((topping) => (
                  <div
                    key={topping.id}
                    className="bg-[#d9c4a8] rounded-lg p-4 flex flex-col gap-2 cursor-pointer hover:bg-[#c5a76d] transition-all duration-300 border border-[#b28c5f] hover:border-[#a67c52]"
                    onClick={() => handleAddTopping(topping)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-[#4b3621]">
                        {topping.name}
                      </h3>
                      <p className="text-[#4b3621] font-bold">
                        + Tk {parseFloat(topping.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-[#7b5e34]">{topping.description}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              className="w-full bg-[#7b5e34] text-[#f5f1e6] py-2 px-4 rounded-lg font-semibold hover:bg-[#4e342e] transition-colors"
              onClick={() => setShowToppingsModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Topping Added Success Popup */}
      {showMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-xl p-6 z-50 flex flex-col items-center border-2 border-green-200 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
          <p className="text-xl font-semibold text-[#4b3621] text-center">{toppingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default UserCart;
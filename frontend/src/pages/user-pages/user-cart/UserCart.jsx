import React, { useState, useContext } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Coffee, Clock, PlusCircle, X } from "lucide-react";
import Header from "@/pages/user-without-login/componets/Header";
import { CartContext } from "../../user-without-login/componets/CartContext";

// Toppings data
const toppings = [
  {
    id: 1,
    name: 'Whipped Cream',
    price: 80,
    description: 'Light and fluffy whipped cream topping.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    message: 'Creamy dreamy! 🥰',
    emoji: '🥰'
  },
  {
    id: 2,
    name: 'Caramel Drizzle',
    price: 100,
    description: 'Sweet caramel sauce topping.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6e9f?auto=format&fit=crop&w=400&q=80',
    message: 'Sweet caramel goodness! 🍯',
    emoji: '🍯'
  },
  {
    id: 3,
    name: 'Chocolate Syrup',
    price: 90,
    description: 'Rich chocolate syrup topping.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    message: 'Chocolate heaven! 🍫',
    emoji: '🍫'
  },
  {
    id: 4,
    name: 'Cinnamon Powder',
    price: 50,
    description: 'Aromatic cinnamon powder topping.',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=400&q=80',
    message: 'Warm and spicy! ✨',
    emoji: '✨'
  },
];

const UserCart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal,
    addToCart
  } = useContext(CartContext);
  
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showToppingsModal, setShowToppingsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toppingMessage, setToppingMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const totalPrice = getCartTotal();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemoveItem = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(id);
    }
  };

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderPlaced(true);
    setIsOrdering(false);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
    }, 3000);
  };

  const handleAddToppingClick = (item) => {
    setSelectedItem(item);
    setShowToppingsModal(true);
  };

  const handleAddTopping = (topping) => {
    // Remove the original item first
    removeFromCart(selectedItem.id);
    
    // Create a new item with the topping added
    const itemWithTopping = {
      ...selectedItem,
      id: `${selectedItem.id}-${topping.id}`, // Unique ID for the item with topping
      name: `${selectedItem.name} with ${topping.name}`,
      price: selectedItem.price + topping.price,
      topping: topping.name,
      originalItemId: selectedItem.id // Keep reference to original item
    };
    
    // Add the new item with topping
    addToCart(itemWithTopping);
    
    // Show the fun message
    setToppingMessage(topping.message);
    setShowMessage(true);
    
    // Hide the message after 2 seconds
    setTimeout(() => {
      setShowMessage(false);
      setShowToppingsModal(false);
    }, 2000);
  };

  // Check if an item is a coffee or sweet that can have toppings
  const canHaveToppings = (item) => {
    return item.category === 'Coffee' || item.category === 'Sweet' || 
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
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-[#4b3621]">{item.name}</h3>
                      <p className="text-sm text-[#7b5e34]">{item.description}</p>
                      {item.topping && (
                        <p className="text-sm text-[#a67c52] font-medium mt-1">+ {item.topping}</p>
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
                    <div className="text-lg font-bold text-[#4b3621]">Tk {(item.price * item.quantity).toFixed(2)}</div>
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
                  
                  {/* Add Toppings Button - Only show for coffee and sweet items without toppings */}
                  {canHaveToppings(item) && !item.topping && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleAddToppingClick(item)}
                        className="flex items-center gap-2 text-[#7b5e34] hover:text-[#5a3e1b] transition-colors group"
                      >
                        <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Add Toppings</span>
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
      {showToppingsModal && (
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
            <p className="text-[#7b5e34] mb-6">Choose a delicious topping to enhance your {selectedItem.name.toLowerCase()}</p>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {toppings.map((topping) => (
                <div 
                  key={topping.id} 
                  className="bg-[#d9c4a8] rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-[#c5a76d] transition-all duration-300 border border-[#b28c5f] hover:border-[#a67c52] group"
                  onClick={() => handleAddTopping(topping)}
                >
                  <img 
                    src={topping.image} 
                    alt={topping.name} 
                    className="w-16 h-16 object-cover rounded-md border-2 border-[#b28c5f] group-hover:border-[#a67c52] transition-colors"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#4b3621] group-hover:text-[#4e342e] transition-colors">{topping.name}</h3>
                    <p className="text-sm text-[#7b5e34]">{topping.description}</p>
                    <p className="text-[#4b3621] font-bold mt-1">+ Tk {topping.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="w-full bg-[#7b5e34] text-[#f5f1e6] py-2 px-4 rounded-lg font-semibold hover:bg-[#4e342e] transition-colors"
              onClick={() => setShowToppingsModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Topping Message Popup */}
      {showMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4e342e] text-[#f5f1e6] px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce border-2 border-[#a67c52]">
          <p className="text-xl font-semibold text-center">{toppingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default UserCart;
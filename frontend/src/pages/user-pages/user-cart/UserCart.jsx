import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/pages/user-without-login/componets/Header";

// Dummy cart data
const initialCart = [
  {
    id: 1,
    name: "Espresso",
    price: 350,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 250,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
  },
];

const UserCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCart);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Change based on auth
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  // Show confirmation modal
  const handleRemoveClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Confirm removal
  const confirmRemove = () => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="relative min-h-screen bg-[#e5c185]">
      <Header />

      {/* Coffee background overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
          alt="Coffee Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto py-12 px-6 mt-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#4e342e]">
          My Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-[#4e342e] text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-[#4e342e] rounded-xl p-4 shadow-lg hover:bg-[#3e2723] transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-[#f5f1e6] mb-1">
                    {item.name}
                  </h2>
                  <p className="text-[#d1c4a1] mb-1">
                    Price: Tk {item.price} x {item.quantity}
                  </p>
                  <p className="text-[#f5f1e6] font-bold">
                    Subtotal: Tk {item.price * item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveClick(item)}
                  className="mt-2 sm:mt-0 text-red-400 hover:text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total + Checkout section */}
            <div className="flex flex-col items-center mt-12 bg-[#4e342e] rounded-xl shadow-lg p-8">
              <p className="text-3xl font-bold text-[#f5f1e6] mb-6">
                Total: Tk {totalPrice}
              </p>
              <button
                onClick={handleCheckout}
                className="w-full md:w-1/3 bg-[#f5f1e6] text-[#4e342e] font-bold py-4 rounded-full hover:bg-[#d7ccb7] transition-colors text-lg"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-[#4e342e]">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              Do you want to remove <strong>{selectedItem.name}</strong> from
              the cart?
            </p>
            <div className="flex justify-around">
              <button
                onClick={confirmRemove}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full font-semibold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;

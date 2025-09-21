import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Clock, ShoppingCart } from "lucide-react";
import { useCart } from "../componets/CartContext";

// Sample menu data (last 3 items would be the ones with highest IDs)
const menuItems = [
  {
    id: 1,
    name: 'Espresso',
    category: 'Coffee',
    price: 350,
    description: 'Strong and bold espresso shot.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
    preparationTime: '3 min',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Cappuccino',
    category: 'Coffee',
    price: 250,
    description: 'Espresso with steamed milk and foam.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    preparationTime: '5 min',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Chocolate Muffin',
    category: 'Sweet',
    price: 380,
    description: 'Soft and chocolaty muffin.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
    preparationTime: '2 min',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Blueberry Tart',
    category: 'Sweet',
    price: 420,
    description: 'Fresh blueberry tart with creamy filling.',
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
    preparationTime: '3 min',
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Latte',
    category: 'Coffee',
    price: 320,
    description: 'Smooth and creamy latte.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80',
    preparationTime: '4 min',
    rating: 4.5,
  },
  {
    id: 8,
    name: 'Americano',
    category: 'Coffee',
    price: 280,
    description: 'Rich americano coffee.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    preparationTime: '3 min',
    rating: 4.4,
  },
  {
    id: 9,
    name: 'Croissant',
    category: 'Sweet',
    price: 220,
    description: 'Buttery and flaky croissant.',
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4aaaef?auto=format&fit=crop&w=400&q=80',
    preparationTime: '1 min',
    rating: 4.6,
  },
  {
    id: 10,
    name: 'Apple Pie',
    category: 'Sweet',
    price: 380,
    description: 'Warm apple pie with cinnamon.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    preparationTime: '4 min',
    rating: 4.8,
  },
];

const Menu = () => {
  const [latestItems, setLatestItems] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    // Get the last 3 items (highest IDs)
    const sortedItems = [...menuItems].sort((a, b) => b.id - a.id);
    setLatestItems(sortedItems.slice(0, 3));
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    // Optional: Show a toast notification instead of alert
  };

  const handleOrderNow = (item) => {
    addToCart(item);
    navigate("/user-panel/cart");
  };

  return (
    <div id="menu" className="py-20 bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#8d6e63] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM1YTM3MTgiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#6d4c41] opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4e342e] opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Heading section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold font-serif text-[#e5c185] mb-4"
          >
            Our Latest Creations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#d7b98f] max-w-2xl mx-auto"
          >
            Discover our newest additions to the menu, crafted with passion and the finest ingredients
          </motion.p>
        </div>

        {/* menu card section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
        >
          {latestItems.map((menu, index) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ 
                y: -15,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="relative bg-[#e5c185] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group max-w-[350px] w-full transform hover:z-10"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Image container */}
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-[#4e342e] text-[#e5c185] px-3 py-1 rounded-full text-sm font-medium z-20">
                  {menu.category}
                </div>
                
                {/* Rating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#4e342e] px-2 py-1 rounded-full flex items-center text-sm font-semibold z-20">
                  <Star size={14} className="fill-amber-400 text-amber-400 mr-1" />
                  {menu.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-[#4e342e] group-hover:text-[#3e2723] transition-colors duration-300">
                    {menu.name}
                  </h3>
                  <p className="text-lg font-bold text-[#4e342e]">{menu.price} BDT</p>
                </div>
                
                <p className="text-[#5c3c1d] mb-4 text-sm line-clamp-2 group-hover:text-[#3e2723] transition-colors duration-300">
                  {menu.description}
                </p>
                
                {/* Preparation time */}
                <div className="flex items-center text-sm text-[#5c3c1d] mb-5">
                  <Clock size={16} className="mr-1" />
                  <span>Prep: {menu.preparationTime}</span>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between gap-3">
                  <button 
                    onClick={() => handleAddToCart(menu)}
                    className="flex-1 bg-[#4e342e] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#3e2723] transition-colors duration-300 font-medium"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                  <button 
                    onClick={() => handleOrderNow(menu)}
                    className="flex-1 bg-[#8d6e63] text-white py-2 px-4 rounded-lg hover:bg-[#6d4c41] transition-colors duration-300 font-medium"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Menu Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-16"
        >
          <button
            className="px-8 py-3 bg-gradient-to-r from-[#8d6e63] to-[#e5c185]  text-white hover:from-[#e5c185]  hover:to-[#4e342e] transition-all duration-500 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden group"
            onClick={() => navigate("/menu-user")}
          >
            <span className="relative z-10">Explore Full Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6d4c41] to-[#4e342e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;
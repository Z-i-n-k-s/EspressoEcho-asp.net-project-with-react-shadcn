import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  {
    id: 1,
    name: 'Espresso',
    category: 'Coffee',
    price: 350,
    description: 'Strong and bold espresso shot.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Cappuccino',
    category: 'Coffee',
    price: 250,
    description: 'Espresso with steamed milk and foam.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Chocolate Muffin',
    category: 'Sweet',
    price: 380,
    description: 'Soft and chocolaty muffin.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Blueberry Tart',
    category: 'Sweet',
    price: 420,
    description: 'Fresh blueberry tart with creamy filling.',
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    name: 'Whipped Cream',
    category: 'Toppings',
    price: 280,
    description: 'Light and fluffy whipped cream topping.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    name: 'Caramel Drizzle',
    category: 'Toppings',
    price: 300,
    description: 'Sweet caramel sauce topping.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6e9f?auto=format&fit=crop&w=400&q=80',
  },
];

const categories = ['All', 'Coffee', 'Sweet', 'Toppings'];

const AllMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredItems = menuItems.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#e5c185] px-6 py-10">
      <h1 className="text-4xl font-bold mb-3 text-center text-[#4e342e]">Our Delightful Menu</h1>
      <p className="text-center text-[#4e342e] mb-8 max-w-3xl mx-auto">
        Explore our curated selection of coffees, sweets, and toppings — crafted to delight your senses.
      </p>

      {/* Filter buttons */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300
              ${
                selectedCategory === cat
                  ? 'bg-[#4e342e] text-[#f5f1e6] shadow-md'
                  : 'bg-[#f5f1e6]/80 text-[#5a3e1b] hover:bg-[#d7ccb7] hover:text-[#3e2a0a]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="flex justify-center mb-10">
        <input
          type="search"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-[#5a3e1b] bg-[#4e342e] text-[#f5f1e6] placeholder-[#b3a58b] focus:outline-none focus:ring-2 focus:ring-[#f5f1e6]"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredItems.length === 0 && (
          <p className="text-center text-[#b3a58b] col-span-full">No items match your search or filter.</p>
        )}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#4e342e] border border-[#7b5e34] rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#a67c52]"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-[#f5f1e6]">{item.name}</h3>
                <span className="text-lg font-bold text-[#f5f1e6]">Tk {item.price.toFixed(2)}</span>
              </div>
              <p className="text-[#d1c4a1] mb-4 text-sm">{item.description}</p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-[#f5f1e6] text-[#5a3e1b] py-2 px-4 font-semibold hover:bg-[#4e342e] hover:text-white duration-300"
                  onClick={() => alert(`Added ${item.name} to cart!`)}
                >
                  Add to Cart
                </button>
                <button
                  className="flex-1 bg-transparent border border-[#f5f1e6] text-[#f5f1e6] py-2 px-4 font-semibold hover:bg-[#4e342e] hover:text-white transition-colors duration-300"
                  onClick={() => navigate(`/menu/${item.id}`, { state: item })}
                >
                  Show Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMenu;

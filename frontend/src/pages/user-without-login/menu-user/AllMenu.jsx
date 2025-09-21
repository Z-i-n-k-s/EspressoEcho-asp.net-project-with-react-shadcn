import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../componets/CartContext';

const menuItems = [
  // same menu items as before
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
    id: 7,
    name: 'Latte',
    category: 'Coffee',
    price: 320,
    description: 'Smooth and creamy latte.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 8,
    name: 'Americano',
    category: 'Coffee',
    price: 280,
    description: 'Rich americano coffee.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 9,
    name: 'Croissant',
    category: 'Sweet',
    price: 220,
    description: 'Buttery and flaky croissant.',
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4aaaef?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 10,
    name: 'Apple Pie',
    category: 'Sweet',
    price: 380,
    description: 'Warm apple pie with cinnamon.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
  },
];

const categories = ['All', 'Coffee', 'Sweet'];

const AllMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const { addToCart } = useCart();

  // Filtered Items
  const filteredItems = menuItems.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Ensure current page is valid
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredItems, totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`Added ${item.name} to cart!`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[#e5c185] px-6 py-10">
      <h1 className="text-4xl font-bold mb-3 text-center text-[#4e342e]">Our Delightful Menu</h1>
      <p className="text-center text-[#4e342e] mb-8 max-w-3xl mx-auto">
        Explore our curated selection of coffees and sweets — crafted to delight your senses.
      </p>

      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
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

      {/* Search */}
      <div className="flex justify-center mb-10">
        <input
          type="search"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-[#5a3e1b] bg-[#4e342e] text-[#f5f1e6] placeholder-[#b3a58b] focus:outline-none focus:ring-2 focus:ring-[#f5f1e6]"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {currentItems.length === 0 && (
          <p className="text-center text-[#b3a58b] col-span-full">No items match your search or filter.</p>
        )}
        {currentItems.map((item) => (
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
              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-[#f5f1e6] text-[#5a3e1b] py-2 px-4 font-semibold hover:bg-[#4e342e] hover:text-white duration-300"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
                <button
                  className="w-full bg-transparent border border-[#f5f1e6] text-[#f5f1e6] py-2 px-4 font-semibold hover:bg-[#4e342e] hover:text-white transition-colors duration-300"
                  onClick={() => navigate(`/menu/${item.id}`, { state: item })}
                >
                  Show Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full font-semibold bg-[#d7ccb7] text-[#3e2a0a] disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300
                  ${
                    currentPage === page
                      ? 'bg-[#4e342e] text-[#f5f1e6] shadow-md'
                      : 'bg-[#f5f1e6]/80 text-[#5a3e1b] hover:bg-[#d7ccb7] hover:text-[#3e2a0a]'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full font-semibold bg-[#d7ccb7] text-[#3e2a0a] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMenu;

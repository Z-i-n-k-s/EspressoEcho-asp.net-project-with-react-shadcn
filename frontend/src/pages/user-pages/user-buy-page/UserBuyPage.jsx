import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Filter, X, Star, TrendingUp } from 'lucide-react';

// Enhanced demo data with more products and details
const demoProducts = [
  {
    id: '1',
    name: 'Cappuccino',
    description: 'Rich espresso topped with steamed milk foam and a sprinkle of cocoa powder.',
    base_price: 3.5,
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500',
    category_id: 'coffee',
    branch_id: 'branch1',
    badge: 'popular',
    rating: 4.8,
    reviews: 142,
    prep_time: '3-5'
  },
  {
    id: '2',
    name: 'Latte',
    description: 'Smooth espresso blended with steamed milk, perfect for coffee lovers.',
    base_price: 4.0,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
    category_id: 'coffee',
    branch_id: 'branch2',
    rating: 4.6,
    reviews: 98,
    prep_time: '4-6'
  },
  {
    id: '3',
    name: 'Blueberry Muffin',
    description: 'Freshly baked muffin bursting with juicy blueberries and a golden top.',
    base_price: 2.5,
    image_url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500',
    category_id: 'pastry',
    branch_id: 'branch1',
    badge: 'new',
    rating: 4.4,
    reviews: 67,
    prep_time: '1-2'
  },
  {
    id: '4',
    name: 'Chocolate Croissant',
    description: 'Buttery, flaky croissant filled with rich Belgian chocolate.',
    base_price: 3.0,
    image_url: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500',
    category_id: 'pastry',
    branch_id: 'branch2',
    rating: 4.7,
    reviews: 89,
    prep_time: '2-3'
  },
  {
    id: '5',
    name: 'Americano',
    description: 'Bold espresso shots with hot water for a clean, strong coffee taste.',
    base_price: 2.8,
    image_url: 'https://images.unsplash.com/photo-1521302200778-33500795e128?w=500',
    category_id: 'coffee',
    branch_id: 'branch1',
    badge: 'fast',
    rating: 4.3,
    reviews: 56,
    prep_time: '2-3'
  },
  {
    id: '6',
    name: 'Avocado Toast',
    description: 'Fresh avocado on toasted artisan bread with sea salt and herbs.',
    base_price: 6.5,
    image_url: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=500',
    category_id: 'food',
    branch_id: 'branch2',
    badge: 'popular',
    rating: 4.5,
    reviews: 78,
    prep_time: '5-7'
  },
  {
    id: '7',
    name: 'Green Tea Matcha Latte',
    description: 'Premium matcha powder with steamed milk for a smooth, earthy flavor.',
    base_price: 4.5,
    image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500',
    category_id: 'specialty',
    branch_id: 'branch1',
    rating: 4.2,
    reviews: 43,
    prep_time: '4-6'
  },
  {
    id: '8',
    name: 'Bagel with Cream Cheese',
    description: 'Fresh everything bagel toasted to perfection with cream cheese.',
    base_price: 3.8,
    image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500',
    category_id: 'food',
    branch_id: 'branch2',
    rating: 4.1,
    reviews: 92,
    prep_time: '3-4'
  }
];

const demoBranches = [
  { id: 'branch1', name: 'Downtown Cafe' },
  { id: 'branch2', name: 'Uptown Cafe' },
];

const demoCategories = [
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'pastry', name: 'Pastries', icon: '🥐' },
  { id: 'food', name: 'Food', icon: '🍽️' },
  { id: 'specialty', name: 'Specialty Drinks', icon: '🍵' }
];

// SearchBar Component
const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative flex-1 max-w-md">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      <Search className="w-5 h-5 text-gray-400" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search coffee, pastries, food..."
      className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 shadow-sm hover:shadow-md"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-0 flex items-center pr-4 hover:text-gray-600"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>
    )}
  </div>
);

// CartIcon Component
const CartIcon = ({ count }) => (
  <div className="relative">
    <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
      <ShoppingBag className="w-5 h-5" />
      <span className="font-semibold">Cart</span>
    </button>
    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
        {count}
      </div>
    )}
  </div>
);

// Filters Component
const Filters = ({
  selectedBranch, onBranchChange,
  selectedCategory, onCategoryChange,
  selectedPriceRange, onPriceRangeChange,
  selectedSortBy, onSortByChange,
  branches, categories, onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilters = selectedBranch || selectedCategory || selectedPriceRange || selectedSortBy !== 'name';

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
            hasActiveFilters 
              ? 'bg-amber-50 border-amber-200 text-amber-700' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <div className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {[selectedBranch, selectedCategory, selectedPriceRange, selectedSortBy !== 'name'].filter(Boolean).length}
            </div>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block mb-8`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            
            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select
                value={selectedBranch}
                onChange={(e) => onBranchChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
              >
                <option value="">All Locations</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
              <select
                value={selectedPriceRange}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
              >
                <option value="">All Prices</option>
                <option value="0-3">Under $3</option>
                <option value="3-5">$3 - $5</option>
                <option value="5-10">$5 - $10</option>
                <option value="10+">$10+</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={selectedSortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={onClearFilters}
                  className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium text-sm"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ProductCard Component
const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await onAddToCart();
    setTimeout(() => setIsLoading(false), 500);
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'popular': return <Star size={12} className="text-white" />;
      case 'new': return <TrendingUp size={12} className="text-white" />;
      case 'fast': return <span className="text-white text-xs">⚡</span>;
      default: return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'popular': return 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400';
      case 'new': return 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400';
      case 'fast': return 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300'
        } transition-colors duration-200`}
      />
    ));
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-500 hover:-translate-y-2 transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getBadgeColor(product.badge)} shadow-lg`}>
            {getBadgeIcon(product.badge)}
            <span className="text-white">{product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-amber-600 transition-colors duration-300 flex-1 pr-3">
            {product.name}
          </h3>
          <span className="text-2xl font-bold text-amber-600">
            ${product.base_price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="font-semibold text-gray-900">{product.rating}</span>
            <span className="text-gray-500">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <span className="font-medium">{product.prep_time} min</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-300 disabled:to-orange-300 text-white py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </div>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

const UserBuyPage = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSortBy, setSelectedSortBy] = useState('name');

  const filterProducts = () => {
    let filtered = [...demoProducts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Branch filter
    if (selectedBranch) {
      filtered = filtered.filter((p) => p.branch_id === selectedBranch);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange) {
      filtered = filtered.filter((p) => {
        const price = p.base_price;
        switch (selectedPriceRange) {
          case '0-3': return price < 3;
          case '3-5': return price >= 3 && price <= 5;
          case '5-10': return price > 5 && price <= 10;
          case '10+': return price > 10;
          default: return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (selectedSortBy) {
        case 'price-low':
          return a.base_price - b.base_price;
        case 'price-high':
          return b.base_price - a.base_price;
        case 'popular':
          return (b.rating * b.reviews) - (a.rating * a.reviews);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setProducts(filtered);
  };

  const handleAddToCart = (productId) => {
    return new Promise((resolve) => {
      setCartCount((prev) => prev + 1);
      setTimeout(resolve, 300);
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setSelectedBranch('');
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedSortBy('name');
    setSearchTerm('');
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedBranch, selectedCategory, selectedPriceRange, selectedSortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">Coffee & More</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">Discover our freshly brewed selection</p>
          
          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm}
              onClear={handleClearSearch}
            />
          </div>
        </div>

        {/* Cart and Stats Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-amber-600">{products.length}</span> of <span className="font-semibold">{demoProducts.length}</span> products
          </div>
          <CartIcon count={cartCount} />
        </div>

        {/* Filters */}
        <Filters
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          selectedSortBy={selectedSortBy}
          onSortByChange={setSelectedSortBy}
          branches={demoBranches}
          categories={demoCategories}
          onClearFilters={handleClearFilters}
        />

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for</p>
            <button
              onClick={handleClearFilters}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBuyPage;
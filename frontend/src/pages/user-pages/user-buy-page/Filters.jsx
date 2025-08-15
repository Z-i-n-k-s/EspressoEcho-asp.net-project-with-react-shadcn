import React, { useState } from 'react';
import { MapPin, Coffee, DollarSign, Filter, X, ChevronDown, Star, Clock, TrendingUp, Search, Sparkles } from 'lucide-react';

const Filters = ({
  selectedBranch,
  onBranchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedSortBy,
  onSortByChange,
  branches,
  categories,
  onClearFilters,
  resultCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters = selectedBranch || selectedCategory || selectedPriceRange || selectedSortBy !== 'name';

  const priceRanges = [
    { id: '', name: 'All Prices', icon: DollarSign, color: 'text-gray-500' },
    { id: '0-3', name: 'Under $3', icon: DollarSign, color: 'text-green-500' },
    { id: '3-5', name: '$3 - $5', icon: DollarSign, color: 'text-blue-500' },
    { id: '5-10', name: '$5 - $10', icon: DollarSign, color: 'text-purple-500' },
    { id: '10+', name: '$10+', icon: DollarSign, color: 'text-red-500' }
  ];

  const sortOptions = [
    { id: 'name', name: 'Name (A-Z)', icon: Filter, color: 'text-gray-500' },
    { id: 'price-low', name: 'Price: Low to High', icon: TrendingUp, color: 'text-green-500' },
    { id: 'price-high', name: 'Price: High to Low', icon: TrendingUp, color: 'text-red-500' },
    { id: 'popular', name: 'Most Popular', icon: Star, color: 'text-yellow-500' },
    { id: 'rating', name: 'Highest Rated', icon: Star, color: 'text-yellow-500' },
    { id: 'newest', name: 'Newest First', icon: Clock, color: 'text-blue-500' }
  ];

  const quickFilters = [
    { id: 'popular', label: '⭐ Popular', type: 'badge', gradient: 'from-yellow-400 to-orange-400' },
    { id: 'new', label: '✨ New Items', type: 'badge', gradient: 'from-purple-400 to-pink-400' },
    { id: 'under-5', label: '💰 Under $5', type: 'price', gradient: 'from-green-400 to-emerald-400' },
    { id: 'coffee', label: '☕ Coffee', type: 'category', gradient: 'from-amber-400 to-orange-400' },
    { id: 'pastry', label: '🥐 Pastries', type: 'category', gradient: 'from-pink-400 to-rose-400' }
  ];

  const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.id === value);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group w-full flex items-center justify-between px-5 py-4 bg-white border-2 rounded-2xl text-sm font-medium transition-all duration-300 hover:shadow-lg ${
            isOpen || value 
              ? 'border-amber-400 shadow-lg shadow-amber-100 bg-amber-50/30' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              value ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-500'
            }`}>
              <Icon size={16} />
            </div>
            <span className={`transition-colors duration-300 ${
              value ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
            }`}>
              {selectedOption?.name || placeholder}
            </span>
          </div>
          <ChevronDown 
            className={`text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-amber-500' : 'group-hover:text-gray-600'}`} 
            size={18} 
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all duration-200 ${
                    index === 0 ? 'rounded-t-2xl' : ''
                  } ${
                    index === options.length - 1 ? 'rounded-b-2xl' : 'border-b border-gray-100'
                  } ${
                    option.id === value 
                      ? 'bg-amber-50 text-amber-700 border-amber-100' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50'
                  }`}
                >
                  {option.icon && (
                    <div className={`p-1.5 rounded-lg ${
                      option.id === value ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <option.icon size={14} />
                    </div>
                  )}
                  <span className={`font-medium ${option.id === value ? 'text-amber-700' : ''}`}>
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg shadow-gray-100/50 overflow-hidden mb-8">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-200">
              <Filter size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Smart Filters</h3>
              <div className="flex items-center gap-2">
                <Search size={14} className="text-amber-500" />
                <p className="text-sm text-gray-600 font-medium">
                  {resultCount} results found
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl border border-red-200 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-200"
              >
                <X size={16} />
                Clear all
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 hover:bg-white/70 rounded-xl transition-all duration-300 lg:hidden"
            >
              <ChevronDown 
                className={`text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            <span className="text-sm text-gray-700 font-semibold">Quick Filters:</span>
          </div>
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                if (filter.type === 'category') {
                  onCategoryChange(selectedCategory === filter.id ? '' : filter.id);
                } else if (filter.type === 'price' && filter.id === 'under-5') {
                  onPriceRangeChange(selectedPriceRange === '0-5' ? '' : '0-5');
                }
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-300 hover:scale-105 transform ${
                (filter.type === 'category' && selectedCategory === filter.id) ||
                (filter.id === 'under-5' && selectedPriceRange === '0-5')
                  ? `bg-gradient-to-r ${filter.gradient} border-transparent text-white shadow-lg`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Filters */}
      <div className={`transition-all duration-500 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                Location
              </label>
              <CustomSelect
                value={selectedBranch}
                onChange={onBranchChange}
                options={[{ id: '', name: 'All Locations', icon: MapPin }, ...branches.map(b => ({ ...b, icon: MapPin }))]}
                placeholder="All Locations"
                icon={MapPin}
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Coffee size={14} className="text-amber-500" />
                Category
              </label>
              <CustomSelect
                value={selectedCategory}
                onChange={onCategoryChange}
                options={[{ id: '', name: 'All Categories', icon: Coffee }, ...categories.map(c => ({ ...c, icon: Coffee }))]}
                placeholder="All Categories"
                icon={Coffee}
              />
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign size={14} className="text-green-500" />
                Price Range
              </label>
              <CustomSelect
                value={selectedPriceRange}
                onChange={onPriceRangeChange}
                options={priceRanges}
                placeholder="All Prices"
                icon={DollarSign}
              />
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp size={14} className="text-purple-500" />
                Sort By
              </label>
              <CustomSelect
                value={selectedSortBy}
                onChange={onSortByChange}
                options={sortOptions}
                placeholder="Sort by"
                icon={Filter}
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                  <Star size={14} className="text-purple-500" />
                  Active Filters:
                </span>
                {selectedBranch && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg shadow-lg">
                    <MapPin size={12} />
                    {branches.find(b => b.id === selectedBranch)?.name}
                    <button onClick={() => onBranchChange('')} className="hover:bg-blue-700 rounded p-0.5 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-lg shadow-lg">
                    <Coffee size={12} />
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => onCategoryChange('')} className="hover:bg-green-700 rounded p-0.5 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-lg shadow-lg">
                    <DollarSign size={12} />
                    {priceRanges.find(p => p.id === selectedPriceRange)?.name}
                    <button onClick={() => onPriceRangeChange('')} className="hover:bg-purple-700 rounded p-0.5 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedSortBy && selectedSortBy !== 'name' && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-lg shadow-lg">
                    <TrendingUp size={12} />
                    {sortOptions.find(s => s.id === selectedSortBy)?.name}
                    <button onClick={() => onSortByChange('name')} className="hover:bg-orange-700 rounded p-0.5 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Demo component
const FiltersDemo = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSortBy, setSelectedSortBy] = useState('name');

  const demoBranches = [
    { id: 'branch1', name: 'Downtown Café' },
    { id: 'branch2', name: 'Uptown Bistro' },
    { id: 'branch3', name: 'Seaside Location' }
  ];

  const demoCategories = [
    { id: 'coffee', name: 'Coffee' },
    { id: 'pastry', name: 'Pastries' },
    { id: 'food', name: 'Food' },
    { id: 'specialty', name: 'Specialty Drinks' }
  ];

  const handleClearFilters = () => {
    setSelectedBranch('');
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced Filters Component</h1>
          <p className="text-xl text-gray-600">Modern, intuitive filtering with beautiful animations</p>
        </div>

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
          resultCount={24}
        />

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Filter State:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Branch:</strong> {selectedBranch || 'All'}</p>
            <p><strong>Category:</strong> {selectedCategory || 'All'}</p>
            <p><strong>Price Range:</strong> {selectedPriceRange || 'All'}</p>
            <p><strong>Sort By:</strong> {selectedSortBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
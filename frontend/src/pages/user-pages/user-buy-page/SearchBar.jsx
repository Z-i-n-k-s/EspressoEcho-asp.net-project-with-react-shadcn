import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles, Filter } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, suggestions = [], recentSearches = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
  );

  const displayRecentSearches = recentSearches.filter(s => 
    !value || s.toLowerCase().includes(value.toLowerCase())
  );

  const popularSuggestions = [
    'Cappuccino', 'Latte', 'Croissant', 'Matcha', 'Americano', 
    'Blueberry muffin', 'Avocado toast', 'Cold brew'
  ];

  const activeSuggestions = filteredSuggestions.length > 0 ? filteredSuggestions : popularSuggestions;

  return (
    <div className="relative flex items-center w-full max-w-2xl" ref={dropdownRef}>
      <div className="relative w-full group">
        {/* Animated background glow */}
        <div className={`absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-pink-400/20 rounded-2xl blur-xl transition-all duration-500 ${
          isFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
        }`}></div>
        
        <div className={`relative transition-all duration-500 ease-out ${
          isFocused ? 'transform scale-[1.02]' : ''
        }`}>
          {/* Search icon with animation */}
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
            <div className={`transition-all duration-300 ${isTyping ? 'animate-pulse' : ''}`}>
              <Search 
                className={`transition-all duration-300 ${
                  isFocused ? 'text-amber-500 scale-110' : 'text-gray-400'
                }`}
                size={22} 
              />
            </div>
            {/* Ripple effect */}
            {isFocused && (
              <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping"></div>
            )}
          </div>

          {/* Main input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="What's on your mind today?"
            className={`w-full pl-16 pr-16 py-5 bg-white/95 backdrop-blur-sm border-2 rounded-2xl outline-none transition-all duration-500 ease-out text-base font-medium placeholder:text-gray-400 shadow-sm hover:shadow-lg ${
              isFocused 
                ? 'border-amber-400 shadow-xl shadow-amber-100/50 bg-white' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-white'
            }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
          />

          {/* Clear button with enhanced animation */}
          {value && (
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={onClear}
                className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-xl hover:scale-110 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && value && (
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Suggestions Dropdown */}
        {showSuggestions && (isFocused || value) && (activeSuggestions.length > 0 || displayRecentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-amber-50/30 to-orange-50/30 pointer-events-none"></div>
            
            <div className="relative overflow-y-auto max-h-96 custom-scrollbar">
              {/* Recent Searches */}
              {displayRecentSearches.length > 0 && !value && (
                <div className="p-4 border-b border-gray-50">
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Clock size={16} className="text-blue-600" />
                    </div>
                    <span className="font-semibold">Recent searches</span>
                  </div>
                  <div className="space-y-1">
                    {displayRecentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="group w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 hover:shadow-sm hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="group-hover:text-blue-700 transition-colors">{search}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular/Filtered Suggestions */}
              {activeSuggestions.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="p-1.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                      {value ? (
                        <Filter size={16} className="text-amber-600" />
                      ) : (
                        <TrendingUp size={16} className="text-amber-600" />
                      )}
                    </div>
                    <span className="font-semibold">
                      {value ? 'Matching items' : 'Popular searches'}
                    </span>
                    {!value && (
                      <div className="flex items-center gap-1 text-xs">
                        <Sparkles size={12} className="text-amber-500" />
                        <span className="text-amber-600">Trending</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {activeSuggestions.slice(0, 6).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="group w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl transition-all duration-300 hover:shadow-sm hover:scale-[1.02] relative overflow-hidden"
                      >
                        {/* Hover effect background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                        
                        <div className="flex items-center justify-between relative">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Search size={12} className="text-amber-600" />
                            </div>
                            <span className="group-hover:text-amber-700 transition-colors font-medium">
                              {value && suggestion.toLowerCase().includes(value.toLowerCase()) ? (
                                <>
                                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">
                                    {suggestion.substring(0, value.length)}
                                  </span>
                                  {suggestion.substring(value.length)}
                                </>
                              ) : (
                                suggestion
                              )}
                            </span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results with enhanced styling */}
              {value && activeSuggestions.length === 0 && displayRecentSearches.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-gray-600 font-semibold mb-2">No matches found</h3>
                  <p className="text-gray-500 text-sm">Try searching for coffee, pastries, or snacks</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f59e0b, #d97706);
        }
      `}</style>
    </div>
  );
};

// Demo Component
const SearchBarDemo = () => {
  const [searchValue, setSearchValue] = useState('');
  
  const suggestions = [
    'Cappuccino', 'Latte', 'Americano', 'Espresso', 'Macchiato',
    'Croissant', 'Blueberry Muffin', 'Chocolate Chip Cookie',
    'Avocado Toast', 'Bagel with Cream Cheese', 'Green Tea',
    'Matcha Latte', 'Cold Brew', 'Iced Coffee'
  ];
  
  const recentSearches = ['Latte', 'Chocolate Croissant', 'Green Tea'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-amber-700 to-orange-600 bg-clip-text text-transparent mb-4">
            Enhanced Search Experience
          </h1>
          <p className="text-xl text-gray-600">Discover what you're craving with intelligent search</p>
        </div>
        
        <div className="flex justify-center">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onClear={() => setSearchValue('')}
            suggestions={suggestions}
            recentSearches={recentSearches}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Current search: <span className="font-medium text-amber-600">"{searchValue || 'None'}"</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
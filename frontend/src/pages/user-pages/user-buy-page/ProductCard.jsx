
import React, { useState } from 'react';
import { Star, TrendingUp, Clock, Plus, Heart, Eye, ShoppingCart, Zap } from 'lucide-react';

// Enhanced ProductCard Component
const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite = false, onQuickView }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await onAddToCart();
    setTimeout(() => setIsLoading(false), 500);
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'popular': return <Star size={12} className="text-white fill-current" />;
      case 'new': return <TrendingUp size={12} className="text-white" />;
      case 'fast': return <Zap size={12} className="text-white" />;
      default: return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'popular': return 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 shadow-lg shadow-orange-200/60';
      case 'new': return 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 shadow-lg shadow-green-200/60';
      case 'fast': return 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 shadow-lg shadow-blue-200/60';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-lg shadow-gray-200/60';
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
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-orange-50/0 to-red-50/0 group-hover:from-amber-50/40 group-hover:via-orange-50/30 group-hover:to-red-50/20 transition-all duration-700 pointer-events-none"></div>
      
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {/* Image Loading Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
        )}
        
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-48 object-cover group-hover:scale-110 transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Enhanced Floating Badge */}
        {product.badge && (
          <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30 ${getBadgeColor(product.badge)} transform group-hover:scale-110 transition-all duration-300 z-20`}>
            {getBadgeIcon(product.badge)}
            <span className="text-white drop-shadow-sm">{product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <div className={`transform transition-all duration-500 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`} style={{ transitionDelay: '100ms' }}>
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`p-2.5 rounded-full backdrop-blur-md border border-white/40 transition-all duration-300 hover:scale-110 shadow-lg ${
                  isFavorite 
                    ? 'bg-red-500 text-white shadow-red-200/60' 
                    : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500 shadow-white/50'
                }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
              </button>
            )}
          </div>
          
          <div className={`transform transition-all duration-500 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView();
                }}
                className="p-2.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-md border border-white/40 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 hover:scale-110 shadow-lg shadow-white/50"
              >
                <Eye size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Quick Add Overlay */}
        <div className={`absolute inset-0 flex items-end justify-center pb-6 transition-all duration-500 z-20 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`transform transition-all duration-500 bg-white/95 text-amber-600 rounded-full px-6 py-3 shadow-xl hover:shadow-2xl hover:bg-amber-50 disabled:opacity-50 font-semibold text-sm border border-amber-100/50 backdrop-blur-sm ${
              isHovered ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} />
                <span>Quick Add</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-amber-600 transition-colors duration-300 flex-1 pr-3">
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
              ${product.base_price.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {product.description}
        </p>

        {/* Enhanced Rating and Stats */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
              {renderStars(product.rating)}
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{product.rating}</span>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 group-hover:bg-amber-50/70 px-2.5 py-1.5 rounded-full transition-all duration-300">
            <Clock size={12} className="group-hover:text-amber-600 transition-colors duration-300" />
            <span className="font-medium group-hover:text-amber-700 transition-colors duration-300">{product.prep_time} min</span>
          </div>
        </div>

        {/* Enhanced Main CTA Button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-300 disabled:to-orange-300 text-white py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform group-hover:shadow-amber-300/50 relative overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {isLoading ? (
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding to Cart...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 relative z-10">
              <Plus size={16} />
              <span>Add to Cart</span>
            </div>
          )}
        </button>
      </div>

      {/* Enhanced border glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-200/0 group-hover:ring-amber-300/60 transition-all duration-500 pointer-events-none"></div>
      
      {/* Subtle corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/0 group-hover:from-amber-100/30 to-transparent rounded-2xl transition-all duration-700 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
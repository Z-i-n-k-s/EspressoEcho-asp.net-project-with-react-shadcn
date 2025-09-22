import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, Zap, Coffee } from 'lucide-react';

import { useSelector } from 'react-redux';
import branchApi from '@/api/Branch_api';
import productApi from '@/api/Product_api';
import categoryApi from '@/api/Catergory_api';

const PosDisplay = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const branchId = user?.employee?.branch_id;

  useEffect(() => {
    if (!branchId) return;

    const fetchBranchProducts = async () => {
      setLoading(true);
      try {
        //  Fetch branch inventory
        const inventoryRes = await branchApi.getInventoryByBranch(branchId);
        const inventoryData = inventoryRes.data || [];

        //  Fetch all products
        const productsRes = await productApi.getAllProducts();
        const productData = productsRes.data || [];

        //  Merge inventory with product details
        const mergedProducts = inventoryData
          .map(inv => {
            const prod = productData.find(p => p.id === inv.product_id);
            if (!prod) return null; // skip if product not found
            return {
              id: prod.id,
              name: prod.name,
              base_price: parseFloat(prod.base_price),
              image_url: prod.image_url,
              category: prod.category?.name || 'Uncategorized',
              prep_time: prod.prep_time || '3-5 min',
              quantity_on_hand: inv.quantity_on_hand,
              is_active: prod.is_active,
            };
          })
          .filter(Boolean); // remove nulls

        setProducts(mergedProducts);

        //  Fetch categories for this branch
        const categoryRes = await categoryApi.getByBranch(branchId);
        if (categoryRes.success && Array.isArray(categoryRes.data)) {
          const branchCategories = categoryRes.data.map(c => c.name);
          setCategories(['All', ...branchCategories]);
        }
      } catch (err) {
        console.error('Failed to fetch branch products or categories:', err);
        setProducts([]);
        setCategories(['All']);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchProducts();
  }, [branchId]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 text-lg">Loading products and categories...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 rounded-3xl p-8 mr-6 shadow-xl border border-amber-100/50 backdrop-blur-sm">
      {/* Header & Search & Category Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                Menu
              </h2>
              <p className="text-stone-500 font-medium">Choose your favorites</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-amber-100">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{filteredProducts.length} items available</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search delicious items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-stone-100 bg-white/80 backdrop-blur-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-amber-200/50 focus:border-amber-300 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-medium"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-200/50'
                  : 'bg-white/80 backdrop-blur-sm text-stone-600 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 hover:border-amber-200'
              }`}
            >
              {category}
              {category !== 'All' && (
                <span className="ml-2 text-xs opacity-75">
                  ({products.filter(p => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-amber-100/50 hover:shadow-2xl hover:shadow-amber-200/20 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-stone-100 to-amber-50">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-amber-100">
                <span className="text-lg font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                  ${product.base_price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-xl text-stone-800 mb-2 group-hover:text-amber-800 transition-colors duration-200">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between text-sm text-stone-500 mb-3">
                  <span className="font-medium bg-stone-100 px-2 py-1 rounded-lg">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{product.prep_time}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </div>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosDisplay;

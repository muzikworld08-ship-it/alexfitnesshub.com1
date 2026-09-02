import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, Search, Filter, Sparkles, Star, Zap, 
  RotateCcw, Eye, ShieldCheck, Truck, ArrowRight, 
  Check, Flame, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Product, ProductCategory } from "../types";
import { ProductDetailModal } from "./store/ProductDetailModal";
import { CartDrawer } from "./store/CartDrawer";
import { CheckoutModal } from "./store/CheckoutModal";

interface StoreViewProps {
  setView?: (view: string) => void;
  onOpenAuth?: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({ setView }) => {
  const { 
    products, 
    isLoadingProducts, 
    cartCount, 
    setIsCartOpen,
    addToCart,
    buyNow,
    selectedProductForDetail,
    setSelectedProductForDetail
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating" | "newest">("featured");
  
  // Track which product cards are currently flipped to back view on card hover/click
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesSearch = searchQuery.trim() === "" || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 4.8) - (a.rating || 4.8);
        if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories: ("All" | ProductCategory)[] = [
    "All",
    "Men",
    "Women",
    "ALEXFITNESSHUB Collections"
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-slate-900 font-sans pb-24 animate-fade-in">
      
      {/* 1. HERO BANNER: Premium Aesthetic Branding */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800 pt-10 pb-16 sm:pt-16 sm:pb-20">
        {/* Subtle Background Glow Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,57,53,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Title & Tagline */}
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                <span>Official ALEXFITNESSHUB Merchandise</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
                ALEXFITNESSHUB <span className="text-[#E53935]">STORE</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-xl">
                High-performance fitness clothing, pump covers, seamless leggings, and official athlete collections engineered for intense lifting and longevity.
              </p>

              {/* Trust Value Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-[11px] font-bold text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Truck className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Free Shipping &gt; ₦50k</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Squat-Proof</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>7-Day Sizing Swap</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Zap className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Express Dispatch</span>
                </div>
              </div>
            </div>

            {/* Quick Bag Button */}
            <div className="lg:self-end">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-600/20 transition-all cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>View Shopping Bag ({cartCount})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CONTROLS: CATEGORIES, SEARCH & SORT */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1 shrink-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-[#E53935] text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat === "All" ? "All Apparel" : cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gear, tees, hoodies..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">New Releases</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. PRODUCTS GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Results Header Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> Products
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-red-600 font-bold hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 uppercase">No Products Found</h3>
              <p className="text-xs text-slate-500">
                No items match your selected category or query. Try resetting your search or choosing another category.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              View All Apparel
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const isFlipped = !!flippedCards[product.id];
              const displayImage = isFlipped && product.backImage ? product.backImage : product.frontImage;

              const discountPercent = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductForDetail(product)}
                  className="group bg-white rounded-3xl border border-slate-200/80 hover:border-red-500/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-4/5 w-full bg-slate-100 overflow-hidden select-none">
                    
                    {/* Badge Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      {product.badge && (
                        <span className="px-2.5 py-1 bg-red-600 text-white font-black text-[9px] uppercase tracking-wider rounded-md shadow-xs">
                          {product.badge}
                        </span>
                      )}
                      {discountPercent && (
                        <span className="px-2 py-0.5 bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider rounded-md shadow-xs">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Front / Back Toggle Button Top Right */}
                    {product.backImage && (
                      <button
                        type="button"
                        onClick={(e) => toggleCardFlip(product.id, e)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 shadow-md backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black uppercase"
                        title="Toggle Front/Back View"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isFlipped ? "Front" : "Back"}</span>
                      </button>
                    )}

                    {/* Product Image */}
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Quick View Button on Card Hover */}
                    <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-full py-2.5 bg-slate-900/90 backdrop-blur-md text-white rounded-xl text-xs font-black uppercase tracking-wider text-center shadow-lg flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details & Sizing</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    
                    <div className="space-y-1.5">
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-black uppercase tracking-wider text-red-600">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-slate-700">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span>{product.rating || 4.9}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-black text-slate-900 line-clamp-1 leading-snug group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Color Dots */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          {product.colors.map((c) => (
                            <span
                              key={c.name}
                              className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 font-bold ml-1">
                            {product.colors.length} {product.colors.length === 1 ? "color" : "colors"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Strip */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-slate-900 font-mono">
                          ₦{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-400 line-through font-mono">
                            ₦{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quick Buy Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductForDetail(product);
                        }}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-800 transition-all cursor-pointer shadow-xs"
                        title="Choose Size & Add"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 4. MODALS & DRAWERS */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />

      <CartDrawer />

      <CheckoutModal />

    </div>
  );
};

export default StoreView;

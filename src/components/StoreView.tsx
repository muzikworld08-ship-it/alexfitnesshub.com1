import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, Search, Filter, Sparkles, Star, Zap, 
  RotateCcw, Eye, ShieldCheck, Truck, ArrowRight, 
  Check, Flame, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Product, ProductCategory } from "../types";

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
  
  // Track selected size and color per product card for direct Buy Now and Add to Cart
  const [cardSelectedSizes, setCardSelectedSizes] = useState<Record<string, string>>({});
  const [cardSelectedColors, setCardSelectedColors] = useState<Record<string, string>>({});
  const [cardAddedFeedback, setCardAddedFeedback] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleSelectProduct = (product: Product) => {
    // Keep user on the store view and open product details modal seamlessly without page reload
    setSelectedProductForDetail(product);
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
      
      {/* 1. STORE HEADER: Clean, Compact, Immediate E-Commerce Bar (No excessive scroll down) */}
      <section className="bg-slate-950 text-white border-b border-slate-800 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Title & Tagline */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-[#E53935] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  Official Store
                </span>
                <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
                  ⚡ Nationwide Delivery &bull; 🛡️ 100% Squat-Proof &bull; 🔄 7-Day Size Swaps
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                ALEXFITNESSHUB <span className="text-[#E53935]">STORE</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                High-performance fitness apparel, pump covers & athlete merchandise.
              </p>
            </div>

            {/* Quick Bag Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>View Bag ({cartCount})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CONTROLS: CATEGORIES, SEARCH & SORT - Crisp Solid Bar (No blur) */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-0.5 shrink-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-[#E53935] text-white shadow-xs"
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
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
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
                  onClick={() => handleSelectProduct(product)}
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

                    {/* Front / Back Toggle Button Top Right - Solid Crisp Button, No Blur */}
                    {product.backImage && (
                      <button
                        type="button"
                        onClick={(e) => toggleCardFlip(product.id, e)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-red-600 shadow-md border border-slate-200 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black uppercase"
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
                      <div className="w-full py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center shadow-lg flex items-center justify-center gap-1.5 border border-white/10">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View Details</span>
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
                          <span className="text-slate-400 font-normal">({product.reviewsCount || 128})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-black text-slate-900 line-clamp-1 leading-snug group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Color Dots */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          {product.colors.map((c) => {
                            const isColorSelected = (cardSelectedColors[product.id] || product.colors[0]?.name) === c.name;
                            return (
                              <button
                                key={c.name}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardSelectedColors(prev => ({ ...prev, [product.id]: c.name }));
                                }}
                                className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
                                  isColorSelected ? "ring-2 ring-red-500 scale-110 border-white" : "border-black/20 hover:scale-105"
                                }`}
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            );
                          })}
                          <span className="text-[10px] text-slate-500 font-bold ml-1">
                            {cardSelectedColors[product.id] || product.colors[0]?.name}
                          </span>
                        </div>
                      )}

                      {/* Quick Size Selector Chips */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Size:</span>
                            <span className="text-slate-800 uppercase font-mono">
                              {cardSelectedSizes[product.id] || product.sizes[0] || "M"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((sz) => {
                              const isSzActive = (cardSelectedSizes[product.id] || product.sizes[0] || "M") === sz;
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCardSelectedSizes(prev => ({ ...prev, [product.id]: sz }));
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase transition-all cursor-pointer border ${
                                    isSzActive
                                      ? "bg-slate-900 text-white border-slate-900"
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Strip - Temu Bold Style */}
                    <div className="pt-2.5 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-base font-black text-[#E53935] font-mono leading-tight">
                            ₦{product.price.toLocaleString()}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              ₦{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {discountPercent && (
                          <span className="px-1.5 py-0.5 rounded bg-red-50 text-[#E53935] text-[10px] font-black uppercase">
                            Save {discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Select & View Details */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(product);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E53935]" />
                        <span>Quick View Details</span>
                      </button>

                      {/* Dual Action Buttons: Add to Cart & Buy Now */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const chosenSize = cardSelectedSizes[product.id] || product.sizes[0] || "M";
                            const chosenColor = cardSelectedColors[product.id] || product.colors[0]?.name || "Default";
                            addToCart(product, chosenSize, chosenColor, 1);
                            setCardAddedFeedback(prev => ({ ...prev, [product.id]: true }));
                            setTimeout(() => {
                              setCardAddedFeedback(prev => ({ ...prev, [product.id]: false }));
                            }, 1400);
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                            cardAddedFeedback[product.id]
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 shadow-2xs"
                          }`}
                          title="Add to Shopping Cart"
                        >
                          {cardAddedFeedback[product.id] ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#E53935]" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const chosenSize = cardSelectedSizes[product.id] || product.sizes[0] || "M";
                            const chosenColor = cardSelectedColors[product.id] || product.colors[0]?.name || "Default";
                            buyNow(product, chosenSize, chosenColor, 1);
                          }}
                          className="py-2 px-2 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs hover:shadow-md active:scale-95"
                          title="Instant Checkout"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
};

export default StoreView;

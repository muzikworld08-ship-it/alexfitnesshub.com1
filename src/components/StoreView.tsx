import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, Search, Filter, Sparkles, Star, Zap, 
  RotateCcw, Eye, ShieldCheck, Truck, ArrowRight, 
  Check, Flame, ChevronRight, SlidersHorizontal, RefreshCw,
  PackageSearch, X
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useApp, isEmailAdmin } from "../context/AppContext";
import { Product, ProductCategory } from "../types";
import { StoreHeroBanner } from "./store/StoreHeroBanner";
import { StoreFilterBar, ViewMode, PriceRange, SortOption } from "./store/StoreFilterBar";
import { StoreProductCard } from "./store/StoreProductCard";
import { StoreLookbookCard } from "./store/StoreLookbookCard";
import { StoreCompactRow } from "./store/StoreCompactRow";
import { ProductPermanentDeleteModal } from "./store/ProductPermanentDeleteModal";

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
    setSelectedProductForDetail,
    resetToDefaultProducts
  } = useStore();

  const { user } = useApp();
  const isAdmin = Boolean(user?.role === "admin" || (user?.email && isEmailAdmin(user.email)));

  // View Mode: Grid (default), Lookbook (editorial high-fashion), or Compact (quick dense order)
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>("all");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Admin Permanent Deletion Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const categories: ("All" | ProductCategory)[] = [
    "All",
    "Men",
    "Women",
    "ALEXFITNESSHUB Collections"
  ];

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (searchQuery.trim() !== "") count++;
    if (selectedPriceRange !== "all") count++;
    if (selectedSize !== "All") count++;
    if (inStockOnly) count++;
    if (sortBy !== "featured") count++;
    return count;
  }, [selectedCategory, searchQuery, selectedPriceRange, selectedSize, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSelectedPriceRange("all");
    setSelectedSize("All");
    setInStockOnly(false);
    setSortBy("featured");
  };

  // Filter & Sort Products (Optimized & Memoized)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }

        // Search
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const match = 
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.badge && p.badge.toLowerCase().includes(q)) ||
            (p.fabric && p.fabric.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Price Range
        if (selectedPriceRange === "under18k" && p.price >= 18000) return false;
        if (selectedPriceRange === "18kTo25k" && (p.price < 18000 || p.price > 25000)) return false;
        if (selectedPriceRange === "over25k" && p.price <= 25000) return false;

        // Size
        if (selectedSize !== "All" && !p.sizes.includes(selectedSize)) {
          return false;
        }

        // Availability
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 4.8) - (a.rating || 4.8);
        if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, selectedPriceRange, selectedSize, inStockOnly, sortBy]);

  // Direct Handlers
  const handleOpenDetail = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  const handleAddToCart = (product: Product, size: string, color: string) => {
    addToCart(product, size, color, 1);
  };

  const handleBuyNow = (product: Product, size: string, color: string) => {
    buyNow(product, size, color, 1);
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-slate-900 font-sans pb-28 animate-fade-in">
      
      {/* 1. STORE HERO: High-Performance Obsidian & Crimson Atmosphere */}
      <StoreHeroBanner
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat as any)}
      />

      {/* 2. EXPLORATION & FILTER TOOLBAR: View Switcher, Search, Sliders & Pills */}
      <StoreFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* 3. MAIN CATALOG / EXPLORATION CANVAS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              {selectedCategory === "All" ? "Full Collection" : selectedCategory}
            </span>
            <span className="text-xs font-bold text-slate-400">
              &bull; {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"} available
            </span>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoadingProducts && products.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Loading High-Performance Atelier Catalog...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search or Filters State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <PackageSearch className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 uppercase">
                No Matching Pieces Found
              </h3>
              <p className="text-xs text-slate-500">
                We couldn't find any products matching your current filters or search terms.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={resetToDefaultProducts}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Defaults</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Dynamic View Mode Render */
          <div>
            {/* 1. GRID SHOWCASE (Default 3-4 Column) */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 animate-fade-in">
                {filteredProducts.map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    onOpenDetail={handleOpenDetail}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onDeletePrompt={setProductToDelete}
                  />
                ))}
              </div>
            )}

            {/* 2. EDITORIAL LOOKBOOK (Magazine Split Card) */}
            {viewMode === "lookbook" && (
              <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
                {filteredProducts.map((product) => (
                  <StoreLookbookCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    onOpenDetail={handleOpenDetail}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onDeletePrompt={setProductToDelete}
                  />
                ))}
              </div>
            )}

            {/* 3. QUICK ORDER COMPACT LIST */}
            {viewMode === "compact" && (
              <div className="space-y-2.5 max-w-5xl mx-auto animate-fade-in">
                {filteredProducts.map((product) => (
                  <StoreCompactRow
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    onOpenDetail={handleOpenDetail}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onDeletePrompt={setProductToDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Admin Permanent Delete Confirmation Modal */}
      <ProductPermanentDeleteModal
        product={productToDelete}
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
      />

    </div>
  );
};

export default StoreView;

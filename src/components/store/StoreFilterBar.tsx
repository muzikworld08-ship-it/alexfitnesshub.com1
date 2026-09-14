import React from "react";
import { 
  Search, SlidersHorizontal, LayoutGrid, BookOpen, List, 
  X, Check, DollarSign, Filter, Sparkles, ArrowUpDown
} from "lucide-react";
import { ProductCategory } from "../../types";

export type ViewMode = "grid" | "lookbook" | "compact";
export type PriceRange = "all" | "under18k" | "18kTo25k" | "over25k";
export type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

interface StoreFilterBarProps {
  categories: ("All" | ProductCategory)[];
  selectedCategory: "All" | ProductCategory;
  onSelectCategory: (cat: "All" | ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedPriceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const StoreFilterBar: React.FC<StoreFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedSize,
  onSizeChange,
  inStockOnly,
  onInStockChange,
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  onResetFilters,
  activeFilterCount
}) => {
  const availableSizes = ["All", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* Main Row: Categories, Search, View Mode, Filter Toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* 1. Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 shrink-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
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

          {/* 2. Controls: Search, View Mode Switcher, Filter Toggle, Sort */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between lg:justify-end">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search gear, tees..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-100 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-red-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Grid View (3-4 Columns)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("lookbook")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "lookbook" ? "bg-white text-red-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Editorial Lookbook View"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("compact")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "compact" ? "bg-white text-red-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Quick Order Compact View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isFilterDrawerOpen || activeFilterCount > 0
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explore Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center shrink-0">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">New Releases</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Expandable Secondary Filter Panel */}
        {isFilterDrawerOpen && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs animate-fade-in">
            
            {/* Price Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Price Budget (NGN)
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => onPriceRangeChange("all")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedPriceRange === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Prices
                </button>
                <button
                  type="button"
                  onClick={() => onPriceRangeChange("under18k")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedPriceRange === "under18k" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  &lt; ₦18,000
                </button>
                <button
                  type="button"
                  onClick={() => onPriceRangeChange("18kTo25k")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedPriceRange === "18kTo25k" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  ₦18k - ₦25k
                </button>
                <button
                  type="button"
                  onClick={() => onPriceRangeChange("over25k")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedPriceRange === "over25k" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  &gt; ₦25,000
                </button>
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Filter by Size
              </span>
              <div className="flex flex-wrap gap-1">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onSizeChange(sz)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                      selectedSize === sz ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Availability
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onInStockChange(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">In-Stock Pieces Only</span>
              </label>
            </div>

            {/* Reset / Clear All */}
            <div className="flex items-end justify-end">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All ({activeFilterCount})</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

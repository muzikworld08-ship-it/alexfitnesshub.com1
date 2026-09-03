import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Star, ShoppingBag, Zap, Ruler, ShieldCheck, 
  RotateCcw, Truck, Check, AlertCircle, Eye, Flame,
  CheckCircle2, ChevronRight, Info, Heart, Share2, HelpCircle,
  Clock, Package, Award
} from "lucide-react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { SizeGuideModal } from "./store/SizeGuideModal";

interface ProductDetailViewProps {
  setView: (view: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ setView }) => {
  const { 
    products, 
    selectedProductForDetail, 
    setSelectedProductForDetail,
    addToCart, 
    buyNow,
    cartCount,
    setIsCartOpen 
  } = useStore();

  // If no product is specifically selected, fallback to first product or redirect
  const product: Product | undefined = selectedProductForDetail || products[0];

  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "sizing" | "shipping" | "reviews">("specs");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product?.id]);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setActiveView("front");
      setSelectedSize(product.sizes[0] || "M");
      setSelectedColor(product.colors[0]?.name || "Default");
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Product Not Found</h2>
        <p className="text-slate-500 mt-2 text-sm">Please select a product from our official fitness store.</p>
        <button
          onClick={() => setView("store")}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const currentImage = activeView === "front" 
    ? product.frontImage 
    : (product.backImage || product.frontImage);

  const selectedColorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
  const sizeStockCount = product.sizeStock?.[selectedSize] ?? product.stock ?? 20;
  const isOutOfStock = sizeStockCount <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    buyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (e) {}
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Other apparel items for cross-selling
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-36">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 lg:top-20 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <button
              type="button"
              onClick={() => setView("store")}
              className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-red-600 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Store</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium hidden sm:inline">{product.category}</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Share product link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 border border-slate-200 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer relative"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Top Product Hero: 2-Column Showcase */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 6-COLS: Interactive Image Showcase */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            
            {/* Main Stage Image with Badges and View Toggle */}
            <div className="relative aspect-4/5 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 select-none shadow-2xs">
              
              {/* Badges Top-Left */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.badge && (
                  <span className="px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-md shadow-sm flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    {product.badge}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-3 py-1 bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider rounded-md shadow-sm">
                    SAVE {discountPercent}%
                  </span>
                )}
                <span className="px-2.5 py-1 bg-white text-slate-800 font-bold text-[10px] uppercase tracking-wider rounded-md border border-slate-200 shadow-xs">
                  100% Authentic AFH
                </span>
              </div>

              {/* Main Image */}
              <img
                src={currentImage}
                alt={`${product.name} - ${activeView} view`}
                className="w-full h-full object-cover object-center transition-all duration-300 hover:scale-102"
              />

              {/* Front / Back Toggle Pill Anchored at Bottom Center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-full shadow-lg border border-white/20">
                <button
                  type="button"
                  onClick={() => setActiveView("front")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === "front" 
                      ? "bg-red-600 text-white shadow-xs" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Front View</span>
                </button>
                {product.backImage && (
                  <button
                    type="button"
                    onClick={() => setActiveView("back")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeView === "back" 
                        ? "bg-red-600 text-white shadow-xs" 
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Back View</span>
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3 justify-center pt-1">
              <button
                type="button"
                onClick={() => setActiveView("front")}
                className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeView === "front" 
                    ? "border-red-600 ring-2 ring-red-500/20 scale-105" 
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={product.frontImage} alt="Front Thumbnail" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-[9px] text-white font-bold text-center py-0.5">FRONT</span>
              </button>

              {product.backImage && (
                <button
                  type="button"
                  onClick={() => setActiveView("back")}
                  className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeView === "back" 
                      ? "border-red-600 ring-2 ring-red-500/20 scale-105" 
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={product.backImage} alt="Back Thumbnail" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-[9px] text-white font-bold text-center py-0.5">BACK</span>
                </button>
              )}
            </div>

            {/* Quality Guarantees Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col items-center text-center">
                <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-bold text-slate-800">Free Delivery</span>
                <span className="text-slate-500 text-[10px]">&gt; ₦25,000 Order</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col items-center text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-bold text-slate-800">100% Squat Proof</span>
                <span className="text-slate-500 text-[10px]">Zero Sheerness</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col items-center text-center">
                <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-bold text-slate-800">7-Day Swap</span>
                <span className="text-slate-500 text-[10px]">Easy Sizing Exchange</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col items-center text-center">
                <Zap className="w-4 h-4 text-amber-500 mb-1 fill-amber-500" />
                <span className="font-bold text-slate-800">Fast Dispatch</span>
                <span className="text-slate-500 text-[10px]">Ships in 24 Hours</span>
              </div>
            </div>
          </div>

          {/* RIGHT 6-COLS: Pricing, Variants, Sizing & Instant Buy */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Flash Deal Notice */}
              <div className="flex items-center justify-between bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-white text-white" />
                  <span>Limited Edition Athletic Drop</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold">
                  <span>⚡ 94% Claimed</span>
                </div>
              </div>

              {/* Title, Category & Ratings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                    {product.category} Collection
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="font-black">{product.rating || 4.9}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount || 128} verified reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Bold Temu-Style Pricing Strip */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#E53935] font-mono tracking-tight">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg sm:text-xl text-slate-400 line-through font-mono">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 font-black text-xs uppercase rounded-md">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                  <span>🔥 Over 1,240 sold</span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Official Verified Stock
                  </span>
                </p>
              </div>

              {/* Color Swatch Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900 uppercase tracking-wider">
                      Select Color: <span className="text-red-600 font-bold normal-case ml-1">{selectedColor}</span>
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">{product.colors.length} Colorways</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? "border-slate-900 bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20" 
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                            style={{ backgroundColor: c.hex }} 
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector + Size Guide Link */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900 uppercase tracking-wider">
                    Select Size: <span className="text-slate-900 font-mono font-black ml-1">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size & Fit Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    const stockForThisSize = product.sizeStock?.[sz] ?? product.stock ?? 10;
                    const isSizeSoldOut = stockForThisSize <= 0;

                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={isSizeSoldOut}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center border ${
                          isSizeSoldOut
                            ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-red-600 text-white border-red-600 shadow-sm ring-2 ring-red-500/20"
                              : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <span className="uppercase text-sm">{sz}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Stock Indicator Status */}
                <div className="pt-1 flex items-center gap-2 text-xs">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Size {selectedSize} is currently out of stock
                    </span>
                  ) : sizeStockCount <= 5 ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Hurry! Only {sizeStockCount} left in Size {selectedSize}
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      In Stock — Ready to ship immediately
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-slate-700 hover:text-slate-900 font-black disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-xs font-black text-slate-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(sizeStockCount, q + 1))}
                    disabled={quantity >= sizeStockCount}
                    className="px-3.5 py-2 text-slate-700 hover:text-slate-900 font-black disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* In-Page Action Buttons for Users at the Top */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  isOutOfStock 
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                    : justAdded
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-slate-400 shadow-xs"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-[#E53935] hover:bg-[#C62828] text-white shadow-red-500/25 active:scale-[0.98]"
                }`}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

          </div>

        </div>

        {/* COMPREHENSIVE DESCRIPTIONS & SPECIFICATIONS SECTION */}
        <div className="mt-10 space-y-8">
          
          {/* Detailed Narrative & Performance Highlights */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5 mb-4">
              <Info className="w-6 h-6 text-red-600" />
              Full Product Description & Engineering
            </h2>
            
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Bulleted Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-3">
                  Key Athletic Engineering Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5 mb-6">
              <Award className="w-6 h-6 text-red-600" />
              Technical Specifications & Garment Anatomy
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70 w-1/3">
                      Fabric Material
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {product.fabric || "88% Premium Poly-Mesh, 12% High-Elastic Spandex"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      GSM Density
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      280 GSM Heavyweight Squat-Proof Knit
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      Fit Profile
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {product.sizeGuide?.fitType || "Athletic Tapered / Kinetic Body-Contour"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      Stretch & Elasticity
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      4-Way Kinetic Multi-Directional Stretch
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      Stitching & Seams
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      Reinforced Flatlock Anti-Chafing Structural Seams
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      Moisture Management
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      Hydro-Vent Capillary Wicking (Rapid Evaporation)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      Garment Care
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      Machine wash cold (30°C) &bull; Hang dry &bull; Do not bleach &bull; Warm iron inside-out
                    </td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase text-[11px] bg-slate-50/70">
                      Recommended Disciplines
                    </th>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      Heavy Squats, Deadlifts, Hypertrophy, Cardio Shredding, Daily Athleisure
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sizing & Measurement Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5">
                  <Ruler className="w-6 h-6 text-red-600" />
                  Official Size Chart & Measurements
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Accurate dimensions in inches and centimeters. Model wears Size L (6'1", 88kg).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
              >
                <Ruler className="w-3.5 h-3.5 text-red-600" />
                <span>Full Measurement Guide</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs sm:text-sm border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-3 px-4 font-black uppercase text-xs">Size</th>
                    <th className="py-3 px-4 font-black uppercase text-xs">Chest / Bust</th>
                    <th className="py-3 px-4 font-black uppercase text-xs">Waist</th>
                    <th className="py-3 px-4 font-black uppercase text-xs">Hips</th>
                    <th className="py-3 px-4 font-black uppercase text-xs">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className={selectedSize === "S" ? "bg-red-50 font-bold" : "hover:bg-slate-50"}>
                    <td className="py-3 px-4 font-black text-red-600">S (Small)</td>
                    <td className="py-3 px-4 text-slate-700">36 - 38" (91-96 cm)</td>
                    <td className="py-3 px-4 text-slate-700">29 - 31" (73-78 cm)</td>
                    <td className="py-3 px-4 text-slate-700">36 - 38" (91-96 cm)</td>
                    <td className="py-3 px-4 text-slate-700">27.5" (70 cm)</td>
                  </tr>
                  <tr className={selectedSize === "M" ? "bg-red-50 font-bold" : "hover:bg-slate-50"}>
                    <td className="py-3 px-4 font-black text-red-600">M (Medium)</td>
                    <td className="py-3 px-4 text-slate-700">39 - 41" (99-104 cm)</td>
                    <td className="py-3 px-4 text-slate-700">32 - 34" (81-86 cm)</td>
                    <td className="py-3 px-4 text-slate-700">39 - 41" (99-104 cm)</td>
                    <td className="py-3 px-4 text-slate-700">28.5" (72 cm)</td>
                  </tr>
                  <tr className={selectedSize === "L" ? "bg-red-50 font-bold" : "hover:bg-slate-50"}>
                    <td className="py-3 px-4 font-black text-red-600">L (Large)</td>
                    <td className="py-3 px-4 text-slate-700">42 - 44" (106-111 cm)</td>
                    <td className="py-3 px-4 text-slate-700">35 - 37" (89-94 cm)</td>
                    <td className="py-3 px-4 text-slate-700">42 - 44" (106-111 cm)</td>
                    <td className="py-3 px-4 text-slate-700">29.5" (75 cm)</td>
                  </tr>
                  <tr className={selectedSize === "XL" ? "bg-red-50 font-bold" : "hover:bg-slate-50"}>
                    <td className="py-3 px-4 font-black text-red-600">XL (Extra Large)</td>
                    <td className="py-3 px-4 text-slate-700">45 - 47" (114-119 cm)</td>
                    <td className="py-3 px-4 text-slate-700">38 - 40" (96-101 cm)</td>
                    <td className="py-3 px-4 text-slate-700">45 - 47" (114-119 cm)</td>
                    <td className="py-3 px-4 text-slate-700">30.5" (77 cm)</td>
                  </tr>
                  <tr className={selectedSize === "XXL" ? "bg-red-50 font-bold" : "hover:bg-slate-50"}>
                    <td className="py-3 px-4 font-black text-red-600">XXL (2X Large)</td>
                    <td className="py-3 px-4 text-slate-700">48 - 51" (122-129 cm)</td>
                    <td className="py-3 px-4 text-slate-700">41 - 44" (104-111 cm)</td>
                    <td className="py-3 px-4 text-slate-700">48 - 51" (122-129 cm)</td>
                    <td className="py-3 px-4 text-slate-700">31.5" (80 cm)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping, Delivery & Easy 7-Day Sizing Returns */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5 mb-6">
              <Truck className="w-6 h-6 text-red-600" />
              Fast Delivery & 7-Day Sizing Exchange Guarantee
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>Lagos Metropolis Delivery</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Same-day or next-day delivery within 24 hours via express bike dispatch. Fixed flat rate or FREE for orders over ₦25,000.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                  <Package className="w-4 h-4 text-red-600" />
                  <span>Nationwide Interstate</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Delivered safely to Abuja, Port Harcourt, Ibadan, Enugu, and all 36 states in 2 to 4 business days with real-time SMS tracking.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span>7-Day Sizing Exchange</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If the fit isn't 100% flattering, exchange for another size within 7 days hassle-free. Must be unwashed with tags intact.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Testimonials */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  Verified Athlete Reviews
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Rated {product.rating || 4.9} out of 5 stars based on {product.reviewsCount || 128} verified purchases.
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm font-black text-slate-900 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
                <span className="text-amber-600 font-mono text-base">{product.rating || 4.9}</span>
                <span className="text-amber-500">★ ★ ★ ★ ★</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                      TC
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Tunde C.</div>
                      <div className="text-[10px] text-slate-400">Verified Buyer &bull; Size L</div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "The quality blew me away. 100% squat proof and feels like Gymshark/Alphalete tier fabric. The tapered cut makes the shoulders pop while giving plenty of breathing room around the waist."
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">
                      AO
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Amara O.</div>
                      <div className="text-[10px] text-slate-400">Verified Buyer &bull; Size M</div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "Fastest delivery ever in Lekki Phase 1—ordered in the morning and had it by 4 PM. Fabric holds its shape after multiple wash cycles. Going to order two more colorways!"
                </p>
              </div>
            </div>
          </div>

          {/* Related / Matching Apparel Section */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Complete Your Training Fit
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Matching activewear from the {product.category} collection.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView("store")}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Store</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    onClick={() => {
                      setSelectedProductForDetail(relProduct);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-red-500/50 p-3 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-200 mb-2.5">
                      <img
                        src={relProduct.frontImage}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {relProduct.name}
                      </h4>
                      <div className="text-xs font-black text-red-600 font-mono">
                        ₦{relProduct.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 
        =======================================================================
        CRITICAL REQUIREMENT:
        PINNED BUY NOW BOTTOM HEADER / ACTION BAR (WITHOUT SCROLLING WITH THE PAGE)
        Permanently affixed to the bottom of the viewport at all times!
        =======================================================================
      */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          
          {/* Left: Product Thumbnail & Live Selected Specs */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-13 sm:w-13 sm:h-15 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm sm:text-base font-black text-[#E53935] font-mono leading-none">
                  ₦{(product.price * quantity).toLocaleString()}
                </span>
                
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-black uppercase">
                  Size: {selectedSize}
                </span>

                {selectedColor && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                    <span 
                      className="w-2 h-2 rounded-full border border-black/20" 
                      style={{ backgroundColor: selectedColorObj?.hex || "#111" }} 
                    />
                    {selectedColor}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Dual Pinned Actions (Add to Cart & Prominent Buy Now) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                isOutOfStock 
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                  : justAdded
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 shadow-2xs"
              }`}
              title="Add to Shopping Cart"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden xs:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#E53935]" />
                  <span className="hidden xs:inline">Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`py-2.5 sm:py-3 px-4 sm:px-7 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                isOutOfStock
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-[#E53935] hover:bg-[#C62828] text-white shadow-red-500/30 hover:shadow-red-500/50 active:scale-95"
              }`}
              title="Instant Checkout"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>

        </div>
      </div>

      {/* Official Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
        productName={product.name}
        sizeGuide={product.sizeGuide}
      />
    </div>
  );
};

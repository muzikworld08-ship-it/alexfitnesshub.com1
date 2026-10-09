import React, { useState, useEffect, useMemo } from "react";
import { 
  FileText, Search, Filter, Download, Eye, Sparkles, 
  CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, ShoppingBag, 
  Layers, BookOpen, ChevronRight, Zap
} from "lucide-react";
import { PrintablePdfProduct } from "../../types/printablePdf";
import { printablePdfService } from "../../services/printablePdfService";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { db } from "../../lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

interface PrintablePdfStoreViewProps {
  onSelectProduct: (productId: string) => void;
  onNavigateMyProducts: () => void;
}

export const PrintablePdfStoreView: React.FC<PrintablePdfStoreViewProps> = ({
  onSelectProduct,
  onNavigateMyProducts,
}) => {
  const [products, setProducts] = useState<PrintablePdfProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewProduct, setPreviewProduct] = useState<PrintablePdfProduct | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCatalog() {
      try {
        setLoading(true);
        const list = await printablePdfService.getProducts();
        if (isMounted) setProducts(list);
      } catch (e) {
        console.warn("[PDF Store] Error loading catalog:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCatalog();

    const handleCatalogChanged = () => {
      fetchCatalog();
    };
    window.addEventListener("fit-pdf-catalog-changed", handleCatalogChanged);

    let unsubProducts: () => void = () => {};
    if (db) {
      try {
        unsubProducts = onSnapshot(collection(db, "printable_pdf_products"), () => {
          fetchCatalog();
        });
      } catch {}
    }

    return () => {
      isMounted = false;
      window.removeEventListener("fit-pdf-catalog-changed", handleCatalogChanged);
      unsubProducts();
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-mono font-black uppercase px-3 py-1 rounded-full shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              Official Digital Stationery
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              Printable & Tablet Ready
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Printable Fitness Journals & Nutrition Guides
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Master your physique progression with coach Alex's field-tested printable workbooks, meal prep planners, caloric deficit journals, and habit accountability sheets.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Download Access</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Personalized Photo Option</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Secure Paystack Checkout</span>
            </div>
          </div>
        </div>

        {/* Quick link button to My Digital Products */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
          <span className="text-xs text-slate-400 font-mono">
            Already purchased a PDF edition?
          </span>
          <button
            onClick={onNavigateMyProducts}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-slate-700 shadow-sm"
          >
            <FileText className="w-4 h-4 text-red-400" />
            <span>Access My Digital Products</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Products" : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides & journals..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading printable PDF catalog...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Cover Showcase */}
              <div className="relative bg-slate-100 aspect-[4/3] overflow-hidden">
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 select-none"
                />

                {/* Category & Personalization Tags */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                    {product.category}
                  </span>
                  {product.requiresPersonalization && (
                    <span className="bg-slate-950/90 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm border border-amber-400/30">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Personalized
                    </span>
                  )}
                </div>

                {/* Page count pill */}
                <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-sm">
                  {product.pageCount} Pages
                </div>

                {/* Hover Quick Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewProduct(product)}
                  className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-900 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-red-600" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-red-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Bottom Row: Price & Buy Now */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Price</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                      ₦{product.priceNGN.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product.id)}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-900">No Matching PDF Products</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Preview Modal */}
      <PdfPreviewModal
        product={previewProduct}
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        onBuyNow={() => {
          if (previewProduct) {
            const pid = previewProduct.id;
            setPreviewProduct(null);
            onSelectProduct(pid);
          }
        }}
      />
    </div>
  );
};

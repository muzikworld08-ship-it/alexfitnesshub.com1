import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, FileText, Download, 
  Sparkles, Lock, AlertCircle, RefreshCw, Eye, Star, Layers, Calendar, ChevronRight
} from "lucide-react";
import { PrintablePdfProduct } from "../../types/printablePdf";
import { PhotoUploadField } from "./PhotoUploadField";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { printablePdfService } from "../../services/printablePdfService";
import { useApp } from "../../context/AppContext";

interface PdfProductDetailViewProps {
  productId: string;
  onBack: () => void;
  onOrderSuccess: (orderId: string, reference: string) => void;
}

export const PdfProductDetailView: React.FC<PdfProductDetailViewProps> = ({
  productId,
  onBack,
  onOrderSuccess,
}) => {
  const { user } = useApp();
  const [product, setProduct] = useState<PrintablePdfProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Checkout inputs
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setCustomerEmail(user.email);
    }
    if (user?.displayName) {
      setCustomerName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const p = await printablePdfService.getProductById(productId);
        if (isMounted) {
          if (p) {
            setProduct(p);
          } else {
            setError("The requested PDF product could not be found.");
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to load product.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleBuyNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setCheckoutError(null);

    // Validation
    const cleanEmail = customerEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setCheckoutError("Please provide a valid email address to receive your secure PDF download.");
      return;
    }

    if (product.requiresPersonalization && !photoBase64) {
      setCheckoutError("This product includes a personalized cover. Please upload your photo before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await printablePdfService.initializeOrder({
        productId: product.id,
        customerEmail: cleanEmail,
        customerName: customerName.trim() || undefined,
        photoBase64: photoBase64 || undefined,
        photoFilename: photoFile?.name || undefined,
      });

      if (res.success) {
        if (res.authorization_url && !res.simulated) {
          // Paystack Checkout Redirect
          window.location.href = res.authorization_url;
        } else {
          // Simulated or Immediate Verification Flow
          await printablePdfService.verifyOrder(res.reference, res.orderId);
          onOrderSuccess(res.orderId, res.reference);
        }
      } else {
        setCheckoutError(res.error || "Unable to initialize checkout. Please try again.");
      }
    } catch (err: any) {
      setCheckoutError(err.message || "A checkout error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-sm font-bold text-slate-600">Loading PDF product specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">{error || "This printable product is currently unavailable."}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to PDF Store</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Back to Printable PDFs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cover & Preview Showcase (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {product.category}
              </span>
              {product.requiresPersonalization && (
                <span className="bg-slate-950/90 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Personalized With Your Photo
                </span>
              )}
            </div>

            {/* Preview trigger button */}
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
            >
              <Eye className="w-4 h-4 text-red-600" />
              <span>Preview Pages</span>
            </button>
          </div>

          {/* Quick specs pill strip */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Pages</span>
              <span className="text-sm font-black text-slate-900">{product.pageCount} Pages</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Format</span>
              <span className="text-sm font-black text-slate-900">High-Res PDF</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Delivery</span>
              <span className="text-sm font-black text-emerald-600">Instant</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Benefits, Photo Upload & Checkout (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600">
                Official AlexFitnessHub Digital Edition
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              {product.shortDescription}
            </p>
          </div>

          {/* Price Banner */}
          <div className="p-4 sm:p-5 bg-red-50/70 border border-red-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-red-600 uppercase font-bold tracking-wider block">
                Official Digital License
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₦{product.priceNGN.toLocaleString()}
                </span>
                {product.originalPriceNGN && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ₦{product.originalPriceNGN.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Paystack Verified
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">One-time payment • Lifetime access</span>
            </div>
          </div>

          {/* Benefits Grid */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                What's Included In This Edition:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 font-medium leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full description */}
          <div className="space-y-2 border-t border-slate-200 pt-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Product Overview & Specifications
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleBuyNow} className="border-t border-slate-200 pt-6 space-y-5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Instant Order Details & Delivery
              </h3>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Customer Email Address</span>
                <span className="text-red-600 font-mono text-[11px]">* Required for PDF link</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. athlete@example.com"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Your secure PDF download token will be linked to this email address.
              </p>
            </div>

            {/* Personalization Photo Upload Field */}
            {product.requiresPersonalization && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Cover Personalization Photo
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Upload your fitness photo to appear proudly on your custom-generated PDF edition.
                </p>
                <PhotoUploadField
                  required={true}
                  onPhotoSelected={(b64, file) => {
                    setPhotoBase64(b64);
                    setPhotoFile(file);
                  }}
                />
              </div>
            )}

            {checkoutError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Purchase CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Securing Order on Paystack...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Buy Now with Paystack — ₦{product.priceNGN.toLocaleString()}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-bit Encrypted
              </span>
              <span>•</span>
              <span>Instant Download Access</span>
              <span>•</span>
              <span>No Subscription</span>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      <PdfPreviewModal
        product={product}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onBuyNow={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
      />
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Download, RefreshCw, FileText, ArrowRight, 
  ShieldCheck, AlertCircle, Clock, Sparkles, Home, ShoppingBag
} from "lucide-react";
import { PrintablePdfOrder } from "../../types/printablePdf";
import { printablePdfService } from "../../services/printablePdfService";

interface PdfDownloadSuccessViewProps {
  orderId?: string;
  reference?: string;
  onNavigateHome: () => void;
  onNavigateStore: () => void;
  onNavigateMyProducts: () => void;
}

export const PdfDownloadSuccessView: React.FC<PdfDownloadSuccessViewProps> = ({
  orderId: initialOrderId,
  reference: initialReference,
  onNavigateHome,
  onNavigateStore,
  onNavigateMyProducts,
}) => {
  // Extract from query params if not passed directly
  const [orderId, setOrderId] = useState<string>(() => {
    if (initialOrderId) return initialOrderId;
    const params = new URLSearchParams(window.location.search);
    return params.get("orderId") || "";
  });

  const [reference, setReference] = useState<string>(() => {
    if (initialReference) return initialReference;
    const params = new URLSearchParams(window.location.search);
    return params.get("reference") || params.get("trxref") || "";
  });

  const [order, setOrder] = useState<PrintablePdfOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // 1. Initial verification & order fetching
  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        setLoading(true);
        if (reference) {
          // Verify with backend
          const verifyRes = await printablePdfService.verifyOrder(reference, orderId);
          if (verifyRes.order && !isCancelled) {
            setOrder(verifyRes.order);
            setOrderId(verifyRes.order.id);
            setLoading(false);
            return;
          }
        }

        if (orderId) {
          const ord = await printablePdfService.getOrderStatus(orderId);
          if (!isCancelled && ord) {
            setOrder(ord);
          }
        }
      } catch (err: any) {
        if (!isCancelled) setError(err.message || "Failed to load order details.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    init();
    return () => {
      isCancelled = true;
    };
  }, [reference, orderId]);

  // 2. Auto-polling loop if PDF generation is still processing
  useEffect(() => {
    if (!order) return;
    if (order.pdfGenerationStatus === "ready" || order.pdfGenerationStatus === "failed") return;

    // Personalized generation in progress -> poll every 2.5s
    const timer = setTimeout(async () => {
      try {
        const latest = await printablePdfService.getOrderStatus(order.id);
        if (latest) {
          setOrder(latest);
          setPollCount((prev) => prev + 1);
        }
      } catch (e) {
        console.warn("[Polling Error]", e);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [order, pollCount]);

  const handleDownload = () => {
    if (!order || !order.downloadToken) return;
    const downloadUrl = printablePdfService.getDownloadUrl(order.downloadToken);
    window.location.href = downloadUrl;
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-red-600 animate-spin mx-auto" />
        <h2 className="text-xl font-black text-slate-900">Verifying Payment...</h2>
        <p className="text-xs text-slate-500">Confirming your transaction with Paystack and securing your PDF license.</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Order Verification Notice</h2>
        <p className="text-sm text-slate-600">{error}</p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onNavigateStore}
            className="py-2.5 px-5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
          >
            PDF Store
          </button>
          <button
            onClick={onNavigateHome}
            className="py-2.5 px-5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Home View
          </button>
        </div>
      </div>
    );
  }

  const isReady = order?.pdfGenerationStatus === "ready";
  const isGenerating = order?.pdfGenerationStatus === "processing" || order?.pdfGenerationStatus === "pending";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Success Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-50/80 to-white border-b border-slate-100 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payment Successful</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isReady ? "Your ALEXFITNESSHUB printable PDF is ready." : "Payment Confirmed!"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {isReady 
              ? "Your digital edition has been compiled and is ready for immediate download and offline printing."
              : "Thank you for your purchase! We are finalizing your digital file right now."}
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Product Name</span>
              <span className="text-sm font-black text-slate-900 text-right">
                {order?.productTitle || "Printable PDF Edition"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Order Number</span>
              <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {order?.orderNumber || order?.id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Delivery Email</span>
              <span className="text-xs font-medium text-slate-800 font-mono">
                {order?.customerEmail}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Payment Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PAID (₦{order?.amountNGN.toLocaleString()})
              </span>
            </div>

            {order?.personalizationRequired && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Personalization</span>
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Custom Cover Photo Applied
                </span>
              </div>
            )}
          </div>

          {/* Action Zone: Download vs Polling */}
          {isReady ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF Now</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 font-mono">
                High-Resolution Printable PDF • Download count: {order?.downloadCount || 0}
              </p>
            </div>
          ) : isGenerating ? (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-800 font-black text-sm uppercase tracking-wide">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>Your personalized PDF is being prepared...</span>
              </div>
              <p className="text-xs text-amber-700/90 max-w-md mx-auto">
                We are rendering your uploaded photo into the designated photo area while preserving high-resolution vectors and formatting. This usually takes just a few seconds.
              </p>
              <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
              <p className="text-xs font-bold text-red-700">
                PDF generation encountered a slight delay. Please click below to refresh status.
              </p>
              <button
                onClick={() => setPollCount((prev) => prev + 1)}
                className="py-2 px-4 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Check Status Again
              </button>
            </div>
          )}

          {/* Email notice */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Secure Access Token Saved: </span>
              A permanent copy of your download link has been registered to your email. You can also view this anytime under your AlexFitnessHub account in "My Digital Products".
            </div>
          </div>

          {/* Navigation Links */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onNavigateMyProducts}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
              <span>View In "My Digital Products"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateStore}
                className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>PDF Catalog</span>
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

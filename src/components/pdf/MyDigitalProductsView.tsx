import React, { useState, useEffect } from "react";
import { 
  FileText, Download, CheckCircle2, Clock, Search, 
  ShoppingBag, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Sparkles
} from "lucide-react";
import { PrintablePdfOrder } from "../../types/printablePdf";
import { printablePdfService } from "../../services/printablePdfService";
import { useApp } from "../../context/AppContext";

interface MyDigitalProductsViewProps {
  onNavigateStore?: () => void;
}

export const MyDigitalProductsView: React.FC<MyDigitalProductsViewProps> = ({
  onNavigateStore,
}) => {
  const { user } = useApp();
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [orders, setOrders] = useState<PrintablePdfOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersForEmail = async (emailToQuery: string) => {
    const clean = emailToQuery.trim().toLowerCase();
    if (!clean || !clean.includes("@")) return;

    setLoading(true);
    setError(null);
    try {
      const results = await printablePdfService.getMyOrders(clean);
      setOrders(results);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve digital orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      setEmailInput(user.email);
      fetchOrdersForEmail(user.email);
    }
  }, [user?.email]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrdersForEmail(emailInput);
  };

  const handleDownload = (order: PrintablePdfOrder) => {
    if (!order.downloadToken || order.paymentStatus !== "paid") {
      alert("This order is unpaid or pending confirmation. Downloads are only available for confirmed paid orders.");
      return;
    }
    const downloadUrl = printablePdfService.getDownloadUrl(order.downloadToken);
    window.location.href = downloadUrl;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="p-5 sm:p-7 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border border-red-200">
              <FileText className="w-3.5 h-3.5 text-red-600" />
              Digital Library
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Instant Download Access
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
            My Digital Products & Printable PDFs
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium">
            Permanent download access for your purchased journals, meal planners, nutrition blueprints, and workout logsheets.
          </p>
        </div>

        {onNavigateStore && (
          <button
            onClick={onNavigateStore}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-red-500" />
            <span>Browse PDF Store</span>
          </button>
        )}
      </div>

      {/* Guest/Email Lookup Bar (if not logged in or searching another email) */}
      <form onSubmit={handleSearchSubmit} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter customer email to view purchased PDFs..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Looking up...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Lookup Orders</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Retrieving digital products...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const isPaid = order.paymentStatus === "paid";
            const isReady = order.pdfGenerationStatus === "ready";
            const dateStr = order.paidAt || order.createdAt;
            const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }) : "Recent";

            return (
              <div
                key={order.id}
                className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-slate-900 truncate">
                        {order.productTitle}
                      </h3>
                      {order.personalizationRequired && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Personalized
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono flex-wrap">
                      <span>Order: {order.orderNumber || order.id}</span>
                      <span>•</span>
                      <span>Purchased: {formattedDate}</span>
                      <span>•</span>
                      <span>₦{order.amountNGN.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status & Download Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Paid & Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Payment Pending</span>
                      </span>
                    )}
                  </div>

                  {isPaid ? (
                    <button
                      onClick={() => handleDownload(order)}
                      disabled={!isReady}
                      className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isReady ? "Download PDF" : "Preparing..."}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">Unpaid</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : searched ? (
        <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">No PDF Purchases Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any printable PDF orders associated with <span className="font-bold text-slate-800 font-mono">{emailInput}</span>. If you used a different email on Paystack, enter that above.
          </p>
          {onNavigateStore && (
            <button
              onClick={onNavigateStore}
              className="inline-flex items-center gap-1.5 py-2 px-4 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer mt-2"
            >
              <span>Explore Printable PDF Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">
            Enter your customer email above to retrieve all your past printable PDF downloads.
          </p>
        </div>
      )}
    </div>
  );
};

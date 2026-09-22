import React, { useState } from "react";
import { Trash2, AlertTriangle, X, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { Product } from "../../types";
import { useStore } from "../../context/StoreContext";

interface ProductPermanentDeleteModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: (productId: string) => void;
}

export const ProductPermanentDeleteModal: React.FC<ProductPermanentDeleteModalProps> = ({
  product,
  isOpen,
  onClose,
  onDeleted
}) => {
  const { permanentlyDeleteProduct } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await permanentlyDeleteProduct(product.id);
      if (res.success) {
        setSuccess(true);
        if (onDeleted) {
          onDeleted(product.id);
        }
        setTimeout(() => {
          setSuccess(false);
          setIsDeleting(false);
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || "Failed to permanently delete product.");
        setIsDeleting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during deletion.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-950/60 shadow-2xl overflow-hidden animate-scale-in p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Product Permanently Deleted
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                "{product.name}" has been permanently purged from the store catalog & database.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header Icon & Title */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0 border border-red-200 dark:border-red-900/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
                    Admin Action
                  </span>
                  <span className="text-[11px] font-bold text-red-600 uppercase">
                    Irreversible
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Permanently Delete Product?
                </h3>
              </div>
            </div>

            {/* Product Card Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
              <div className="w-14 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600">
                <img
                  src={product.frontImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {product.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{product.category}</span>
                  <span>&bull;</span>
                  <span className="font-mono font-bold text-red-600">₦{product.price.toLocaleString()}</span>
                  <span>&bull;</span>
                  <span>{product.stock} in stock</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  ID: {product.id}
                </div>
              </div>
            </div>

            {/* Warning Message Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">This deletion is permanent and immediate:</p>
                <ul className="text-[11px] text-amber-800 dark:text-amber-300 list-disc list-inside space-y-0.5">
                  <li>Document will be expunged from Firestore `products`</li>
                  <li>Item will be purged from all user shopping carts</li>
                  <li>Catalog and search index will be instantly refreshed</li>
                  <li>This item will not reappear on restart or reload</li>
                </ul>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

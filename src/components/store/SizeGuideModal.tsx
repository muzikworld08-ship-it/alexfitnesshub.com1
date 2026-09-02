import React from "react";
import { X, Ruler, ShieldCheck } from "lucide-react";
import { ProductSizeGuide } from "../../types";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: "Men" | "Women" | "ALEXFITNESSHUB Collections";
  productName: string;
  sizeGuide?: ProductSizeGuide;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category,
  productName,
  sizeGuide
}) => {
  if (!isOpen) return null;

  const isWomen = category === "Women";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Official Size Guide</h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-sm">{productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close Size Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Fit Advice Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Fit Recommendation: {sizeGuide?.fitType || "Athletic Tapered"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sizeGuide?.notes || (isWomen 
                  ? "Our fabrics offer dynamic 4-way compression. If you are between sizes, we recommend ordering your true size for a supportive fit, or sizing up for a relaxed drape." 
                  : "Athletic cut through the chest and shoulders with an ergonomic drape. If you prefer an oversized pump cover fit, select one size up.")}
              </p>
            </div>
          </div>

          {/* Sizing Matrix Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                {isWomen ? "Women's Performance Apparel Matrix" : "Men's & Unisex Sizing Matrix"}
              </span>
              <span className="text-[11px] font-bold text-slate-400">Measurements in Inches (\")</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Chest / Bust</th>
                    <th className="py-3 px-4">Waist</th>
                    <th className="py-3 px-4">Hips</th>
                    <th className="py-3 px-4">Standard Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {isWomen ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">XS</td>
                        <td className="py-3 px-4">30 - 32\"</td>
                        <td className="py-3 px-4">23 - 25\"</td>
                        <td className="py-3 px-4">33 - 35\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">UK 4-6 / US 0-2</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">S</td>
                        <td className="py-3 px-4">33 - 35\"</td>
                        <td className="py-3 px-4">26 - 28\"</td>
                        <td className="py-3 px-4">36 - 38\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">UK 8-10 / US 4-6</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">M</td>
                        <td className="py-3 px-4">36 - 38\"</td>
                        <td className="py-3 px-4">29 - 31\"</td>
                        <td className="py-3 px-4">39 - 41\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">UK 12-14 / US 8-10</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">L</td>
                        <td className="py-3 px-4">39 - 41\"</td>
                        <td className="py-3 px-4">32 - 34\"</td>
                        <td className="py-3 px-4">42 - 44\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">UK 16 / US 12</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">XL</td>
                        <td className="py-3 px-4">42 - 44\"</td>
                        <td className="py-3 px-4">35 - 37\"</td>
                        <td className="py-3 px-4">45 - 47\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">UK 18 / US 14</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">S</td>
                        <td className="py-3 px-4">36 - 38\"</td>
                        <td className="py-3 px-4">29 - 31\"</td>
                        <td className="py-3 px-4">35 - 37\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Athletic S</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">M</td>
                        <td className="py-3 px-4">39 - 41\"</td>
                        <td className="py-3 px-4">32 - 34\"</td>
                        <td className="py-3 px-4">38 - 40\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Athletic M</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">L</td>
                        <td className="py-3 px-4">42 - 44\"</td>
                        <td className="py-3 px-4">35 - 37\"</td>
                        <td className="py-3 px-4">41 - 43\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Athletic L</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">XL</td>
                        <td className="py-3 px-4">45 - 47\"</td>
                        <td className="py-3 px-4">38 - 40\"</td>
                        <td className="py-3 px-4">44 - 46\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Athletic XL</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">XXL</td>
                        <td className="py-3 px-4">48 - 50\"</td>
                        <td className="py-3 px-4">41 - 43\"</td>
                        <td className="py-3 px-4">47 - 49\"</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Athletic XXL</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure Quick Instructions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">How to Measure Accurately</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">1. Chest / Bust</span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  Measure around the fullest part of your chest, keeping the tape level across your shoulder blades.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">2. Natural Waist</span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  Measure around your natural waistline, just above your hip bones, keeping tape comfortably loose.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">3. Hips / Glutes</span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  Stand with feet together and measure around the fullest point of your hips and gluteus maximus.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Free exchanges within 7 days of delivery</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

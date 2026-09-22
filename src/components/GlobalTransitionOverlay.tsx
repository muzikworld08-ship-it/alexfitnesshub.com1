import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";

interface GlobalTransitionOverlayProps {
  isVisible: boolean;
}

export default function GlobalTransitionOverlay({ isVisible }: GlobalTransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center p-6 text-slate-900 select-none font-sans"
        >
          <div className="flex flex-col items-center justify-center space-y-6 max-w-sm w-full text-center">
            {/* Animated Brand Logo */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center"
            >
              <Logo size="md" showText={true} showSubtext={true} />
            </motion.div>

            {/* Spinner Progress Indicator */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-full shadow-xs">
              <span className="w-4 h-4 border-2 border-[#E53935] border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                Initializing Platform...
              </span>
            </div>

            {/* Subtext */}
            <p className="text-[11px] text-slate-400 font-medium">
              Loading live workout routines, AI calibration & athlete profile
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

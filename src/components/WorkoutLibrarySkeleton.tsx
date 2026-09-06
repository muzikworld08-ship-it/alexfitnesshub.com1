import React from "react";
import { Skeleton } from "./SkeletonLoader";

interface WorkoutLibrarySkeletonProps {
  viewMode?: "exercises" | "categories" | "routines";
  count?: number;
}

export default function WorkoutLibrarySkeleton({
  viewMode = "exercises",
  count = 6
}: WorkoutLibrarySkeletonProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Filter Bar & Search Skeleton */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-56 sm:w-72 rounded-lg" />
            <Skeleton className="h-4 w-40 sm:w-96 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <div className="flex gap-2 shrink-0">
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2 overflow-x-hidden pt-1">
          {["w-20", "w-28", "w-24", "w-32", "w-20", "w-28", "w-28", "w-20"].map((wClass, idx) => (
            <Skeleton key={idx} className={`h-8 rounded-full shrink-0 ${wClass}`} />
          ))}
        </div>
      </div>

      {/* Results Header Count & Sort Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Main List: Frameless Responsive Straight-Line Cards matching dashboard layout */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-stretch"
          >
            {/* Left: Frameless Media Preview Skeleton (16:10 aspect box) */}
            <div className="w-full md:w-72 lg:w-80 h-48 md:h-auto shrink-0 relative bg-slate-100 overflow-hidden">
              <Skeleton className="w-full h-full rounded-none" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full bg-slate-300" />
              </div>
            </div>

            {/* Right: Content details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-2.5">
                {/* Badges / Muscle row */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>

                {/* Title & Description lines */}
                <Skeleton className="h-6 w-3/4 sm:w-2/3 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-5/6 rounded" />
              </div>

              {/* Metrics & Action Buttons Bottom Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-16 rounded hidden sm:inline-block" />
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24 rounded-xl" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar Skeleton */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}

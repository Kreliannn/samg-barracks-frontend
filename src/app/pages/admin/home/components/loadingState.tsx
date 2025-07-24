"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="w-full h-dvh space-y-6 p-4">
      {/* First row: 3 card skeletons */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-32 bg-gray-100 rounded p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="h-32 bg-gray-100 rounded p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="h-32 bg-gray-100 rounded p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      {/* Second row: Monthly chart and pie chart skeletons */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 h-64 bg-gray-100 rounded p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        <div className="col-span-1 h-64 bg-gray-100 rounded p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="flex justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        </div>
      </div>

      {/* Third row: Yearly bar chart and menu chart skeletons */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2 h-64 bg-gray-100 rounded p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-28" />
            <div className="flex items-end space-x-2 h-40">
              <Skeleton className="h-20 w-8" />
              <Skeleton className="h-32 w-8" />
              <Skeleton className="h-24 w-8" />
              <Skeleton className="h-36 w-8" />
              <Skeleton className="h-28 w-8" />
              <Skeleton className="h-40 w-8" />
              <Skeleton className="h-16 w-8" />
              <Skeleton className="h-32 w-8" />
              <Skeleton className="h-24 w-8" />
              <Skeleton className="h-28 w-8" />
              <Skeleton className="h-20 w-8" />
              <Skeleton className="h-36 w-8" />
            </div>
          </div>
        </div>

        <div className="col-span-2 h-64 bg-gray-100 rounded p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
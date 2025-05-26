import React from "react";

const LoadingState = ({ sidebarMode }) => (
  <div className="animate-pulse overflow-y-scroll no-scrollbar">
    {sidebarMode ? (
      <div className="space-y-3 overflow-y-scroll no-scrollbar">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-700 rounded w-3/4 mb-1"></div>
              <div className="h-2 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-scroll no-scrollbar">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4">
            <div className="aspect-square bg-gray-700 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default LoadingState;

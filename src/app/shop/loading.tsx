import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-5xl">
        
        {/* Main Spinner & Logo */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-zinc-900 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)]"></div>
            <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin shadow-[0_0_25px_rgba(220,38,38,0.4)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black tracking-tighter uppercase text-white">
                <span className="text-red-600">BB</span>
              </span>
            </div>
          </div>
          
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-500 animate-pulse">
            LOADING SHOP
          </h2>
        </div>
        
        {/* Skeleton Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full opacity-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col bg-zinc-900 rounded-xl overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-zinc-800"></div>
              <div className="p-4 space-y-4">
                <div className="w-3/4 h-6 bg-zinc-800 rounded"></div>
                <div className="w-1/2 h-4 bg-zinc-800 rounded"></div>
                <div className="w-full h-10 bg-zinc-800 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

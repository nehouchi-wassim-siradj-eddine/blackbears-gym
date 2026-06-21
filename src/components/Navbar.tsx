"use client";

import React from "react";
import { themeConfig, getColorClasses } from "../config/theme";

interface NavbarProps {
  isAdminEditMode: boolean;
  setIsAdminEditMode: (val: boolean) => void;
  headerState: any;
  isAuth: boolean;
}

export default function Navbar({ isAdminEditMode, setIsAdminEditMode, headerState, isAuth }: NavbarProps) {
  const colors = getColorClasses(themeConfig.primaryColor);

  return (
    <>
      {/* Floating Edit Button */}
      {isAuth && (
        <button
          onClick={() => setIsAdminEditMode(!isAdminEditMode)}
          className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg ${colors.bg} ${colors.hoverBg} text-white transition-all`}
          title="Toggle Admin Edit Mode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      {/* Admin Edit Overlay Placeholder */}
      {isAdminEditMode && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-900 border border-zinc-800 p-4 rounded-lg shadow-xl max-w-sm">
          <h3 className="text-lg font-bold text-white mb-2">Admin Edit State Active</h3>
          <p className="text-sm text-zinc-400">
            You are now in edit mode. Configurable elements could be editable here.
          </p>
        </div>
      )}

      {/* Emergency Top Bar */}
      {headerState.isAnnouncementActive && (
        <div className={`w-full py-2 px-4 text-center font-bold text-sm tracking-wide bg-red-700 text-white`}>
          {headerState.announcementText}
        </div>
      )}

      {/* Main Navbar */}
      <nav className="w-full bg-zinc-950 border-b border-zinc-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo and Gym Name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded border border-zinc-800 shadow-md bg-zinc-950">
                <img src="/logo.png" alt="The Black Bears Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">
                THE BLACK <span className="text-red-600">BEARS</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {['Programs', 'Schedule', 'Pricing', 'Coaches'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-zinc-300 hover:text-red-500 font-semibold uppercase tracking-wider text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
              
              {isAuth && (
                <button 
                  onClick={() => {
                    localStorage.removeItem("bb_admin_auth_token");
                    setIsAdminEditMode(false);
                    window.location.href = "/";
                  }}
                  className="text-red-500 border border-red-500/30 hover:bg-red-950/30 hover:border-red-500 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-zinc-400 hover:text-white focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
          </div>
        </div>
      </nav>
    </>
  );
}

"use client";

import React from "react";
import { themeConfig, getColorClasses } from "../config/theme";

interface NavbarProps {
  isAdminEditMode: boolean;
  setIsAdminEditMode: (val: boolean) => void;
  headerState: any;
  isAuth: boolean;
  locale: 'en' | 'fr' | 'ar';
  setLocale: (val: 'en' | 'fr' | 'ar') => void;
}

export default function Navbar({ isAdminEditMode, setIsAdminEditMode, headerState, isAuth, locale, setLocale }: NavbarProps) {
  const colors = getColorClasses(themeConfig.primaryColor);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = {
    en: ['Programs', 'Schedule', 'Pricing', 'Coaches', 'Shop'],
    fr: ['Programmes', 'Planning', 'Tarifs', 'Coachs', 'Boutique'],
    ar: ['البرامج', 'الجدول', 'الأسعار', 'المدربين', 'المتجر']
  };
  const navIds = ['programs', 'schedule', 'pricing', 'coaches', 'shop'];

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
          <h3 className="text-lg font-bold text-white mb-2">
            {locale === 'ar' ? 'وضع التعديل مفعل' : locale === 'fr' ? 'Mode Édition Actif' : 'Admin Edit State Active'}
          </h3>
          <p className="text-sm text-zinc-400">
            {locale === 'ar' ? 'أنت الآن في وضع التعديل. يمكنك تغيير العناصر القابلة للتخصيص هنا.' : locale === 'fr' ? 'Vous êtes maintenant en mode édition. Les éléments configurables peuvent être modifiés ici.' : 'You are now in edit mode. Configurable elements could be editable here.'}
          </p>
        </div>
      )}

      {/* Emergency Top Bar */}
      {headerState.isAnnouncementActive && (
        <div className={`w-full py-2 px-4 text-center font-bold text-sm tracking-wide bg-red-700 text-white`}>
          {headerState?.announcementText?.[locale]}
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
              {navLinks[locale].map((item, idx) => (
                <a 
                  key={item} 
                  href={navIds[idx] === 'shop' ? '/shop' : `/#${navIds[idx]}`}
                  className="text-zinc-300 hover:text-red-500 font-semibold uppercase tracking-wider text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
              
              {/* Language Selector */}
              <div className="flex gap-2 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
                {(['en', 'fr', 'ar'] as const).map(l => (
                  <button 
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`text-xs font-bold uppercase ${locale === l ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              
              {isAuth && (
                <button 
                  onClick={() => {
                    localStorage.removeItem("bb_admin_auth_token");
                    setIsAdminEditMode(false);
                    window.location.href = "/";
                  }}
                  className="text-red-500 border border-red-500/30 hover:bg-red-950/30 hover:border-red-500 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all"
                >
                  {locale === 'ar' ? 'تسجيل الخروج' : locale === 'fr' ? 'Déconnexion' : 'Logout'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-zinc-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-900 absolute top-full left-0 w-full shadow-2xl z-40">
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {navLinks[locale].map((item, idx) => (
                <a 
                  key={item} 
                  href={navIds[idx] === 'shop' ? '/shop' : `/#${navIds[idx]}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-red-500 font-semibold uppercase tracking-wider text-sm transition-colors py-2 block border-b border-zinc-900"
                >
                  {item}
                </a>
              ))}
              
              <div className="pt-4 flex items-center justify-between">
                <span className="text-zinc-500 font-bold uppercase text-xs">{locale === 'ar' ? 'اللغة' : locale === 'fr' ? 'Langue' : 'Language'}</span>
                <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded px-2 py-1">
                  {(['en', 'fr', 'ar'] as const).map(l => (
                    <button 
                      key={l}
                      onClick={() => { setLocale(l); setIsMobileMenuOpen(false); }}
                      className={`text-xs font-bold uppercase ${locale === l ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {isAuth && (
                <button 
                  onClick={() => {
                    localStorage.removeItem("bb_admin_auth_token");
                    setIsAdminEditMode(false);
                    setIsMobileMenuOpen(false);
                    window.location.href = "/";
                  }}
                  className="w-full mt-4 text-red-500 border border-red-500/30 bg-red-950/20 hover:bg-red-500 hover:text-white px-4 py-3 rounded text-sm font-bold uppercase tracking-widest transition-all text-center"
                >
                  {locale === 'ar' ? 'تسجيل الخروج' : locale === 'fr' ? 'Déconnexion' : 'Logout'}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

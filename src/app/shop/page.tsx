"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Shop from "../../components/Shop";
import Footer from "../../components/Footer";

export default function ShopPage() {
  const [locale, setLocale] = useState<'en'|'fr'|'ar'>('en');
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [headerState, setHeaderState] = useState<any>(null);
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_admin_auth_token")) {
      setIsAuth(true);
    }
    
    fetch('/api/gym-data')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setHeaderState(res.data.headerState);
          setDbData(res.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-red-600 font-bold tracking-widest uppercase text-xs">Loading Shop...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar 
        isAdminEditMode={isAdminEditMode} 
        setIsAdminEditMode={setIsAdminEditMode} 
        headerState={headerState}
        isAuth={isAuth}
        locale={locale}
        setLocale={setLocale}
      />
      
      <div className="pt-20">
        <Shop 
          isAdminMode={isAdminEditMode} 
          initialProducts={dbData?.products} 
          initialCategories={dbData?.sectionTitles?.shopCategories} 
          locale={locale} 
        />
      </div>

      <Footer isAdminMode={isAdminEditMode} initialFooter={dbData?.footerState} locale={locale} />
    </main>
  );
}

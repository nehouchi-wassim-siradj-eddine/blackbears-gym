"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Shop from "../../components/Shop";
import Footer from "../../components/Footer";

export default function ShopClient({ dbData }: { dbData: any }) {
  const [locale, setLocale] = useState<'en'|'fr'|'ar'>('en');
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_admin_auth_token")) {
      setIsAuth(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar 
        isAdminEditMode={isAdminEditMode} 
        setIsAdminEditMode={setIsAdminEditMode} 
        headerState={dbData?.headerState}
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

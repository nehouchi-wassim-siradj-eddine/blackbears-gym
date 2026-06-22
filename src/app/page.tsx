"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Programs from "../components/Programs";
import Schedule from "../components/Schedule";
import Coaches from "../components/Coaches";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function Home() {
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
        <p className="text-red-600 font-bold tracking-widest uppercase text-xs">Connecting to DB...</p>
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
      <Hero 
        isAdminMode={isAdminEditMode} 
        headerState={headerState} 
        setHeaderState={setHeaderState} 
        locale={locale}
      />
      <Programs isAdminMode={isAdminEditMode} initialPrograms={dbData?.programs} sectionTitle={dbData?.sectionTitles?.programs} locale={locale} />
      <Schedule isAdminMode={isAdminEditMode} initialSchedule={dbData?.schedule} sectionTitle={dbData?.sectionTitles?.schedule} locale={locale} />
      <Coaches isAdminMode={isAdminEditMode} initialCoaches={dbData?.coaches} sectionTitle={dbData?.sectionTitles?.coaches} locale={locale} />
      <Pricing isAdminMode={isAdminEditMode} initialPlans={dbData?.plans} sectionTitle={dbData?.sectionTitles?.pricing} locale={locale} />
      <Footer isAdminMode={isAdminEditMode} initialFooter={dbData?.footerState} locale={locale} />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Programs from "../components/Programs";
import Schedule from "../components/Schedule";
import Coaches from "../components/Coaches";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function HomeClient({ initialDbData }: { initialDbData: any }) {
  const [locale, setLocale] = useState<'en'|'fr'|'ar'>('en');
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const [headerState, setHeaderState] = useState<any>(initialDbData?.headerState || null);

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
      <Programs isAdminMode={isAdminEditMode} initialPrograms={initialDbData?.programs} sectionTitle={initialDbData?.sectionTitles?.programs} locale={locale} />
      <Schedule isAdminMode={isAdminEditMode} initialSchedule={initialDbData?.schedule} sectionTitle={initialDbData?.sectionTitles?.schedule} fullSectionTitles={initialDbData?.sectionTitles} locale={locale} />
      <Coaches isAdminMode={isAdminEditMode} initialCoaches={initialDbData?.coaches} sectionTitle={initialDbData?.sectionTitles?.coaches} locale={locale} />
      <Pricing isAdminMode={isAdminEditMode} initialPlans={initialDbData?.plans} sectionTitle={initialDbData?.sectionTitles?.pricing} locale={locale} />
      <Footer isAdminMode={isAdminEditMode} initialFooter={initialDbData?.footerState} locale={locale} />
    </main>
  );
}

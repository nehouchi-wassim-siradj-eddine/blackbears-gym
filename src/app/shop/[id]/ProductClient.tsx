"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from 'next/link';

interface ProductClientProps {
  product: any;
  dbData: any;
}

export default function ProductClient({ product, dbData }: ProductClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [locale, setLocale] = useState<'en'|'fr'|'ar'>('en');
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_admin_auth_token")) {
      setIsAuth(true);
    }
  }, []);

  const pName = typeof product.name === 'object' ? product.name[locale] : product.name;
  const pDesc = typeof product.description === 'object' ? product.description[locale] : product.description;
  const pPrice = typeof product.price === 'object' ? product.price[locale] : product.price;

  const rawPhone = product.phone || '0778995491';
  const cleanPhone = rawPhone.replace(/^0/, '').trim();
  const waText = encodeURIComponent(`Hello, I want to order ${pName} for ${pPrice}`);
  const waLink = `https://api.whatsapp.com/send/?phone=213${cleanPhone}&text=${waText}`;

  // Handle parsing stringified array safely if the API returned it as string or array natively
  let parsedImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    parsedImages = product.images;
  } else if (typeof product.image === 'string') {
    try {
      const parsed = JSON.parse(product.image);
      if (Array.isArray(parsed)) parsedImages = parsed;
      else parsedImages = [product.image];
    } catch (e) {
      parsedImages = [product.image];
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col font-sans" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar 
        isAdminEditMode={isAdminEditMode} 
        setIsAdminEditMode={setIsAdminEditMode} 
        headerState={dbData?.headerState || {}}
        isAuth={isAuth}
        locale={locale}
        setLocale={setLocale}
      />
      
      <div className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/shop" prefetch={true} className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-wider">
          {locale === 'ar' ? '← العودة للمتجر' : locale === 'fr' ? '← Retour à la boutique' : '← Back to Store'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px]">
            {parsedImages.length > 0 ? (
              <div ref={scrollRef} className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 scroll-smooth">
                {parsedImages.map((img: string, idx: number) => (
                  <div key={idx} className="snap-center shrink-0 w-full flex items-center justify-center">
                    {/* Native caching via next/image or raw optimized img element */}
                    <img src={img} alt={`${pName} - View ${idx + 1}`} loading="eager" decoding="sync" className="w-full h-auto max-h-[500px] object-contain" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest">No Image Available</div>
            )}
            
            {parsedImages.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button onClick={scrollLeft} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors border border-zinc-700/50 hover:border-red-500 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={scrollRight} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors border border-zinc-700/50 hover:border-red-500 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-4 pointer-events-none absolute bottom-4 left-0 right-0 z-10">
                  {parsedImages.map((_: any, idx: number) => (
                    <div key={idx} className="w-2.5 h-2.5 rounded-full bg-zinc-500/50 border border-zinc-400/20"></div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2 block">{product.category || 'Uncategorized'}</span>
              <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-4">{pName}</h1>
              <div className="inline-block bg-red-600/10 border border-red-600/20 text-red-500 font-black text-2xl px-4 py-2 rounded">
                {pPrice}
              </div>
            </div>

            <div className="w-16 h-1 bg-red-600 my-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">{pDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full bg-transparent border border-zinc-700 text-zinc-300 font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:border-zinc-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:text-white transition-all uppercase tracking-wider">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                {locale === 'ar' ? 'اطلب عبر واتساب' : locale === 'fr' ? 'Commander via WhatsApp' : 'Order via WhatsApp'}
              </a>
              <a href={`tel:${rawPhone}`} className="w-full bg-zinc-900 border border-red-500/30 text-red-400 font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:text-red-300 transition-all uppercase tracking-wider">
                {locale === 'ar' ? '📞 اتصال مباشر' : locale === 'fr' ? '📞 Appel Direct' : '📞 Direct Call'}
              </a>
            </div>
            
          </div>
        </div>
      </div>

      <Footer isAdminMode={false} initialFooter={dbData?.footerState} locale={locale} />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface PricingProps {
  isAdminMode: boolean;
  initialPlans?: any[];
  sectionTitle?: any;
  locale?: 'en' | 'fr' | 'ar';
}

const INITIAL_PLANS = [
  {
    id: 1,
    title: "Normal Plan",
    price: "$99/mo",
    isPopular: false,
    coachPhone: "0661234567",
    features: "Basic Gym Access\nOpen Mat Sessions\nLocker Room Access"
  },
  {
    id: 2,
    title: "Fighter Plan",
    price: "$149/mo",
    isPopular: true,
    coachPhone: "0661234567",
    features: "Full Combat Classes\nCrossFit Access\nBasic Gym Access\nLocker Room Access"
  },
  {
    id: 3,
    title: "VIP/Elite Plan",
    price: "$249/mo",
    isPopular: false,
    coachPhone: "0661234567",
    features: "Unlimited Personal Coaching\nFull Combat Classes\nNutrition Plan\nCrossFit Access\nPremium Locker & Towel"
  }
];

export default function Pricing({ isAdminMode, initialPlans, sectionTitle, locale = 'en' }: PricingProps) {
  const [plans, setPlans] = useState(initialPlans || INITIAL_PLANS);
  
  useEffect(() => {
    if (initialPlans) setPlans(initialPlans);
  }, [initialPlans]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const emptyLangState = { en: "", fr: "", ar: "" };
  const [formData, setFormData] = useState<any>({ title: {...emptyLangState}, price: {...emptyLangState}, features: {...emptyLangState}, isPopular: false, coachPhone: "" });
  const [editLocale, setEditLocale] = useState<'en'|'fr'|'ar'>('en');

  // User Registration State
  const [selectedPlanForRegistration, setSelectedPlanForRegistration] = useState<any | null>(null);
  const [registrationData, setRegistrationData] = useState({ name: "", phone: "" });

  const openEditModal = (plan: any) => {
    setEditingId(plan.id);
    setFormData({ 
      title: JSON.parse(JSON.stringify(plan.title)), 
      price: JSON.parse(JSON.stringify(plan.price)), 
      features: JSON.parse(JSON.stringify(plan.features)),
      isPopular: plan.isPopular,
      coachPhone: plan.coachPhone
    });
    setEditLocale(locale);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    const emptyLangState = { en: "", fr: "", ar: "" };
    setFormData({ title: {...emptyLangState}, price: {...emptyLangState}, features: {...emptyLangState}, isPopular: false, coachPhone: "" });
    setEditLocale(locale);
    setIsModalOpen(true);
  };

  const saveToDB = async (newPlans: any[]) => {
    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plans: newPlans })
      });
    } catch (err) { console.error("Failed to save to DB"); }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const newPlans = plans.filter(p => p.id !== id);
      setPlans(newPlans);
      saveToDB(newPlans);
    }
  };

  const handleSave = () => {
    let newPlans;
    if (editingId) {
      newPlans = plans.map(p => p.id === editingId ? { ...p, ...formData } : p);
    } else {
      newPlans = [...plans, { id: Math.floor(Math.random() * 1000000), ...formData }];
    }
    setPlans(newPlans);
    setIsModalOpen(false);
    saveToDB(newPlans);
  };

  return (
    <section id="pricing" className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            {sectionTitle ? (typeof sectionTitle === 'object' ? sectionTitle[locale] : sectionTitle) : <>Membership <span className="text-red-600">Plans</span></>}
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-zinc-900 rounded-xl p-8 flex flex-col transition-all duration-300 transform hover:-translate-y-2
                ${plan.isPopular 
                  ? "border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] lg:scale-105 z-10" 
                  : "border border-zinc-800 hover:border-zinc-700"
                }
              `}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-black text-white uppercase mb-2 text-center">{plan.title?.[locale]}</h3>
              <div className="text-4xl font-black text-red-500 mb-8 text-center">{plan.price?.[locale]}</div>
              
              <ul className="flex-1 space-y-4 mb-8">
                {(plan.features?.[locale] || "").split('\n').map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start text-zinc-300 font-medium">
                    <svg className={`w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 ${locale === 'ar' ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <button 
                  onClick={() => {
                    if (!isAdminMode) {
                      setSelectedPlanForRegistration(plan);
                      setRegistrationData({ name: "", phone: "" });
                    }
                  }}
                  className={`w-full py-4 rounded font-bold text-lg uppercase tracking-widest transition-colors ${plan.isPopular ? "bg-red-600 text-white hover:bg-red-700 shadow-lg" : "bg-zinc-800 text-white hover:bg-zinc-700"} ${isAdminMode ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {locale === 'ar' ? 'اختر الخطة' : locale === 'fr' ? 'Choisir ce Plan' : 'Select Plan'}
                </button>
              </div>

              {/* Admin Overlay Controls */}
              {isAdminMode && (
                <div className="absolute top-4 right-4 flex gap-2 z-20 bg-zinc-950/90 p-2 rounded-lg backdrop-blur-md border border-zinc-700">
                  <button onClick={() => openEditModal(plan)} className="text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 bg-red-900/40 hover:bg-red-900/80 px-2 py-1 rounded border border-red-900/50">
                    ❌ Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Plan Button for Admin */}
          {isAdminMode && (
            <button 
              onClick={openAddModal} 
              className="bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] group"
            >
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 text-zinc-600 group-hover:text-red-500">+</span>
              <span className="font-bold text-xl uppercase tracking-widest">Add New Plan</span>
            </button>
          )}

        </div>

        {/* Edit Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase mb-6">
                {editingId ? "Edit Plan" : "Add Plan"}
              </h3>
              
              {/* Language Edit Tabs */}
              <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2">
                {(['en', 'fr', 'ar'] as const).map(l => (
                  <button key={l} onClick={() => setEditLocale(l)} className={`px-4 py-2 font-bold uppercase text-xs rounded-t-lg transition-colors ${editLocale === l ? 'bg-zinc-800 text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Editing: {l}</button>
                ))}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Plan Title ({editLocale})</label>
                    <input type="text" value={formData.title[editLocale]} onChange={e => setFormData({...formData, title: {...formData.title, [editLocale]: e.target.value}})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" dir={editLocale === 'ar' ? 'rtl' : 'ltr'} />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Price ({editLocale})</label>
                    <input type="text" value={formData.price[editLocale]} onChange={e => setFormData({...formData, price: {...formData.price, [editLocale]: e.target.value}})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" dir={editLocale === 'ar' ? 'rtl' : 'ltr'} />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Dedicated Coach Phone Number</label>
                  <input type="text" value={formData.coachPhone || ""} onChange={e => setFormData({...formData, coachPhone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" placeholder="0661234567" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Features ({editLocale} - One per line)</label>
                  <textarea 
                    value={formData.features[editLocale]} 
                    onChange={e => setFormData({...formData, features: {...formData.features, [editLocale]: e.target.value}})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    rows={5}
                    dir={editLocale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="flex items-center justify-between bg-zinc-950 p-3 rounded border border-zinc-800 mt-4">
                  <span className="text-zinc-400 text-xs font-bold uppercase">Mark as Most Popular</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({...formData, isPopular: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Save Plan</button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Subscription Modal Overlay */}
        {selectedPlanForRegistration && !isAdminMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 transition-opacity">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] relative transform transition-all">
              
              <button 
                onClick={() => setSelectedPlanForRegistration(null)}
                className="absolute top-4 right-4 z-10 text-zinc-500 hover:bg-zinc-900 hover:text-white rounded-full p-2 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                
                <h3 className="text-2xl font-black text-white uppercase mb-2 tracking-wide">Take Action</h3>
                <p className="text-zinc-400 text-sm font-medium mb-8 leading-relaxed">
                  You're locking in the <span className="text-red-500 font-bold">{selectedPlanForRegistration?.title?.[locale]}</span> at <span className="text-white font-bold">{selectedPlanForRegistration?.price?.[locale]}</span>. How would you like to connect with the coach?
                </p>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      const rawPhone = selectedPlanForRegistration?.coachPhone?.replace(/[^0-9+]/g, '') || "";
                      let waPhone = rawPhone;
                      if (waPhone.startsWith('0')) waPhone = '213' + waPhone.substring(1);
                      if (waPhone.startsWith('+')) waPhone = waPhone.substring(1);
                      
                      const message = `Hi! I want to ask about the ${selectedPlanForRegistration?.title?.[locale] || 'membership'}.`;
                      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, '_blank');
                      setSelectedPlanForRegistration(null);
                    }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold uppercase tracking-widest border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 group"
                  >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    WhatsApp
                  </button>

                  <a 
                    href={`tel:${(() => {
                      const rawPhone = selectedPlanForRegistration?.coachPhone?.replace(/[^0-9+]/g, '') || "";
                      let callPhone = rawPhone;
                      if (callPhone.startsWith('0')) callPhone = '+213' + callPhone.substring(1);
                      if (!callPhone.startsWith('+')) callPhone = '+' + callPhone;
                      return callPhone;
                    })()}`}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold uppercase tracking-widest border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    Direct Call
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

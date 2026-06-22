"use client";

import React, { useState, useEffect } from "react";

interface FooterProps {
  isAdminMode: boolean;
  initialFooter?: any;
  locale: 'en' | 'fr' | 'ar';
}

const INITIAL_FOOTER_STATE = {
  address: "123 Main Street, Algiers, Algeria",
  phone: "0661234567",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102344.20078864771!2d3.0560293!3d36.7118129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad1f44e1e827%3A0xcb13e155bc812044!2sAlgiers!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz"
};

export default function Footer({ isAdminMode, initialFooter, locale }: FooterProps) {
  const [footerState, setFooterState] = useState(initialFooter || INITIAL_FOOTER_STATE);
  
  useEffect(() => {
    if (initialFooter) setFooterState(initialFooter);
  }, [initialFooter]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFooter ? JSON.parse(JSON.stringify(initialFooter)) : JSON.parse(JSON.stringify(INITIAL_FOOTER_STATE)));
  const [editLocale, setEditLocale] = useState<'en'|'fr'|'ar'>('en');

  const handleOpenModal = () => {
    setFormData(JSON.parse(JSON.stringify(footerState)));
    setEditLocale(locale);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setFooterState(formData);
    setIsModalOpen(false);
    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ footerState: formData })
      });
    } catch (err) { console.error("Failed to save to DB"); }
  };

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-900 py-16 text-white overflow-hidden mt-12" id="footer">
      {isAdminMode && (
        <button 
          onClick={handleOpenModal}
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-xl transition-all"
        >
          ✏️ Edit Footer Settings
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Info */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Black Bears Logo" className="w-12 h-12 object-contain" />
              <h2 className="text-2xl font-black uppercase tracking-widest text-red-600">Black Bears</h2>
            </div>
            <div className="text-zinc-400 space-y-3 font-medium">
              <p className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="whitespace-pre-line">{typeof footerState?.address === 'object' ? footerState.address[locale] : footerState?.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {typeof footerState?.phone === 'object' ? footerState.phone[locale] : footerState?.phone}
              </p>
            </div>
          </div>

          {/* Column 2: Socials */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white border-b border-zinc-800 pb-2">{locale === 'ar' ? 'تابعنا' : locale === 'fr' ? 'Suivez-nous' : 'Follow Us'}</h3>
            <div className="flex gap-4">
              {footerState.facebookUrl && (
                <a href={footerState.facebookUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transform hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {footerState.instagramUrl && (
                <a href={footerState.instagramUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transform hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {footerState.tiktokUrl && (
                <a href={footerState.tiktokUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transform hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 3: Location Map */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white border-b border-zinc-800 pb-2">{locale === 'ar' ? 'موقعنا' : locale === 'fr' ? 'Trouvez-nous' : 'Find Us'}</h3>
            <div className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-inner">
              {footerState.mapEmbedUrl ? (
                <iframe 
                  src={footerState.mapEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-sm font-bold uppercase tracking-widest">Map Not Configured</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-white uppercase mb-6">Edit Footer Settings</h3>
            
            {/* Language Edit Tabs */}
            <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2">
              {(['en', 'fr', 'ar'] as const).map(l => (
                <button key={l} onClick={() => setEditLocale(l)} className={`px-4 py-2 font-bold uppercase text-xs rounded-t-lg transition-colors ${editLocale === l ? 'bg-zinc-800 text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Editing: {l}</button>
              ))}
            </div>

            <div className="space-y-6 mb-6">
              
              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Gym Info</h4>
                <div className="mb-4">
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Address Text ({editLocale})</label>
                  <textarea value={formData.address[editLocale]} onChange={(e) => setFormData({...formData, address: {...formData.address, [editLocale]: e.target.value}})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" rows={2} dir={editLocale === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">General Phone Number</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" />
                </div>
              </div>

              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Social Links</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Facebook URL</label>
                    <input type="url" value={formData.facebookUrl} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Instagram URL</label>
                    <input type="url" value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">TikTok URL</label>
                    <input type="url" value={formData.tiktokUrl} onChange={e => setFormData({...formData, tiktokUrl: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" placeholder="https://tiktok.com/@..." />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Location Map</h4>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Google Maps Embed URL (src)</label>
                  <p className="text-xs text-zinc-500 mb-2">Go to Google Maps {`>`} Share {`>`} Embed a map {`>`} Copy the 'src' link inside the iframe.</p>
                  <textarea value={formData.mapEmbedUrl} onChange={e => setFormData({...formData, mapEmbedUrl: e.target.value})} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" placeholder="https://www.google.com/maps/embed?pb=..." />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

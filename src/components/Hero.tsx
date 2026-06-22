"use client";

import React, { useState } from "react";
import { themeConfig, getColorClasses } from "../config/theme";

interface HeroProps {
  isAdminMode: boolean;
  headerState: any;
  setHeaderState: (val: any) => void;
  locale: 'en' | 'fr' | 'ar';
}

export default function Hero({ isAdminMode, headerState, setHeaderState, locale }: HeroProps) {
  const colors = getColorClasses(themeConfig.primaryColor);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(headerState ? JSON.parse(JSON.stringify(headerState)) : null);
  const [editLocale, setEditLocale] = useState<'en'|'fr'|'ar'>('en');

  const handleOpenModal = () => {
    setFormData(JSON.parse(JSON.stringify(headerState)));
    setEditLocale(locale);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setHeaderState(formData);
    setIsModalOpen(false);
    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ headerState: formData })
      });
    } catch (err) {
      console.error("Failed to save to DB", err);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");
      setFormData({
        ...formData,
        heroMediaUrl: url,
        heroMediaType: isVideo ? "video" : "image"
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {isAdminMode && (
        <button 
          onClick={handleOpenModal}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-xl transition-all"
        >
          ✏️ Edit Header & Hero
        </button>
      )}

      {/* Background Media */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        {headerState.heroMediaType === "video" ? (
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
            src={headerState.heroMediaUrl}
          />
        ) : (
          <img 
            className="w-full h-full object-cover"
            src={headerState.heroMediaUrl}
            alt="Hero Background"
          />
        )}
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-tight mb-6 drop-shadow-lg whitespace-pre-line">
          {headerState?.heroHeadline?.[locale]}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 font-medium max-w-3xl mb-10 drop-shadow-md whitespace-pre-line">
          {headerState?.heroSubtitle?.[locale]}
        </p>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (!isAdminMode) {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className={`
          inline-block px-10 py-5 rounded-md font-bold text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.5)]
          transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-white
          ${colors.bg} ${colors.hoverBg}
        `}>
          {locale === 'ar' ? 'انضم الآن' : locale === 'fr' ? 'Rejoindre' : 'Join Now'}
        </button>

      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-white uppercase mb-6">Edit Header & Hero</h3>
            
            {/* Language Edit Tabs */}
            <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2">
              {(['en', 'fr', 'ar'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setEditLocale(l)}
                  className={`px-4 py-2 font-bold uppercase text-xs rounded-t-lg transition-colors ${editLocale === l ? 'bg-zinc-800 text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Editing: {l}
                </button>
              ))}
            </div>

            <div className="space-y-6 mb-6">
              
              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Top Bar Settings</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400 font-bold uppercase text-xs">Show Announcement Bar</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.isAnnouncementActive} onChange={(e) => setFormData({...formData, isAnnouncementActive: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                {formData.isAnnouncementActive && (
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Announcement Text ({editLocale})</label>
                    <input type="text" value={formData.announcementText[editLocale]} onChange={(e) => setFormData({...formData, announcementText: { ...formData.announcementText, [editLocale]: e.target.value }})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" dir={editLocale === 'ar' ? 'rtl' : 'ltr'} />
                  </div>
                )}
              </div>

              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Hero Typography</h4>
                <div className="mb-4">
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Headline ({editLocale})</label>
                  <textarea value={formData.heroHeadline[editLocale]} onChange={(e) => setFormData({...formData, heroHeadline: { ...formData.heroHeadline, [editLocale]: e.target.value }})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" rows={2} dir={editLocale === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Subtitle ({editLocale})</label>
                  <textarea value={formData.heroSubtitle[editLocale]} onChange={(e) => setFormData({...formData, heroSubtitle: { ...formData.heroSubtitle, [editLocale]: e.target.value }})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600" rows={2} dir={editLocale === 'ar' ? 'rtl' : 'ltr'} />
                </div>
              </div>

              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Hero Background Media</h4>
                <div className="relative w-full h-40 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded flex flex-col items-center justify-center hover:border-red-600 hover:bg-zinc-800 transition-colors cursor-pointer overflow-hidden group">
                  {formData.heroMediaType === "video" ? (
                    <>
                      <video src={formData.heroMediaUrl} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-40" />
                      <div className="relative z-10 bg-black/60 px-3 py-1 rounded text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Change Video</div>
                    </>
                  ) : (
                    <>
                      <img src={formData.heroMediaUrl} alt="Hero Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                      <div className="relative z-10 bg-black/60 px-3 py-1 rounded text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Change Image</div>
                    </>
                  )}
                  <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
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
    </div>
  );
}

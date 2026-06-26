"use client";

import React, { useState, useEffect } from "react";

interface ScheduleProps {
  isAdminMode: boolean;
  initialSchedule?: any[];
  sectionTitle?: any;
  fullSectionTitles?: any;
  locale?: 'en' | 'fr' | 'ar';
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_TRANSLATIONS: Record<string, any> = {
  "Monday": { en: "Monday", fr: "Lundi", ar: "الاثنين" },
  "Tuesday": { en: "Tuesday", fr: "Mardi", ar: "الثلاثاء" },
  "Wednesday": { en: "Wednesday", fr: "Mercredi", ar: "الأربعاء" },
  "Thursday": { en: "Thursday", fr: "Jeudi", ar: "الخميس" },
  "Friday": { en: "Friday", fr: "Vendredi", ar: "الجمعة" },
  "Saturday": { en: "Saturday", fr: "Samedi", ar: "السبت" },
  "Sunday": { en: "Sunday", fr: "Dimanche", ar: "الأحد" }
};

const FILTER_TRANSLATIONS: Record<string, any> = {
  "Mixed": { en: "🥊 Men / Mixed Sessions", fr: "🥊 Hommes / Sessions Mixtes", ar: "🥊 للرجال / حصص مختلطة" },
  "Women Only": { en: "🚺 Women-Only Sessions", fr: "🚺 Sessions Femmes Uniquement", ar: "🚺 حصص للسيدات فقط" },
  "No classes": { en: "No classes scheduled for", fr: "Aucun cours programmé pour", ar: "لا توجد حصص مبرمجة ليوم" },
  "Time to recover": { en: "Time to recover!", fr: "C'est l'heure de récupérer !", ar: "حان وقت التعافي!" }
};

const INITIAL_SCHEDULE = [
  { id: 1, day: "Monday", time: "18:00 - 19:30", name: "MMA Advanced", target: "Mixed" }
];

export default function Schedule({ isAdminMode, initialSchedule, sectionTitle, fullSectionTitles, locale = 'en' }: ScheduleProps) {
  const [schedule, setSchedule] = useState(initialSchedule || INITIAL_SCHEDULE);
  
  useEffect(() => {
    if (initialSchedule) setSchedule(initialSchedule);
  }, [initialSchedule]);
  
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [sessionFilter, setSessionFilter] = useState("Mixed"); // "Mixed" or "Women Only"
  const [sportFilter, setSportFilter] = useState("All");

  const defaultSportFilters = {
    "Mixed": ["MMA", "BJJ", "Kickboxing", "Muay Thai", "CrossFit", "Boxing"],
    "Women Only": ["Kickboxing", "CrossFit", "Lutte", "Fitness"]
  };

  const [sportFiltersConfig, setSportFiltersConfig] = useState<any>(
    fullSectionTitles?.sportFilters || defaultSportFilters
  );

  useEffect(() => {
    if (fullSectionTitles?.sportFilters) {
      setSportFiltersConfig(fullSectionTitles.sportFilters);
    }
  }, [fullSectionTitles]);

  const currentSportButtons = ["All", ...(sportFiltersConfig[sessionFilter] || [])];

  useEffect(() => {
    setSportFilter("All");
  }, [sessionFilter]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLocale, setEditLocale] = useState<'en'|'fr'|'ar'>('en');
  const [formData, setFormData] = useState({ 
    day: "Monday", 
    time: { en: "", fr: "", ar: "" }, 
    name: { en: "", fr: "", ar: "" }, 
    target: { en: "Mixed", fr: "Mixte", ar: "مختلط" } 
  });

  // Admin Config Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFormData, setFilterFormData] = useState({ category: "Mixed", sports: "" });

  const openFilterModal = () => {
    setFilterFormData({
      category: "Mixed",
      sports: (sportFiltersConfig["Mixed"] || []).join(", ")
    });
    setIsFilterModalOpen(true);
  };

  const handleFilterFormCategoryChange = (cat: string) => {
    setFilterFormData({
      category: cat,
      sports: (sportFiltersConfig[cat] || []).join(", ")
    });
  };

  const saveFilterConfig = async () => {
    const updatedConfig = {
      ...sportFiltersConfig,
      [filterFormData.category]: filterFormData.sports.split(",").map((s: string) => s.trim()).filter((s: string) => s)
    };
    setSportFiltersConfig(updatedConfig);
    setIsFilterModalOpen(false);

    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      const newSectionTitles = { ...fullSectionTitles, sportFilters: updatedConfig };
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sectionTitles: newSectionTitles })
      });
    } catch (err) { console.error("Failed to save filters"); }
  };

  // Filter relies on the English key for target checking since we mapped it internally
  // In the DB, target is now an object, so we check if the en version contains "Women Only"
  const classesToday = schedule.filter(c => {
    if (c.day !== selectedDay) return false;
    
    const isWomenOnly = (typeof c.target === 'object' ? c.target.en : c.target) === "Women Only";
    const passTargetFilter = sessionFilter === "Women Only" ? isWomenOnly : !isWomenOnly;
    if (!passTargetFilter) return false;

    if (sportFilter !== "All") {
      const className = typeof c.name === 'object' ? c.name.en : c.name;
      if (!className.toLowerCase().includes(sportFilter.toLowerCase())) return false;
    }
    
    return true;
  }).sort((a, b) => {
    const timeA = typeof a.time === 'object' ? a.time.en : a.time;
    const timeB = typeof b.time === 'object' ? b.time.en : b.time;
    const startA = timeA?.split(' - ')[0] || "00:00";
    const startB = timeB?.split(' - ')[0] || "00:00";
    return startA.localeCompare(startB);
  });

  const saveToDB = async (newSchedule: any[]) => {
    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ schedule: newSchedule })
      });
    } catch (err) { console.error("Failed to save to DB"); }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this class?")) {
      const newSchedule = schedule.filter(c => c.id !== id);
      setSchedule(newSchedule);
      saveToDB(newSchedule);
    }
  };

  const openEditModal = (cls: any) => {
    setEditingId(cls.id);
    setFormData({ 
      day: cls.day, 
      time: typeof cls.time === 'object' ? cls.time : { en: cls.time, fr: cls.time, ar: cls.time }, 
      name: typeof cls.name === 'object' ? cls.name : { en: cls.name, fr: cls.name, ar: cls.name }, 
      target: typeof cls.target === 'object' ? cls.target : { en: cls.target, fr: cls.target, ar: cls.target } 
    });
    setEditLocale('en');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      day: selectedDay, 
      time: { en: "", fr: "", ar: "" }, 
      name: { en: "", fr: "", ar: "" }, 
      target: sessionFilter === "Women Only" ? { en: "Women Only", fr: "Femmes Uniquement", ar: "للسيدات فقط" } : { en: "Mixed", fr: "Mixte", ar: "مختلط" } 
    });
    setEditLocale('en');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    let newSchedule;
    if (editingId) {
      newSchedule = schedule.map(c => c.id === editingId ? { ...c, ...formData } : c);
    } else {
      newSchedule = [...schedule, { id: Math.floor(Math.random() * 1000000), ...formData }];
    }
    setSchedule(newSchedule);
    setIsModalOpen(false);
    setSportFilter("All");
    saveToDB(newSchedule);
  };

  return (
    <section id="schedule" className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            {sectionTitle ? (typeof sectionTitle === 'object' ? sectionTitle[locale] : sectionTitle) : <>Weekly Training <span className="text-red-600">Schedule</span></>}
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        {/* Day Selector */}
        <div 
          className="flex overflow-x-auto pb-4 mb-6 gap-3 justify-start md:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm whitespace-nowrap transition-all duration-300 ${
                selectedDay === day 
                  ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
              }`}
            >
              {DAY_TRANSLATIONS[day][locale]}
            </button>
          ))}
        </div>

        {/* Target Audience Filter Row */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setSessionFilter("Mixed")}
            className={`px-5 py-2 rounded-md font-bold uppercase tracking-wider text-sm transition-colors border-2 ${
              sessionFilter === "Mixed"
                ? "bg-zinc-800 border-zinc-600 text-white"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {FILTER_TRANSLATIONS["Mixed"][locale]}
          </button>
          <button
            onClick={() => setSessionFilter("Women Only")}
            className={`px-5 py-2 rounded-md font-bold uppercase tracking-wider text-sm transition-colors border-2 ${
              sessionFilter === "Women Only"
                ? "bg-zinc-800 border-zinc-600 text-white"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {FILTER_TRANSLATIONS["Women Only"][locale]}
          </button>
        </div>

        {/* Sport Filter Row */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap relative">
          {currentSportButtons.map(sport => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-xs transition-colors border ${
                sportFilter === sport
                  ? "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
              }`}
            >
              {sport === "All" && locale === 'fr' ? 'Tous' : sport === "All" && locale === 'ar' ? 'الكل' : sport}
            </button>
          ))}
          {isAdminMode && (
            <button 
              onClick={openFilterModal} 
              className="px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-xs bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700 border-dashed transition-all"
            >
              ⚙️ Edit Filters
            </button>
          )}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesToday.length > 0 ? (
            classesToday.map(cls => (
              <div 
                key={cls.id} 
                className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between hover:border-red-600/50 transition-colors"
              >
                <div>
                  <div className="text-red-500 font-bold mb-1 tracking-widest text-sm">{typeof cls.time === 'object' ? cls.time[locale] : cls.time}</div>
                  <h3 className="text-xl font-black text-white uppercase mb-2">{typeof cls.name === 'object' ? cls.name[locale] : cls.name}</h3>
                  <div className="inline-block bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider border border-zinc-700">
                    {locale === 'ar' ? 'الفئة:' : locale === 'fr' ? 'Cible:' : 'Target:'} {typeof cls.target === 'object' ? cls.target[locale] : cls.target}
                  </div>
                </div>

                {/* Admin Controls */}
                {isAdminMode && (
                  <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end gap-2">
                    <button onClick={() => openEditModal(cls)} className="text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(cls.id)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 bg-red-900/40 hover:bg-red-900/80 px-3 py-2 rounded border border-red-900/50">
                      ❌ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
              <span className="text-zinc-500 font-medium text-lg italic">{FILTER_TRANSLATIONS["No classes"][locale]} {DAY_TRANSLATIONS[selectedDay][locale]}. {FILTER_TRANSLATIONS["Time to recover"][locale]}</span>
            </div>
          )}
        </div>

        {/* Admin Add New Class */}
        {isAdminMode && (
          <div className="mt-8 flex justify-center">
            <button onClick={openAddModal} className="bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-8 py-4 rounded-lg font-bold flex items-center gap-3">
              <span className="text-2xl">+</span> Add Class to {DAY_TRANSLATIONS[selectedDay][locale]}
            </button>
          </div>
        )}

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase mb-6">
                {editingId ? "Edit Class" : "Add Class"}
              </h3>
              
              <div className="flex gap-2 mb-4">
                {(['en', 'fr', 'ar'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setEditLocale(lang)}
                    className={`px-3 py-1 text-xs font-bold uppercase rounded ${editLocale === lang ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Class Name ({editLocale})</label>
                  <input 
                    type="text" 
                    value={(formData.name as any)[editLocale] || ''} 
                    onChange={e => setFormData({...formData, name: {...formData.name, [editLocale]: e.target.value}})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    dir={editLocale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Day</label>
                    <select 
                      value={formData.day} 
                      onChange={e => setFormData({...formData, day: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{DAY_TRANSLATIONS[d][locale]}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Start Time</label>
                      <input 
                        type="time" 
                        value={((formData.time as any).en || "").split(' - ')[0] || ""} 
                        onChange={e => {
                          const currentEnd = ((formData.time as any).en || "").split(' - ')[1] || "";
                          const newTime = `${e.target.value} - ${currentEnd}`;
                          setFormData({...formData, time: { en: newTime, fr: newTime, ar: newTime }});
                        }} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600 [color-scheme:dark]"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">End Time</label>
                      <input 
                        type="time" 
                        value={((formData.time as any).en || "").split(' - ')[1] || ""} 
                        onChange={e => {
                          const currentStart = ((formData.time as any).en || "").split(' - ')[0] || "";
                          const newTime = `${currentStart} - ${e.target.value}`;
                          setFormData({...formData, time: { en: newTime, fr: newTime, ar: newTime }});
                        }} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Target Audience ({editLocale})</label>
                  <input 
                    type="text" 
                    value={(formData.target as any)[editLocale] || ''} 
                    onChange={e => setFormData({...formData, target: {...formData.target, [editLocale]: e.target.value}})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    dir={editLocale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Filter Config Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase mb-6">Configure Sport Filters</h3>
              
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => handleFilterFormCategoryChange("Mixed")}
                  className={`flex-1 py-2 text-xs font-bold uppercase rounded ${filterFormData.category === "Mixed" ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  Mixed / Men
                </button>
                <button
                  onClick={() => handleFilterFormCategoryChange("Women Only")}
                  className={`flex-1 py-2 text-xs font-bold uppercase rounded ${filterFormData.category === "Women Only" ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  Women Only
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Sports List (Comma Separated)</label>
                <textarea 
                  value={filterFormData.sports} 
                  onChange={e => setFilterFormData({...filterFormData, sports: e.target.value})} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                  rows={4}
                  placeholder="e.g. MMA, BJJ, Kickboxing"
                />
                <p className="text-zinc-500 text-xs mt-2 italic">These buttons will automatically appear when the "{filterFormData.category}" target is active.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsFilterModalOpen(false)} className="px-4 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
                <button onClick={saveFilterConfig} className="px-4 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Save Config</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

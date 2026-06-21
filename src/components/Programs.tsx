"use client";

import React, { useState } from "react";

interface ProgramsProps {
  isAdminMode: boolean;
}

const INITIAL_PROGRAMS = [
  {
    id: 1,
    title: "Mixed Martial Arts",
    description: "Combine striking and grappling to become a complete, well-rounded fighter.",
    detailedInfo: "Our MMA program is designed to integrate striking (Muay Thai, Boxing) with elite grappling (BJJ, Wrestling). You must wear official gym rash guards during training. Sparring is strictly supervised and requires 16oz gloves, mouthguard, and shin pads.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Muay Thai Kickboxing",
    description: "Master the art of eight limbs with devastating strikes, elbows, and knees.",
    detailedInfo: "Focus on proper technique, bag work, pad work, and conditioning. Required gear: 12-16oz gloves, shin pads, mouthguard, and hand wraps. All levels are welcome, but advanced sparring requires coach approval.",
    image: "https://images.unsplash.com/photo-1599552375246-8dd33f389360?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Brazilian Jiu-Jitsu",
    description: "Dominate the ground game using technique and leverage over brute strength.",
    detailedInfo: "Learn fundamental and advanced submission grappling. We alternate between Gi and No-Gi classes. White Gis are required for traditional classes. Respect the tap, keep your fingernails trimmed, and ensure your hygiene is impeccable.",
    image: "https://images.unsplash.com/photo-1564415315949-27a3c318dc3f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "CrossFit & Conditioning",
    description: "Build explosive power, elite endurance, and unbreakable mental toughness.",
    detailedInfo: "High-intensity interval training combined with Olympic weightlifting and gymnastics. Arrive 10 minutes early to warm up. Dropping empty barbells is strictly prohibited. Scale the workouts to your level.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Programs({ isAdminMode }: ProgramsProps) {
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  
  // Admin Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", detailedInfo: "", image: "" });

  // User Details Modal State
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this discipline?")) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  const openEditModal = (prog: any) => {
    setEditingId(prog.id);
    setFormData({ title: prog.title, description: prog.description, detailedInfo: prog.detailedInfo || "", image: prog.image });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", detailedInfo: "", image: "" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setPrograms(programs.map(p => p.id === editingId ? { ...p, ...formData } : p));
    } else {
      setPrograms([...programs, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <section id="programs" className="w-full py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Our Combat <span className="text-red-600">Disciplines</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col hover:border-red-600 transition-colors duration-300">
              
              {/* Image Placeholder */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={prog.image} 
                  alt={prog.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white uppercase mb-3">{prog.title}</h3>
                <p className="text-zinc-400 mb-6 flex-1">{prog.description}</p>
                
                <button 
                  onClick={() => setSelectedProgram(prog)}
                  className="text-red-500 font-bold uppercase tracking-widest text-sm hover:text-white transition-colors text-left"
                >
                  Learn More &rarr;
                </button>
              </div>

              {/* Admin Overlay Controls */}
              {isAdminMode && (
                <div className="absolute top-4 right-4 flex gap-2 z-10 bg-zinc-950/80 p-2 rounded-lg backdrop-blur-sm border border-zinc-700">
                  <button onClick={() => openEditModal(prog)} className="text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded">
                    ✏️ Edit Sport
                  </button>
                  <button onClick={() => handleDelete(prog.id)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 bg-red-900/40 hover:bg-red-900/80 px-2 py-1 rounded border border-red-900/50">
                    ❌ Delete
                  </button>
                </div>
              )}
              
            </div>
          ))}
        </div>

        {/* Admin Add New Card */}
        {isAdminMode && (
          <div className="mt-8 flex justify-center">
            <button onClick={openAddModal} className="bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-8 py-4 rounded-lg font-bold flex items-center gap-3">
              <span className="text-2xl">+</span> Add New Discipline
            </button>
          </div>
        )}

        {/* User Details Modal Overlay */}
        {selectedProgram && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col relative">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <img src={selectedProgram.image} alt={selectedProgram.title} className="w-full h-64 object-cover" />
              
              <div className="p-8 overflow-y-auto">
                <h3 className="text-3xl font-black text-white uppercase mb-4">{selectedProgram.title}</h3>
                <p className="text-lg text-zinc-300 mb-6 font-medium">{selectedProgram.description}</p>
                
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg mb-8">
                  <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-3">Detailed Info / Rules</h4>
                  <p className="text-zinc-400 whitespace-pre-line leading-relaxed">{selectedProgram.detailedInfo}</p>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedProgram(null);
                    setTimeout(() => {
                      document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full py-4 rounded font-bold text-lg uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                  📅 View Schedule Slots
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Edit Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-white uppercase mb-6">
                {editingId ? "Edit Discipline" : "Add Discipline"}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Short Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Detailed Info / Rules</label>
                  <textarea 
                    value={formData.detailedInfo} 
                    onChange={e => setFormData({...formData, detailedInfo: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Upload Image</label>
                  <div className="relative w-full h-32 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded flex flex-col items-center justify-center hover:border-red-600 hover:bg-zinc-900 transition-colors cursor-pointer overflow-hidden group">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="relative z-10 bg-black/60 px-3 py-1 rounded text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Change Image</div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-zinc-500 group-hover:text-red-500 transition-colors">
                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-sm font-bold uppercase tracking-wider">Tap to Upload</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setFormData({...formData, image: url});
                        }
                      }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

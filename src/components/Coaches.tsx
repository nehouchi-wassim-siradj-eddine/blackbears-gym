"use client";

import React, { useState } from "react";

interface CoachesProps {
  isAdminMode: boolean;
}

const INITIAL_COACHES = [
  { id: 1, name: "Coach Reda", role: "Black Belt BJJ & Head Grappling Coach", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "Coach Amine", role: "Striking & MMA Specialist", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "Coach Sarah", role: "CrossFit & Conditioning Lead", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" }
];

export default function Coaches({ isAdminMode }: CoachesProps) {
  const [coaches, setCoaches] = useState(INITIAL_COACHES);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "", image: "" });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this coach?")) {
      setCoaches(coaches.filter(c => c.id !== id));
    }
  };

  const openEditModal = (coach: any) => {
    setEditingId(coach.id);
    setFormData({ name: coach.name, role: coach.role, image: coach.image });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", image: "" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setCoaches(coaches.map(c => c.id === editingId ? { ...c, ...formData } : c));
    } else {
      setCoaches([...coaches, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <section id="coaches" className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Meet Our Elite <span className="text-red-600">Coaches</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coaches.map(coach => (
            <div key={coach.id} className="relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-colors">
              <img src={coach.image} alt={coach.name} className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <h3 className="text-2xl font-black text-white uppercase mb-1">{coach.name}</h3>
                <p className="text-zinc-400 font-medium">{coach.role}</p>
              </div>

              {isAdminMode && (
                <div className="absolute top-4 right-4 flex gap-2 z-10 bg-zinc-950/80 p-2 rounded-lg backdrop-blur-sm border border-zinc-700">
                  <button onClick={() => openEditModal(coach)} className="text-xs font-bold text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(coach.id)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-900/40 hover:bg-red-900/80 px-2 py-1 rounded border border-red-900/50">
                    ❌ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isAdminMode && (
          <div className="mt-8 flex justify-center">
            <button onClick={openAddModal} className="bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-8 py-4 rounded-lg font-bold flex items-center gap-3">
              <span className="text-2xl">+</span> Add New Coach
            </button>
          </div>
        )}

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase mb-6">
                {editingId ? "Edit Coach" : "Add Coach"}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Role</label>
                  <input 
                    type="text" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
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

"use client";

import React, { useState } from "react";

interface ScheduleProps {
  isAdminMode: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INITIAL_SCHEDULE = [
  { id: 1, day: "Monday", time: "18:00 - 19:30", name: "MMA Advanced", target: "Mixed" },
  { id: 2, day: "Monday", time: "19:30 - 21:00", name: "BJJ Fundamentals", target: "Mixed" },
  { id: 3, day: "Monday", time: "17:00 - 18:00", name: "Women's Kickboxing", target: "Women Only" },
  { id: 4, day: "Tuesday", time: "18:00 - 19:30", name: "Muay Thai Sparring", target: "Men" },
  { id: 5, day: "Tuesday", time: "19:30 - 20:30", name: "Women's CrossFit", target: "Women Only" },
  { id: 6, day: "Wednesday", time: "18:00 - 19:30", name: "No-Gi Grappling", target: "Mixed" },
  { id: 7, day: "Thursday", time: "18:00 - 19:30", name: "MMA Fundamentals", target: "Mixed" },
  { id: 8, day: "Thursday", time: "19:30 - 20:30", name: "Women's Lutte", target: "Women Only" },
  { id: 9, day: "Friday", time: "18:00 - 19:30", name: "Open Mat", target: "Mixed" },
  { id: 10, day: "Saturday", time: "10:00 - 12:00", name: "Competition Prep", target: "Invite Only" },
];

export default function Schedule({ isAdminMode }: ScheduleProps) {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [sessionFilter, setSessionFilter] = useState("Mixed"); // "Mixed" or "Women Only"

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ day: "Monday", time: "", name: "", target: "Mixed" });

  const classesToday = schedule.filter(c => {
    if (c.day !== selectedDay) return false;
    if (sessionFilter === "Women Only") return c.target === "Women Only";
    return c.target !== "Women Only";
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this class?")) {
      setSchedule(schedule.filter(c => c.id !== id));
    }
  };

  const openEditModal = (cls: any) => {
    setEditingId(cls.id);
    setFormData({ day: cls.day, time: cls.time, name: cls.name, target: cls.target });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ day: selectedDay, time: "", name: "", target: sessionFilter === "Women Only" ? "Women Only" : "Mixed" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setSchedule(schedule.map(c => c.id === editingId ? { ...c, ...formData } : c));
    } else {
      setSchedule([...schedule, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <section id="schedule" className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Weekly Training <span className="text-red-600">Schedule</span>
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
              {day}
            </button>
          ))}
        </div>

        {/* Target Audience Filter Row */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button
            onClick={() => setSessionFilter("Mixed")}
            className={`px-5 py-2 rounded-md font-bold uppercase tracking-wider text-sm transition-colors border-2 ${
              sessionFilter === "Mixed"
                ? "bg-zinc-800 border-zinc-600 text-white"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            🥊 Men / Mixed Sessions
          </button>
          <button
            onClick={() => setSessionFilter("Women Only")}
            className={`px-5 py-2 rounded-md font-bold uppercase tracking-wider text-sm transition-colors border-2 ${
              sessionFilter === "Women Only"
                ? "bg-zinc-800 border-zinc-600 text-white"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            🚺 Women-Only Sessions
          </button>
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
                  <div className="text-red-500 font-bold mb-1 tracking-widest text-sm">{cls.time}</div>
                  <h3 className="text-xl font-black text-white uppercase mb-2">{cls.name}</h3>
                  <div className="inline-block bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider border border-zinc-700">
                    Target: {cls.target}
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
              <span className="text-zinc-500 font-medium text-lg italic">No classes scheduled for {selectedDay}. Time to recover!</span>
            </div>
          )}
        </div>

        {/* Admin Add New Class */}
        {isAdminMode && (
          <div className="mt-8 flex justify-center">
            <button onClick={openAddModal} className="bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-8 py-4 rounded-lg font-bold flex items-center gap-3">
              <span className="text-2xl">+</span> Add Class to {selectedDay}
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
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Class Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Day</label>
                    <select 
                      value={formData.day} 
                      onChange={e => setFormData({...formData, day: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 18:00 - 19:30"
                      value={formData.time} 
                      onChange={e => setFormData({...formData, time: e.target.value})} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Target Audience</label>
                  <select 
                    value={formData.target} 
                    onChange={e => setFormData({...formData, target: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Men">Men Only</option>
                    <option value="Women Only">Women Only</option>
                    <option value="Kids">Kids</option>
                    <option value="Invite Only">Invite Only</option>
                  </select>
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

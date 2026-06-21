"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem("bb_admin_auth_token", data.token);
        router.push("/");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-900/10 to-zinc-950 z-0 pointer-events-none" />
      
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md p-8 sm:p-10 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-inner mb-6">
            <img src="/logo.png" alt="Black Bears Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest text-center">Admin Portal</h2>
          <p className="text-zinc-400 font-medium mt-2 text-sm uppercase tracking-wider">Secure Authorization Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest p-4 rounded-lg text-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors shadow-inner"
              placeholder="admin@blackbears.com"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 mt-4"
          >
            Authorize Access
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800 pt-6">
          <a href="/" className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Return to Public Site
          </a>
        </div>
      </div>
    </div>
  );
}

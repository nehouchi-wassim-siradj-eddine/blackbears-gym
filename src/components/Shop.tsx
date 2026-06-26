"use client";

import React, { useState, useEffect } from "react";

interface ShopProps {
  isAdminMode: boolean;
  initialProducts?: any[];
  locale?: 'en' | 'fr' | 'ar';
}

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: { en: "Pro Boxing Gloves 16oz", fr: "Gants Pro Boxe 16oz", ar: "قفازات ملاكمة 16 أوقية" },
    description: { en: "Premium leather gloves for heavy sparring.", fr: "Gants en cuir premium pour le sparring lourd.", ar: "قفازات جلدية فاخرة للتدريب الشاق." },
    price: { en: "$65.00", fr: "65,00 €", ar: "8500 دج" },
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function Shop({ isAdminMode, initialProducts, locale = 'en' }: ShopProps) {
  const [products, setProducts] = useState(initialProducts || INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLocale, setEditLocale] = useState<'en'|'fr'|'ar'>('en');
  
  const [formData, setFormData] = useState({
    name: { en: "", fr: "", ar: "" },
    description: { en: "", fr: "", ar: "" },
    price: { en: "", fr: "", ar: "" },
    image: ""
  });

  useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
  }, [initialProducts]);

  const saveToDB = async (newProducts: any[]) => {
    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ products: newProducts })
      });
    } catch (err) { console.error("Failed to save DB", err); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: { en: "", fr: "", ar: "" },
      description: { en: "", fr: "", ar: "" },
      price: { en: "", fr: "", ar: "" },
      image: ""
    });
    setEditLocale('en');
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: typeof p.name === 'object' ? p.name : { en: p.name, fr: p.name, ar: p.name },
      description: typeof p.description === 'object' ? p.description : { en: p.description, fr: p.description, ar: p.description },
      price: typeof p.price === 'object' ? p.price : { en: p.price, fr: p.price, ar: p.price },
      image: p.image || ""
    });
    setEditLocale('en');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this product?")) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      saveToDB(newProducts);
    }
  };

  const handleSave = () => {
    let newProducts;
    if (editingId) {
      newProducts = products.map(p => p.id === editingId ? { ...p, ...formData } : p);
    } else {
      newProducts = [...products, { id: Math.floor(Math.random() * 1000000), ...formData }];
    }
    setProducts(newProducts);
    setIsModalOpen(false);
    saveToDB(newProducts);
  };

  const gymPhone = "0661234567"; // Placeholder for WhatsApp/Call

  return (
    <section id="shop" className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Pro <span className="text-red-600">Shop</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
          <p className="mt-4 text-zinc-400 font-medium max-w-2xl mx-auto">
            {locale === 'ar' ? 'تجهز كالمحترفين. تصفح أدواتنا ومعداتنا الرسمية.' : locale === 'fr' ? 'Équipez-vous comme un pro. Parcourez nos équipements officiels.' : 'Gear up like a pro. Browse our official training equipment and apparel.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(p => {
            const pName = typeof p.name === 'object' ? p.name[locale] : p.name;
            const pDesc = typeof p.description === 'object' ? p.description[locale] : p.description;
            const pPrice = typeof p.price === 'object' ? p.price[locale] : p.price;
            
            const waText = encodeURIComponent(`Hello, I want to order ${pName} for ${pPrice}`);
            const waLink = `https://wa.me/${gymPhone}?text=${waText}`;

            return (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group hover:border-red-600/50 transition-colors">
                <div className="h-64 overflow-hidden relative bg-zinc-950 flex items-center justify-center p-4">
                  {p.image ? (
                    <img src={p.image} alt={pName} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="text-zinc-700 font-bold uppercase tracking-widest text-xs">No Image</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-white uppercase leading-tight">{pName}</h3>
                    <span className="text-red-500 font-bold ml-2 whitespace-nowrap">{pPrice}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6 flex-grow">{pDesc}</p>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full bg-transparent border border-emerald-500/30 text-emerald-400 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:text-emerald-300 transition-all uppercase text-xs tracking-wider">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      Order via WhatsApp
                    </a>
                    <a href={`tel:${gymPhone}`} className="w-full bg-zinc-900 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:text-red-300 transition-all uppercase text-xs tracking-wider">
                      📞 Direct Call
                    </a>
                  </div>

                  {isAdminMode && (
                    <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end gap-2">
                      <button onClick={() => openEditModal(p)} className="text-xs font-bold text-zinc-300 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-900/40 px-3 py-1.5 rounded border border-red-900/50">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isAdminMode && (
          <div className="mt-12 flex justify-center">
            <button onClick={openAddModal} className="bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-8 py-4 rounded-lg font-bold flex items-center gap-3">
              <span className="text-2xl">+</span> Add New Product
            </button>
          </div>
        )}

        {/* Admin Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-white uppercase mb-6">{editingId ? "Edit Product" : "Add Product"}</h3>
              
              <div className="flex gap-2 mb-6">
                {(['en', 'fr', 'ar'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setEditLocale(lang)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded flex-1 ${editLocale === lang ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Product Name ({editLocale})</label>
                  <input 
                    type="text" 
                    value={(formData.name as any)[editLocale] || ''} 
                    onChange={e => setFormData({...formData, name: {...formData.name, [editLocale]: e.target.value}})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    dir={editLocale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Price ({editLocale})</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $65.00 or 8500 DA"
                    value={(formData.price as any)[editLocale] || ''} 
                    onChange={e => setFormData({...formData, price: {...formData.price, [editLocale]: e.target.value}})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    dir={editLocale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Description ({editLocale})</label>
                  <textarea 
                    value={(formData.description as any)[editLocale] || ''} 
                    onChange={e => setFormData({...formData, description: {...formData.description, [editLocale]: e.target.value}})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    rows={3}
                    dir={editLocale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Product Image</label>
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-full h-32 object-contain bg-zinc-950 border border-zinc-800 rounded mb-2" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    className="w-full text-zinc-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

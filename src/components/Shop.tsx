"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface ShopProps {
  isAdminMode: boolean;
  initialProducts?: any[];
  initialCategories?: { en: string, fr: string, ar: string }[];
  locale?: 'en' | 'fr' | 'ar';
}

const DEFAULT_CATEGORIES = [
  { en: "Apparel", fr: "Vêtements", ar: "ملابس" },
  { en: "Equipment", fr: "Équipement", ar: "معدات" }
];

export default function Shop({ isAdminMode, initialProducts, initialCategories, locale = 'en' }: ShopProps) {
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState<{en:string, fr:string, ar:string}[]>(initialCategories || DEFAULT_CATEGORIES);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLocale, setEditLocale] = useState<'en'|'fr'|'ar'>('en');
  
  const [formData, setFormData] = useState({
    name: { en: "", fr: "", ar: "" },
    description: { en: "", fr: "", ar: "" },
    price: { en: "", fr: "", ar: "" },
    images: [] as string[],
    category: "",
    phone: ""
  });

  const [categoryForm, setCategoryForm] = useState({ en: "", fr: "", ar: "" });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
    if (initialCategories && initialCategories.length > 0) setCategories(initialCategories);
  }, [initialProducts, initialCategories]);

  const saveToDB = async (newProducts: any[], newCategories?: any[]) => {
    try {
      const token = localStorage.getItem("bb_admin_auth_token");
      const payload: any = { products: newProducts };
      if (newCategories) {
        payload.sectionTitles = { shopCategories: newCategories };
      }
      await fetch('/api/gym-data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
    } catch (err) { console.error("Failed to save DB", err); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Upload error:", error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const openAddProductModal = () => {
    setEditingId(null);
    setFormData({
      name: { en: "", fr: "", ar: "" },
      description: { en: "", fr: "", ar: "" },
      price: { en: "", fr: "", ar: "" },
      images: [],
      category: categories.length > 0 ? categories[0].en : "Uncategorized",
      phone: ""
    });
    setEditLocale('en');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: any, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the dynamic route when clicking edit
    setEditingId(p.id);
    setFormData({
      name: typeof p.name === 'object' ? p.name : { en: p.name, fr: p.name, ar: p.name },
      description: typeof p.description === 'object' ? p.description : { en: p.description, fr: p.description, ar: p.description },
      price: typeof p.price === 'object' ? p.price : { en: p.price, fr: p.price, ar: p.price },
      images: p.images || [],
      category: p.category || "Uncategorized",
      phone: p.phone || ""
    });
    setEditLocale('en');
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to dynamic route
    if (confirm("Delete this product?")) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      saveToDB(newProducts, categories);
    }
  };

  const handleSaveProduct = () => {
    let newProducts;
    if (editingId) {
      newProducts = products.map(p => p.id === editingId ? { ...p, ...formData } : p);
    } else {
      newProducts = [...products, { id: Math.floor(Math.random() * 1000000), ...formData }];
    }
    setProducts(newProducts);
    setIsProductModalOpen(false);
    saveToDB(newProducts, categories);
  };

  const handleAddCategory = () => {
    if (!categoryForm.en) return;
    const newCats = [...categories, categoryForm];
    setCategories(newCats);
    setCategoryForm({ en: "", fr: "", ar: "" });
    saveToDB(products, newCats);
  };

  const handleDeleteCategory = (idx: number) => {
    if (confirm("Delete this category?")) {
      const newCats = categories.filter((_, i) => i !== idx);
      setCategories(newCats);
      saveToDB(products, newCats);
    }
  };

  return (
    <section id="shop" className="w-full py-16 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Pro <span className="text-red-600">Store</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          <p className="mt-4 text-zinc-400 font-medium max-w-2xl mx-auto">
            {locale === 'ar' ? 'تجهز كالمحترفين. تصفح أدواتنا ومعداتنا الرسمية.' : locale === 'fr' ? 'Équipez-vous comme un pro. Parcourez nos équipements officiels.' : 'Gear up like a pro. Browse our official training equipment and apparel.'}
          </p>
        </div>

        {isAdminMode && (
          <div className="mb-12 flex justify-center gap-4">
            <button onClick={openAddProductModal} className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-6 py-3 rounded-lg font-bold flex items-center gap-2">
              <span className="text-red-600">+</span> Add Product
            </button>
            <button onClick={() => setIsCategoryModalOpen(true)} className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all px-6 py-3 rounded-lg font-bold flex items-center gap-2">
              ⚙️ Manage Categories
            </button>
          </div>
        )}

        {/* Render categories as carousels */}
        {categories.map((cat, idx) => {
          const categoryProducts = products.filter(p => p.category === cat.en);
          if (categoryProducts.length === 0 && !isAdminMode) return null;

          return (
            <div key={idx} className="mb-16">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">{cat[locale] || cat.en}</h3>
              
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar scroll-smooth">
                {categoryProducts.map(p => {
                  const pName = typeof p.name === 'object' ? p.name[locale] : p.name;
                  const pDesc = typeof p.description === 'object' ? p.description[locale] : p.description;
                  const pPrice = typeof p.price === 'object' ? p.price[locale] : p.price;
                  
                  const pImages = p.images && p.images.length > 0 ? p.images : [];
                  const mainImage = pImages.length > 0 ? pImages[0] : null;

                  return (
                    <Link href={`/shop/${p.id}`} prefetch={true} key={p.id} className="snap-start min-w-[300px] w-[300px] sm:w-[350px] bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col group hover:border-red-600/50 transition-colors shadow-xl shrink-0 cursor-pointer">
                      <div className="h-64 overflow-hidden relative bg-zinc-950/80 flex items-center justify-center p-6">
                        {mainImage ? (
                          <img src={mainImage} alt={pName} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" />
                        ) : (
                          <div className="text-zinc-700 font-bold uppercase tracking-widest text-xs">No Image</div>
                        )}
                        {pImages.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                            + {pImages.length - 1} MORE
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-zinc-950/50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-black text-white uppercase leading-tight">{pName}</h3>
                          <span className="text-red-500 font-bold ml-2 whitespace-nowrap bg-red-500/10 px-2 py-1 rounded text-xs border border-red-500/20">{pPrice}</span>
                        </div>
                        {/* FIX: Description is now correctly placed directly below the title */}
                        <p className="text-zinc-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{pDesc}</p>
                        
                        <div className="flex flex-col gap-3 mt-auto">
                          <div className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all uppercase text-xs tracking-wider">
                            View Details
                          </div>
                        </div>

                        {isAdminMode && (
                          <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end gap-2" onClick={e => e.preventDefault()}>
                            <button onClick={(e) => openEditProductModal(p, e)} className="text-xs font-bold text-zinc-300 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded relative z-10">Edit</button>
                            <button onClick={(e) => handleDeleteProduct(p.id, e)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-900/40 px-3 py-1.5 rounded border border-red-900/50 relative z-10">Delete</button>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
                {categoryProducts.length === 0 && isAdminMode && (
                  <div className="w-full text-zinc-500 text-sm italic">No products in this category yet.</div>
                )}
              </div>
            </div>
          );
        })}

        {/* CSS for hiding scrollbar but allowing scroll */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Product Modal */}
        {isProductModalOpen && (
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
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                  >
                    {categories.map(c => (
                      <option key={c.en} value={c.en}>{c.en}</option>
                    ))}
                    <option value="Uncategorized">Uncategorized</option>
                  </select>
                </div>
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
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Product Phone Number (e.g., 0661223344)</label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-600"
                    placeholder="0661223344"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Product Images (Upload Multiple)</label>
                  
                  {formData.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2 mb-2 snap-x">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative shrink-0 snap-center">
                          <img src={img} alt={`Preview ${idx}`} className="h-20 w-20 object-cover bg-zinc-950 border border-zinc-800 rounded" />
                          <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-zinc-900 hover:bg-red-500">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}  
                    disabled={isUploading}
                    className="w-full text-zinc-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer disabled:opacity-50"
                  />
                  {isUploading && <p className="text-red-500 text-xs font-bold mt-2 animate-pulse">Uploading images to bucket, please wait...</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button onClick={() => setIsProductModalOpen(false)} className="px-6 py-2 rounded font-bold text-sm bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700">Cancel</button>
                <button onClick={handleSaveProduct} disabled={isUploading} className="px-6 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Category Management Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase mb-6">Manage Categories</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded border border-zinc-800">
                    <span className="text-zinc-300 font-bold">{cat.en}</span>
                    <button onClick={() => handleDeleteCategory(idx)} className="text-xs text-red-500 hover:text-red-400">Delete</button>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-zinc-500 text-sm">No categories created yet.</p>}
              </div>

              <div className="border-t border-zinc-800 pt-4 mb-6">
                <h4 className="text-sm font-bold text-zinc-400 uppercase mb-3">Add New Category</h4>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input type="text" placeholder="EN (e.g. Shirts)" value={categoryForm.en} onChange={e => setCategoryForm({...categoryForm, en: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-red-600" />
                  <input type="text" placeholder="FR (e.g. Chemises)" value={categoryForm.fr} onChange={e => setCategoryForm({...categoryForm, fr: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-red-600" />
                  <input type="text" placeholder="AR (e.g. قمصان)" value={categoryForm.ar} onChange={e => setCategoryForm({...categoryForm, ar: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-red-600" dir="rtl" />
                </div>
                <button onClick={handleAddCategory} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded text-sm transition-colors border border-zinc-700">Add Category</button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-2 rounded font-bold text-sm bg-red-600 text-white hover:bg-red-700">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

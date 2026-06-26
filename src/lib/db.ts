import { supabase } from './supabaseClient';
import { unstable_cache, unstable_noStore } from 'next/cache';

export const readCachedDB = unstable_cache(
  async () => {
  try {
    const [appStateRes, plansRes, programsRes, coachesRes, scheduleRes] = await Promise.all([
      supabase.from('app_state').select('*').eq('id', 1).maybeSingle(),
      supabase.from('plans').select('*').order('id'),
      supabase.from('programs').select('*').order('id'),
      supabase.from('coaches').select('*').order('id'),
      supabase.from('schedule').select('*').order('id')
    ]);

    if (appStateRes.error) console.error("Error reading app_state:", appStateRes.error);
    if (plansRes.error) console.error("Error reading plans:", plansRes.error);
    if (programsRes.error) console.error("Error reading programs:", programsRes.error);
    if (coachesRes.error) console.error("Error reading coaches:", coachesRes.error);
    if (scheduleRes.error) console.error("Error reading schedule:", scheduleRes.error);

    const plans = (plansRes.data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      isPopular: p.is_popular,
      coachPhone: p.coach_phone,
      features: p.features
    }));

    const programs = (programsRes.data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      detailedInfo: p.detailed_info,
      image: p.image
    }));

    return {
      headerState: appStateRes.data?.header_state || {},
      footerState: appStateRes.data?.footer_state || {},
      sectionTitles: appStateRes.data?.section_titles || {},
      plans,
      programs,
      coaches: coachesRes.data || [],
      schedule: scheduleRes.data || []
    };
  } catch (error) {
    console.error("Error reading from Supabase:", error);
    return null;
  }
}, ['db-cache-v3-pure-layout'], { tags: ['core-data'], revalidate: 60 });

export async function readDB() {
  const cachedData = await readCachedDB() || {
    headerState: {}, footerState: {}, sectionTitles: {},
    plans: [], programs: [], coaches: [], schedule: []
  };

  let products: any[] = [];
  try {
    const productsRes = await supabase.from('products').select('id, name, description, price, image, category, phone').order('id');
    if (productsRes.error) {
      console.error("Error reading products:", productsRes.error);
    } else {
      products = (productsRes.data || []).map((p: any) => {
        let parsedImages = [];
        try {
          parsedImages = JSON.parse(p.image);
          if (!Array.isArray(parsedImages)) parsedImages = p.image ? [p.image] : [];
        } catch (e) {
          parsedImages = p.image ? [p.image] : [];
        }
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          images: parsedImages,
          category: p.category || 'Uncategorized',
          phone: p.phone || ''
        };
      });
    }
  } catch (error) {
    console.error("Error reading products dynamically:", error);
  }

  return {
    ...cachedData,
    products
  };
}

export async function readProduct(id: string) {

  let product = null;
  try {
    const { data, error } = await supabase.from('products').select('id, name, description, price, image, category, phone').eq('id', id).maybeSingle();
    if (data) {
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(data.image);
        if (!Array.isArray(parsedImages)) parsedImages = data.image ? [data.image] : [];
      } catch (e) {
        parsedImages = data.image ? [data.image] : [];
      }
      product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        images: parsedImages,
        category: data.category || 'Uncategorized',
        phone: data.phone || ''
      };
    }
  } catch (error) {
    console.error("Error reading product dynamically:", error);
  }

  return product;
}

export async function writeDB(data: any) {
  try {
    // 1. App State
    if (data.headerState || data.footerState || data.sectionTitles) {
      const existingRes = await supabase.from('app_state').select('*').eq('id', 1).maybeSingle();
      const payload: any = existingRes.data || { id: 1, header_state: {}, footer_state: {}, section_titles: {} };
      
      if (data.headerState) payload.header_state = data.headerState;
      if (data.footerState) payload.footer_state = data.footerState;
      if (data.sectionTitles) payload.section_titles = data.sectionTitles;
      
      const { error } = await supabase.from('app_state').upsert(payload);
      if (error) throw new Error(`App State Upsert Error: ${error.message}`);
    }
    
    // 2. Plans
    if (data.plans) {
      const dbPlans = data.plans.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        is_popular: p.isPopular,
        coach_phone: p.coachPhone,
        features: p.features
      }));
      const { data: existing, error: selErr } = await supabase.from('plans').select('id');
      if (selErr) throw new Error(`Plans Select Error: ${selErr.message}`);
      
      const existingIds = existing?.map(e => e.id) || [];
      const newIds = dbPlans.map((p: any) => p.id);
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from('plans').delete().in('id', toDelete);
        if (delErr) throw new Error(`Plans Delete Error: ${delErr.message}`);
      }
      if (dbPlans.length > 0) {
        const { error: upErr } = await supabase.from('plans').upsert(dbPlans);
        if (upErr) throw new Error(`Plans Upsert Error: ${upErr.message}`);
      }
    }

    // 3. Programs
    if (data.programs) {
      const dbPrograms = data.programs.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        detailed_info: p.detailedInfo,
        image: p.image
      }));
      const { data: existing, error: selErr } = await supabase.from('programs').select('id');
      if (selErr) throw new Error(`Programs Select Error: ${selErr.message}`);
      
      const existingIds = existing?.map(e => e.id) || [];
      const newIds = dbPrograms.map((p: any) => p.id);
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from('programs').delete().in('id', toDelete);
        if (delErr) throw new Error(`Programs Delete Error: ${delErr.message}`);
      }
      if (dbPrograms.length > 0) {
        const { error: upErr } = await supabase.from('programs').upsert(dbPrograms);
        if (upErr) throw new Error(`Programs Upsert Error: ${upErr.message}`);
      }
    }

    // 4. Coaches
    if (data.coaches) {
      const dbCoaches = data.coaches.map((c: any) => ({
        id: c.id,
        name: c.name,
        role: c.role,
        image: c.image
      }));
      const { data: existing, error: selErr } = await supabase.from('coaches').select('id');
      if (selErr) throw new Error(`Coaches Select Error: ${selErr.message}`);
      
      const existingIds = existing?.map(e => e.id) || [];
      const newIds = dbCoaches.map((c: any) => c.id);
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from('coaches').delete().in('id', toDelete);
        if (delErr) throw new Error(`Coaches Delete Error: ${delErr.message}`);
      }
      if (dbCoaches.length > 0) {
        const { error: upErr } = await supabase.from('coaches').upsert(dbCoaches);
        if (upErr) throw new Error(`Coaches Upsert Error: ${upErr.message}`);
      }
    }

    // 5. Schedule
    if (data.schedule) {
      const dbSchedule = data.schedule.map((s: any) => ({
        id: s.id,
        day: s.day,
        time: s.time,
        name: s.name,
        target: s.target
      }));
      const { data: existing, error: selErr } = await supabase.from('schedule').select('id');
      if (selErr) throw new Error(`Schedule Select Error: ${selErr.message}`);
      
      const existingIds = existing?.map(e => e.id) || [];
      const newIds = dbSchedule.map((s: any) => s.id);
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from('schedule').delete().in('id', toDelete);
        if (delErr) throw new Error(`Schedule Delete Error: ${delErr.message}`);
      }
      if (dbSchedule.length > 0) {
        const { error: upErr } = await supabase.from('schedule').upsert(dbSchedule);
        if (upErr) throw new Error(`Schedule Upsert Error: ${upErr.message}`);
      }
    }

    // 6. Products
    if (data.products) {
      const dbProducts = data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: JSON.stringify(p.images || []),
        category: p.category || 'Uncategorized',
        phone: p.phone || ''
      }));
      const { data: existing, error: selErr } = await supabase.from('products').select('id');
      if (selErr) throw new Error(`Products Select Error: ${selErr.message}`);
      
      const existingIds = existing?.map(e => e.id) || [];
      const newIds = dbProducts.map((p: any) => p.id);
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from('products').delete().in('id', toDelete);
        if (delErr) throw new Error(`Products Delete Error: ${delErr.message}`);
      }
      if (dbProducts.length > 0) {
        const { error: upErr } = await supabase.from('products').upsert(dbProducts);
        if (upErr) throw new Error(`Products Upsert Error: ${upErr.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error("FATAL DB WRITE ERROR:", error);
    return false;
  }
}

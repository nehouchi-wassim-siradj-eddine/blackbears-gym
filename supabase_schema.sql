-- Supabase PostgreSQL Schema for Black Bears Gym
-- Run this in the Supabase SQL Editor

-- ==========================================
-- 1. Create Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  title JSONB NOT NULL,
  price JSONB NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  coach_phone TEXT,
  features JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  detailed_info JSONB,
  image TEXT
);

CREATE TABLE IF NOT EXISTS coaches (
  id SERIAL PRIMARY KEY,
  name JSONB NOT NULL,
  role JSONB NOT NULL,
  image TEXT
);

CREATE TABLE IF NOT EXISTS schedule (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  time JSONB NOT NULL,
  name JSONB NOT NULL,
  target JSONB NOT NULL
);

-- Singleton table for application-wide state
CREATE TABLE IF NOT EXISTS app_state (
  id INT PRIMARY KEY DEFAULT 1,
  header_state JSONB NOT NULL,
  footer_state JSONB NOT NULL,
  section_titles JSONB NOT NULL
);

-- ==========================================
-- 2. Insert Initial Data
-- ==========================================

-- Plans Data
INSERT INTO plans (id, title, price, is_popular, coach_phone, features) VALUES 
(1, '{"en": "Normal Plan", "fr": "Plan Normal", "ar": "الخطة العادية"}', '{"en": "$99/mo", "fr": "99€/mois", "ar": "9900 دج/شهر"}', false, '0661234567', '{"en": "Basic Gym Access\nOpen Mat Sessions\nLocker Room Access", "fr": "Accès Base\nSessions Tapis Ouvert\nAccès Vestiaire", "ar": "دخول أساسي للجم\nحصص حلبة مفتوحة\nغرف تبديل الملابس"}'),
(2, '{"en": "Fighter Plan", "fr": "Plan Combattant", "ar": "خطة المقاتل"}', '{"en": "$149/mo", "fr": "149€/mois", "ar": "14900 دج/شهر"}', true, '0661234567', '{"en": "Full Combat Classes\nCrossFit Access\nBasic Gym Access\nLocker Room Access", "fr": "Cours de Combat Complets\nAccès CrossFit\nAccès Base Gym\nAccès Vestiaire", "ar": "حصص قتالية كاملة\nكروس فيت\nدخول أساسي للجم\nغرف تبديل الملابس"}'),
(3, '{"en": "VIP/Elite Plan", "fr": "Plan Élite", "ar": "خطة النخبة VIP"}', '{"en": "$249/mo", "fr": "249€/mois", "ar": "24900 دج/شهر"}', false, '0661234567', '{"en": "Unlimited Personal Coaching\nFull Combat Classes\nNutrition Plan\nCrossFit Access\nPremium Locker & Towel", "fr": "Coaching Personnel Illimité\nCours de Combat Complets\nPlan de Nutrition\nAccès CrossFit\nVestiaire Premium & Serviette", "ar": "تدريب شخصي لا محدود\nحصص قتالية كاملة\nخطة غذائية\nكروس فيت\nخزانة خاصة و منشفة"}')
ON CONFLICT (id) DO NOTHING;

-- Programs Data
INSERT INTO programs (id, title, description, detailed_info, image) VALUES 
(1, '{"en": "Mixed Martial Arts", "fr": "Arts Martiaux Mixtes", "ar": "فنون القتال المختلطة"}', '{"en": "Combine striking and grappling to become a complete, well-rounded fighter.", "fr": "Combinez la frappe et le grappling pour devenir un combattant complet.", "ar": "اجمع بين الضرب والمصارعة لتصبح مقاتلاً متكاملاً."}', '{"en": "Our MMA program is designed to integrate striking (Muay Thai, Boxing) with elite grappling (BJJ, Wrestling). You must wear official gym rash guards during training. Sparring is strictly supervised and requires 16oz gloves, mouthguard, and shin pads.", "fr": "Notre programme de MMA est conçu pour intégrer la frappe avec le grappling d''élite. Gants de 16oz obligatoires.", "ar": "برنامجنا مصمم لدمج الضرب مع المصارعة. يجب ارتداء ملابس النادي الرسمية."}', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop'),
(2, '{"en": "Muay Thai Kickboxing", "fr": "Boxe Thaï", "ar": "المواي تاي"}', '{"en": "Master the art of eight limbs with devastating strikes, elbows, and knees.", "fr": "Maîtrisez l''art des huit membres avec des frappes dévastatrices.", "ar": "أتقن فن الأطراف الثمانية بضربات مدمرة."}', '{"en": "Focus on proper technique, bag work, pad work, and conditioning.", "fr": "Concentrez-vous sur la technique, le travail au sac et le conditionnement.", "ar": "ركز على التقنية الصحيحة، العمل على الكيس، واللياقة البدنية."}', 'https://images.unsplash.com/photo-1599552375246-8dd33f389360?q=80&w=2070&auto=format&fit=crop'),
(3, '{"en": "Brazilian Jiu-Jitsu", "fr": "Jiu-Jitsu Brésilien", "ar": "الجوجيتسو البرازيلية"}', '{"en": "Dominate the ground game using technique and leverage over brute strength.", "fr": "Dominez le combat au sol en utilisant la technique plutôt que la force.", "ar": "سيطر على القتال الأرضي باستخدام التقنية والرافعة بدلاً من القوة الغاشمة."}', '{"en": "Learn fundamental and advanced submission grappling. Respect the tap.", "fr": "Apprenez le grappling fondamental et avancé. Respectez l''abandon.", "ar": "تعلم أساسيات المصارعة والإخضاع المتقدمة. احترم الاستسلام."}', 'https://images.unsplash.com/photo-1564415315949-27a3c318dc3f?q=80&w=2070&auto=format&fit=crop'),
(4, '{"en": "CrossFit & Conditioning", "fr": "CrossFit & Conditionnement", "ar": "كروس فيت واللياقة"}', '{"en": "Build explosive power, elite endurance, and unbreakable mental toughness.", "fr": "Développez une puissance explosive et une endurance d''élite.", "ar": "قم ببناء قوة انفجارية، قدرة تحمل عالية، وصلابة ذهنية لا تنكسر."}', '{"en": "High-intensity interval training combined with Olympic weightlifting.", "fr": "Entraînement par intervalles à haute intensité combiné à l''haltérophilie.", "ar": "تدريب عالي الكثافة مع رفع الأثقال الأولمبية."}', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Coaches Data
INSERT INTO coaches (id, name, role, image) VALUES 
(1, '{"en": "Coach Reda", "fr": "Coach Réda", "ar": "المدرب رضا"}', '{"en": "Black Belt BJJ & Head Grappling Coach", "fr": "Ceinture Noire BJJ & Chef Entraîneur Grappling", "ar": "حزام أسود جوجيتسو ومدرب مصارعة رئيسي"}', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop'),
(2, '{"en": "Coach Amine", "fr": "Coach Amine", "ar": "المدرب أمين"}', '{"en": "Striking & MMA Specialist", "fr": "Spécialiste Frappe & MMA", "ar": "أخصائي ضرب ومواي تاي"}', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'),
(3, '{"en": "Coach Sarah", "fr": "Coach Sarah", "ar": "المدربة سارة"}', '{"en": "CrossFit & Conditioning Lead", "fr": "Responsable CrossFit & Conditionnement", "ar": "قائدة فريق الكروس فيت واللياقة"}', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Schedule Data
INSERT INTO schedule (id, day, time, name, target) VALUES 
(1, 'Monday', '{"en": "18:00 - 19:30", "fr": "18:00 - 19:30", "ar": "18:00 - 19:30"}', '{"en": "MMA Advanced", "fr": "MMA Avancé", "ar": "فنون القتال المختلطة متقدم"}', '{"en": "Mixed", "fr": "Mixte", "ar": "مختلط"}'),
(2, 'Monday', '{"en": "19:30 - 21:00", "fr": "19:30 - 21:00", "ar": "19:30 - 21:00"}', '{"en": "BJJ Fundamentals", "fr": "BJJ Fondamentaux", "ar": "أساسيات الجوجيتسو"}', '{"en": "Mixed", "fr": "Mixte", "ar": "مختلط"}'),
(3, 'Monday', '{"en": "17:00 - 18:00", "fr": "17:00 - 18:00", "ar": "17:00 - 18:00"}', '{"en": "Women''s Kickboxing", "fr": "Kickboxing Femmes", "ar": "كيك بوكسينغ للسيدات"}', '{"en": "Women Only", "fr": "Femmes Uniquement", "ar": "للسيدات فقط"}'),
(4, 'Tuesday', '{"en": "18:00 - 19:30", "fr": "18:00 - 19:30", "ar": "18:00 - 19:30"}', '{"en": "Muay Thai Sparring", "fr": "Sparring Boxe Thaï", "ar": "مبارزة المواي تاي"}', '{"en": "Men", "fr": "Hommes", "ar": "للرجال"}'),
(5, 'Tuesday', '{"en": "19:30 - 20:30", "fr": "19:30 - 20:30", "ar": "19:30 - 20:30"}', '{"en": "Women''s CrossFit", "fr": "CrossFit Femmes", "ar": "كروس فيت للسيدات"}', '{"en": "Women Only", "fr": "Femmes Uniquement", "ar": "للسيدات فقط"}'),
(6, 'Wednesday', '{"en": "18:00 - 19:30", "fr": "18:00 - 19:30", "ar": "18:00 - 19:30"}', '{"en": "No-Gi Grappling", "fr": "Grappling Sans-Gi", "ar": "مصارعة بدون بدلة"}', '{"en": "Mixed", "fr": "Mixte", "ar": "مختلط"}'),
(7, 'Thursday', '{"en": "18:00 - 19:30", "fr": "18:00 - 19:30", "ar": "18:00 - 19:30"}', '{"en": "MMA Fundamentals", "fr": "MMA Fondamentaux", "ar": "أساسيات فنون القتال المختلطة"}', '{"en": "Mixed", "fr": "Mixte", "ar": "مختلط"}'),
(8, 'Thursday', '{"en": "19:30 - 20:30", "fr": "19:30 - 20:30", "ar": "19:30 - 20:30"}', '{"en": "Women''s Lutte", "fr": "Lutte Femmes", "ar": "مصارعة للسيدات"}', '{"en": "Women Only", "fr": "Femmes Uniquement", "ar": "للسيدات فقط"}'),
(9, 'Friday', '{"en": "18:00 - 19:30", "fr": "18:00 - 19:30", "ar": "18:00 - 19:30"}', '{"en": "Open Mat", "fr": "Tapis Ouvert", "ar": "بساط مفتوح"}', '{"en": "Mixed", "fr": "Mixte", "ar": "مختلط"}'),
(10, 'Saturday', '{"en": "10:00 - 12:00", "fr": "10:00 - 12:00", "ar": "10:00 - 12:00"}', '{"en": "Competition Prep", "fr": "Prépa Compétition", "ar": "تحضير للمنافسات"}', '{"en": "Invite Only", "fr": "Sur Invitation", "ar": "للمدعوين فقط"}')
ON CONFLICT (id) DO NOTHING;

-- App State Data (Singleton)
INSERT INTO app_state (id, header_state, footer_state, section_titles) VALUES 
(1, 
 '{"isAnnouncementActive": true, "announcementText": {"ar": "🔥 عرض لفترة محدودة: انضم الآن واحصل على شهرك الأول مجاناً! 🔥", "en": "🔥 Limited Time Offer: Join now and get your first month FREE! 🔥", "fr": "🔥 Offre Limitée : Rejoignez maintenant et obtenez votre premier mois GRATUIT ! 🔥"}, "heroHeadline": {"ar": "حيث يُصنع الأبطال", "en": "Where Champions Are Forged", "fr": "Où se Forgent les Champions"}, "heroSubtitle": {"ar": "تدرب مع الأفضل. تخطى حدودك. سيطر على الحلبة.", "en": "Train with the best. Push your limits. Dominate the mats.", "fr": "Entraînez-vous avec les meilleurs. Repoussez vos limites. Dominez le tatami."}, "heroMediaType": "video", "heroMediaUrl": "https://cdn.pixabay.com/video/2019/08/25/26359-356133912_large.mp4"}',
 '{"address": {"ar": "123 الشارع الرئيسي، الجزائر العاصمة، الجزائر", "en": "123 Main Street, Algiers, Algeria", "fr": "123 Rue Principale, Alger, Algérie"}, "phone": "0661234567", "tiktokUrl": "https://tiktok.com", "facebookUrl": "https://facebook.com", "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102344.20078864771!2d3.0560293!3d36.7118129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad1f44e1e827%3A0xcb13e155bc812044!2sAlgiers!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz", "instagramUrl": "https://instagram.com"}',
 '{"programs": {"ar": "تخصصاتنا القتالية", "en": "Our Combat Disciplines", "fr": "Nos Disciplines de Combat"}, "schedule": {"ar": "جدول التدريب الأسبوعي", "en": "Weekly Training Schedule", "fr": "Programme d''Entraînement Hebdomadaire"}, "coaches": {"ar": "تعرف على مدربينا النخبة", "en": "Meet Our Elite Coaches", "fr": "Rencontrez Nos Coachs d''Élite"}, "pricing": {"ar": "خطط الاشتراك", "en": "Membership Plans", "fr": "Forfaits d''Abonnement"}}'
)
ON CONFLICT (id) DO NOTHING;

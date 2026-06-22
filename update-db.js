const fs = require('fs');
const path = './src/data/db.json';

const db = JSON.parse(fs.readFileSync(path, 'utf8'));

db.sectionTitles = {
  programs: { en: "Our Combat Disciplines", fr: "Nos Disciplines de Combat", ar: "تخصصاتنا القتالية" },
  schedule: { en: "Weekly Training Schedule", fr: "Programme d'Entraînement Hebdomadaire", ar: "جدول التدريب الأسبوعي" },
  coaches: { en: "Meet Our Elite Coaches", fr: "Rencontrez Nos Coachs d'Élite", ar: "تعرف على مدربينا النخبة" },
  pricing: { en: "Membership Plans", fr: "Forfaits d'Abonnement", ar: "خطط الاشتراك" }
};

db.schedule = [
  { id: 1, day: "Monday", time: { en: "18:00 - 19:30", fr: "18:00 - 19:30", ar: "18:00 - 19:30" }, name: { en: "MMA Advanced", fr: "MMA Avancé", ar: "فنون القتال المختلطة متقدم" }, target: { en: "Mixed", fr: "Mixte", ar: "مختلط" } },
  { id: 2, day: "Monday", time: { en: "19:30 - 21:00", fr: "19:30 - 21:00", ar: "19:30 - 21:00" }, name: { en: "BJJ Fundamentals", fr: "BJJ Fondamentaux", ar: "أساسيات الجوجيتسو" }, target: { en: "Mixed", fr: "Mixte", ar: "مختلط" } },
  { id: 3, day: "Monday", time: { en: "17:00 - 18:00", fr: "17:00 - 18:00", ar: "17:00 - 18:00" }, name: { en: "Women's Kickboxing", fr: "Kickboxing Femmes", ar: "كيك بوكسينغ للسيدات" }, target: { en: "Women Only", fr: "Femmes Uniquement", ar: "للسيدات فقط" } },
  { id: 4, day: "Tuesday", time: { en: "18:00 - 19:30", fr: "18:00 - 19:30", ar: "18:00 - 19:30" }, name: { en: "Muay Thai Sparring", fr: "Sparring Boxe Thaï", ar: "مبارزة المواي تاي" }, target: { en: "Men", fr: "Hommes", ar: "للرجال" } },
  { id: 5, day: "Tuesday", time: { en: "19:30 - 20:30", fr: "19:30 - 20:30", ar: "19:30 - 20:30" }, name: { en: "Women's CrossFit", fr: "CrossFit Femmes", ar: "كروس فيت للسيدات" }, target: { en: "Women Only", fr: "Femmes Uniquement", ar: "للسيدات فقط" } },
  { id: 6, day: "Wednesday", time: { en: "18:00 - 19:30", fr: "18:00 - 19:30", ar: "18:00 - 19:30" }, name: { en: "No-Gi Grappling", fr: "Grappling Sans-Gi", ar: "مصارعة بدون بدلة" }, target: { en: "Mixed", fr: "Mixte", ar: "مختلط" } },
  { id: 7, day: "Thursday", time: { en: "18:00 - 19:30", fr: "18:00 - 19:30", ar: "18:00 - 19:30" }, name: { en: "MMA Fundamentals", fr: "MMA Fondamentaux", ar: "أساسيات فنون القتال المختلطة" }, target: { en: "Mixed", fr: "Mixte", ar: "مختلط" } },
  { id: 8, day: "Thursday", time: { en: "19:30 - 20:30", fr: "19:30 - 20:30", ar: "19:30 - 20:30" }, name: { en: "Women's Lutte", fr: "Lutte Femmes", ar: "مصارعة للسيدات" }, target: { en: "Women Only", fr: "Femmes Uniquement", ar: "للسيدات فقط" } },
  { id: 9, day: "Friday", time: { en: "18:00 - 19:30", fr: "18:00 - 19:30", ar: "18:00 - 19:30" }, name: { en: "Open Mat", fr: "Tapis Ouvert", ar: "بساط مفتوح" }, target: { en: "Mixed", fr: "Mixte", ar: "مختلط" } },
  { id: 10, day: "Saturday", time: { en: "10:00 - 12:00", fr: "10:00 - 12:00", ar: "10:00 - 12:00" }, name: { en: "Competition Prep", fr: "Prépa Compétition", ar: "تحضير للمنافسات" }, target: { en: "Invite Only", fr: "Sur Invitation", ar: "للمدعوين فقط" } },
];

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log("DB updated!");

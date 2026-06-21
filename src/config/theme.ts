export const themeConfig = {
  isAnnouncementActive: true,
  announcementText: "🔥 Limited Time Offer: Join now and get your first month FREE! 🔥",
  primaryColor: "red", // e.g. 'red', 'orange', 'emerald', 'blue'
  heroHeadline: "Where Champions Are Forged",
  heroSubtitle: "Train with the best. Push your limits. Dominate the mats.",
};

// Helper to map color strings to Tailwind classes
export const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; hoverBg: string; text: string; bgSoft: string }> = {
    red: { bg: "bg-red-600", hoverBg: "hover:bg-red-700", text: "text-red-500", bgSoft: "bg-red-500/10" },
    orange: { bg: "bg-orange-600", hoverBg: "hover:bg-orange-700", text: "text-orange-500", bgSoft: "bg-orange-500/10" },
    emerald: { bg: "bg-emerald-600", hoverBg: "hover:bg-emerald-700", text: "text-emerald-500", bgSoft: "bg-emerald-500/10" },
    blue: { bg: "bg-blue-600", hoverBg: "hover:bg-blue-700", text: "text-blue-500", bgSoft: "bg-blue-500/10" },
  };
  return colorMap[color] || colorMap["red"];
};

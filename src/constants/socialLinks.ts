/**
 * Official Brand Social Links & Support Desk Contact Information
 * ALEXFITNESSHUB Single Source of Truth
 */

export const BRAND_CONTACTS = {
  username: "alexfitnesshub",
  email: "alexfitnesshub@gmail.com",
  whatsapp: {
    raw: "2349015798601",
    formatted: "+2349015798601",
    display: "+234 901 579 8601",
    url: "https://wa.me/2349015798601",
    supportUrl: "https://wa.me/2349015798601?text=Hello%20Coach%20Alex,%20I%20am%20reaching%20out%20from%20ALEXFITNESSHUB%20platform%20support.",
    orderTrackingUrl: (orderNumber: string) => `https://wa.me/2349015798601?text=Hello%20Coach%20Alex,%20I%20just%20placed%20order%20%23${orderNumber}%20on%20the%20ALEXFITNESSHUB%20Store!`
  },
  socials: [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@alexfitnesshub",
      url: "https://www.instagram.com/alexfitnesshub",
      color: "hover:text-pink-500 hover:bg-pink-500/10"
    },
    {
      id: "threads",
      name: "Threads",
      handle: "@alexfitnesshub",
      url: "https://www.threads.net/@alexfitnesshub",
      color: "hover:text-slate-100 hover:bg-slate-800"
    },
    {
      id: "x",
      name: "X (Twitter)",
      handle: "@alexfitnesshub",
      url: "https://x.com/alexfitnesshub",
      color: "hover:text-slate-100 hover:bg-slate-800"
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@alexfitnesshub",
      url: "https://www.tiktok.com/@alexfitnesshub",
      color: "hover:text-cyan-400 hover:bg-cyan-500/10"
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "alexfitnesshub",
      url: "https://www.facebook.com/alexfitnesshub",
      color: "hover:text-blue-500 hover:bg-blue-500/10"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      handle: "+234 901 579 8601",
      url: "https://wa.me/2349015798601",
      color: "hover:text-emerald-500 hover:bg-emerald-500/10"
    }
  ]
};

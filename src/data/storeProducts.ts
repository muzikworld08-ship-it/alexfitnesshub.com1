import { Product } from "../types";

export const INITIAL_STORE_PRODUCTS: Product[] = [
  // --- MEN'S APPAREL ---
  {
    id: "afh-men-pro-tee",
    name: "ALEXFITNESSHUB Pro-Mesh Performance Tee",
    description: "Engineered for intense training sessions. Crafted with moisture-wicking micro-perforated aeromesh fabric that keeps you cool under high loads. Features ergonomic raglan sleeves for unrestricted compound movement.",
    category: "Men",
    price: 18500,
    originalPrice: 22000,
    frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx Black", hex: "#111827" },
      { name: "Crimson Red", hex: "#E53935" },
      { name: "Steel Grey", hex: "#4B5563" }
    ],
    stock: 45,
    sizeStock: { S: 8, M: 15, L: 12, XL: 7, XXL: 3 },
    sizeGuide: {
      chest: 'S: 36-38" | M: 39-41" | L: 42-44" | XL: 45-47" | XXL: 48-50"',
      length: 'S: 27" | M: 28" | L: 29" | XL: 30" | XXL: 31"',
      fitType: "Athletic Tapered",
      notes: "Athletic taper around chest and arms with relaxed drape across midsection. Order your regular size or size up for a relaxed fit."
    },
    fabric: "88% Breathable Poly-Mesh, 12% Spandex (4-Way Stretch)",
    features: [
      "Quick-dry moisture management",
      "Anti-odor antimicrobial treatment",
      "Reinforced flatlock stitching prevents friction chaffing",
      "Reflective ALEXFITNESSHUB silicone chest branding"
    ],
    featured: true,
    isNewArrival: false,
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: "afh-men-pump-hoodie",
    name: "ALEXFITNESSHUB Heavyweight Oversized Pump Cover",
    description: "The definitive gym warm-up hoodie. Built from premium 460GSM brushed loopback cotton fleece. Cut generously with dropped shoulders for warming up before heavy sets and casual off-duty athlete style.",
    category: "Men",
    price: 34500,
    originalPrice: 40000,
    frontImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Vintage Charcoal", hex: "#1F2937" },
      { name: "Bloodline Red", hex: "#B91C1C" },
      { name: "Bone Cream", hex: "#F3F4F6" }
    ],
    stock: 28,
    sizeStock: { M: 8, L: 10, XL: 6, XXL: 4 },
    sizeGuide: {
      chest: 'M: 42-44" | L: 45-47" | XL: 48-50" | XXL: 51-53"',
      length: 'M: 29" | L: 30" | XL: 31" | XXL: 32"',
      fitType: "Oversized Fit",
      notes: "Intentionally oversized drop-shoulder cut. Size down if you prefer a standard tailored fit."
    },
    fabric: "100% Heavyweight Organic French Terry Cotton (460 GSM)",
    features: [
      "Double-lined generous structured hood",
      "Kangaroo front pouch with concealed zip headphone slot",
      "Preshrunk heavy ribbing at cuffs and hem",
      "High-density tonal embroidered chest crest"
    ],
    featured: true,
    isNewArrival: true,
    badge: "New Release",
    rating: 5.0,
    reviewsCount: 64
  },
  {
    id: "afh-men-2in1-shorts",
    name: "ALEXFITNESSHUB Kinetic 2-in-1 Compression Shorts",
    description: "Engineered for explosive lower-body performance. Outer lightweight shell combined with an inner 4-way compression liner that stabilizes quadriceps, prevents groin chafing, and holds your phone bounce-free.",
    category: "Men",
    price: 21000,
    originalPrice: 25000,
    frontImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Matte Black", hex: "#0F172A" },
      { name: "Gunmetal Grey", hex: "#374151" },
      { name: "Olive Green", hex: "#3F6212" }
    ],
    stock: 35,
    sizeStock: { S: 6, M: 12, L: 10, XL: 5, XXL: 2 },
    sizeGuide: {
      waist: 'S: 29-31" | M: 32-34" | L: 35-37" | XL: 38-40" | XXL: 41-43"',
      inseam: '5.5" Shell / 7.5" Inner Compression Liner',
      fitType: "Athletic Tapered",
      notes: "Elasticated jacquard waistband with interior drawcord. True to size."
    },
    fabric: "Shell: 90% Hydrophobic Ripstop Nylon | Liner: 82% Polyester, 18% Elastane",
    features: [
      "Deep inner compression pocket secures 6.7\" smartphones",
      "Rear zipped card & key waterproof pocket",
      "Side shirt / towel loop on waistband",
      "Laser-cut side vents for maximal air cooling"
    ],
    featured: false,
    isNewArrival: false,
    badge: "Athletic Choice",
    rating: 4.8,
    reviewsCount: 92
  },
  {
    id: "afh-men-prime-stringer",
    name: "ALEXFITNESSHUB Prime Ribbed Tank Stringer",
    description: "A classic bodybuilding silhouette calibrated for peak shoulder and back visibility. Deep armholes, Y-back aesthetic, and contour ribbing emphasize the V-taper frame during heavy lifts.",
    category: "Men",
    price: 14500,
    originalPrice: 17500,
    frontImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&auto=format&fit=crop&q=80",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Stealth Black", hex: "#111827" },
      { name: "Chalk White", hex: "#F9FAFB" },
      { name: "Crimson Red", hex: "#DC2626" }
    ],
    stock: 40,
    sizeStock: { S: 10, M: 15, L: 10, XL: 5 },
    sizeGuide: {
      chest: 'S: 36-38" | M: 39-41" | L: 42-44" | XL: 45-47"',
      length: 'S: 28" | M: 29" | L: 30" | XL: 31"',
      fitType: "True to Size",
      notes: "Tapered torso with curved bottom hem for a modern physique silhouette."
    },
    fabric: "95% Combed Cotton, 5% Elastane Micro-Rib",
    features: [
      "Deep Y-back cut for scapular freedom during pulling movements",
      "Curved scalloped hem line",
      "Silicone heat-press front badge"
    ],
    featured: false,
    isNewArrival: false,
    rating: 4.7,
    reviewsCount: 43
  },

  // --- WOMEN'S APPAREL ---
  {
    id: "afh-women-contour-leggings",
    name: "ALEXFITNESSHUB Seamless Contour High-Waist Leggings",
    description: "Engineered to flatter and sculpt. 100% squat-proof seamless circular knit technology with ribbed compressive high-waist band for tummy support and subtle glute contouring textures.",
    category: "Women",
    price: 24500,
    originalPrice: 29000,
    frontImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Crimson Red", hex: "#DC2626" },
      { name: "Midnight Black", hex: "#0F172A" },
      { name: "Slate Teal", hex: "#0F766E" },
      { name: "Dusty Plum", hex: "#701A75" }
    ],
    stock: 50,
    sizeStock: { XS: 8, S: 15, M: 16, L: 8, XL: 3 },
    sizeGuide: {
      waist: 'XS: 23-25" | S: 26-28" | M: 29-31" | L: 32-34" | XL: 35-37"',
      hips: 'XS: 33-35" | S: 36-38" | M: 39-41" | L: 42-44" | XL: 45-47"',
      inseam: '25" Full Ankle Length',
      fitType: "Compression",
      notes: "Second-skin compression. True to size, high elasticity accommodates all body shapes."
    },
    fabric: "78% Microfiber Polyamide, 22% Lycra Elastane",
    features: [
      "100% Non-Sheer, Tested Squat-Proof Density",
      "Wide high-compression band eliminates rolling down during sprints or squats",
      "Graduated contour shading lifts and defines natural silhouette",
      "Moisture-wicking, breathable & fast-drying knit"
    ],
    featured: true,
    isNewArrival: false,
    badge: "Top Rated",
    rating: 4.9,
    reviewsCount: 184
  },
  {
    id: "afh-women-racerback-bra",
    name: "ALEXFITNESSHUB High-Impact Racerback Sports Bra",
    description: "Maximum stability for high-intensity training, jump rope, and heavy lifting. Features a supportive wide underband, breathable mesh back panel, and removable contoured push-up padding.",
    category: "Women",
    price: 16500,
    originalPrice: 19500,
    frontImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Crimson Red", hex: "#DC2626" },
      { name: "Midnight Black", hex: "#0F172A" },
      { name: "Sage Mist", hex: "#047857" }
    ],
    stock: 38,
    sizeStock: { XS: 6, S: 14, M: 12, L: 6 },
    sizeGuide: {
      chest: 'XS: 30A-32A | S: 32B-34B | M: 34C-36C | L: 36D-38D',
      fitType: "Compression",
      notes: "Medium-to-High impact support. Includes removable cups."
    },
    fabric: "75% Nylon, 25% Spandex Brushed Softtouch",
    features: [
      "Zero bounce high-compression chest stabilization",
      "Sweat-venting mesh rear spinal cutout",
      "Non-digging wide plush elastic bottom hem",
      "Matches perfectly with the Seamless Contour Leggings"
    ],
    featured: true,
    isNewArrival: false,
    badge: "Essential",
    rating: 4.8,
    reviewsCount: 110
  },
  {
    id: "afh-women-crop-longsleeve",
    name: "ALEXFITNESSHUB Sculpt Cropped Seamless Long Sleeve",
    description: "The ultimate cold-morning training top. Designed with ergonomic thumbholes, breathable underarm ventilation mesh, and a form-flattering cropped silhouette that pairs effortlessly with high-waisted bottoms.",
    category: "Women",
    price: 19500,
    originalPrice: 23000,
    frontImage: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=900&auto=format&fit=crop&q=80",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Midnight Black", hex: "#111827" },
      { name: "Desert Sand", hex: "#D97706" },
      { name: "Rose Quartz", hex: "#BE185D" }
    ],
    stock: 30,
    sizeStock: { XS: 6, S: 10, M: 10, L: 4 },
    sizeGuide: {
      chest: 'XS: 30-32" | S: 33-35" | M: 36-38" | L: 39-41"',
      length: 'XS: 15" | S: 15.5" | M: 16" | L: 16.5"',
      fitType: "Athletic Tapered",
      notes: "Cropped to sit right above the high-waisted waistband."
    },
    fabric: "85% Seamless Polyamide, 15% Elastane",
    features: [
      "Integrated thumbholes keep sleeves locked in place during burpees and pulls",
      "Graduated raglan compression sleeves",
      "Sweat-wicking ventilation point knit"
    ],
    featured: false,
    isNewArrival: true,
    badge: "Trending",
    rating: 4.9,
    reviewsCount: 75
  },
  {
    id: "afh-women-biker-shorts",
    name: "ALEXFITNESSHUB Sculpt 6\" Contour Biker Shorts",
    description: "Versatile, squat-proof 6-inch compression shorts tailored for warm weather conditioning, cycling, and weight training. Does not ride up or pinch thighs.",
    category: "Women",
    price: 17500,
    originalPrice: 21000,
    frontImage: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&auto=format&fit=crop&q=80",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Jet Black", hex: "#0F172A" },
      { name: "Crimson Red", hex: "#DC2626" },
      { name: "Espresso Brown", hex: "#451A03" }
    ],
    stock: 32,
    sizeStock: { XS: 5, S: 11, M: 11, L: 5 },
    sizeGuide: {
      waist: 'XS: 23-25" | S: 26-28" | M: 29-31" | L: 32-34"',
      hips: 'XS: 33-35" | S: 36-38" | M: 39-41" | L: 42-44"',
      inseam: '6" Mid-Thigh Drop',
      fitType: "Compression",
      notes: "Seamless leg opening prevents thigh digging."
    },
    fabric: "80% Recycled Nylon, 20% Spandex",
    features: [
      "6-inch mid-thigh length provides anti-chafing comfort",
      "Seamless front rise with no camel toe seams",
      "Subtle glute ruching accents"
    ],
    featured: false,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 52
  },

  // --- ALEXFITNESSHUB COLLECTIONS ---
  {
    id: "afh-col-empowered-hoodie",
    name: "ALEXFITNESSHUB 'EMPOWERED BY IRON' Collector's Hoodie",
    description: "The flagship piece of the ALEXFITNESSHUB aesthetic. Built with heavyweight brushed cotton, boasting our signature high-density front emblem and bold 'EMPOWERED BY IRON // UNLEASH YOUR PRIME' back typography.",
    category: "ALEXFITNESSHUB Collections",
    price: 38500,
    originalPrice: 45000,
    frontImage: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Iconic Crimson & Black", hex: "#991B1B" },
      { name: "Stealth Blackout", hex: "#0F172A" }
    ],
    stock: 25,
    sizeStock: { S: 3, M: 8, L: 8, XL: 4, XXL: 2 },
    sizeGuide: {
      chest: 'S: 38-40" | M: 41-43" | L: 44-46" | XL: 47-49" | XXL: 50-52"',
      length: 'S: 28" | M: 29" | L: 30" | XL: 31" | XXL: 32"',
      fitType: "Oversized Fit",
      notes: "Pre-shrunk heavyweight cotton fleece. Built to withstand hundreds of gym sessions and washes without cracking."
    },
    fabric: "100% Ring-Spun Premium French Terry Cotton (480 GSM)",
    features: [
      "Signature high-density rubberized 3D chest logo",
      "Full graphic back print with motivational typography",
      "Metal aglets with embossed ALEXFITNESSHUB details",
      "Limited edition release certificate tag"
    ],
    featured: true,
    isNewArrival: true,
    badge: "Signature Series",
    rating: 5.0,
    reviewsCount: 96
  },
  {
    id: "afh-col-180-finisher-tee",
    name: "ALEXFITNESSHUB 180-Day Challenge Finisher Heavy Tee",
    description: "Honor the grind. Designed for athletes participating in or completing the 180 Home Workout program. Features a minimalist front crest and full 180-Day Milestone graphic blueprint across the upper back.",
    category: "ALEXFITNESSHUB Collections",
    price: 22000,
    originalPrice: 26000,
    frontImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Vintage Black", hex: "#18181B" },
      { name: "Chalk White", hex: "#FAFAFA" }
    ],
    stock: 35,
    sizeStock: { S: 5, M: 12, L: 10, XL: 6, XXL: 2 },
    sizeGuide: {
      chest: 'S: 38-40" | M: 41-43" | L: 44-46" | XL: 47-49" | XXL: 50-52"',
      length: 'S: 28.5" | M: 29.5" | L: 30.5" | XL: 31.5" | XXL: 32.5"',
      fitType: "Athletic Tapered",
      notes: "Slightly dropped shoulder with tailored arms that hug the bicep."
    },
    fabric: "100% Combed Heavy Cotton (260 GSM)",
    features: [
      "Custom 180-Day challenge commemorative blueprint graphic",
      "Thick 1\" ribbed collar that keeps its shape",
      "Double-stitched reinforced hem"
    ],
    featured: true,
    isNewArrival: false,
    badge: "Official Program Gear",
    rating: 4.9,
    reviewsCount: 82
  },
  {
    id: "afh-col-athlete-duffel",
    name: "ALEXFITNESSHUB Pro Athlete Gym Duffel & Shaker Bundle",
    description: "The complete gym day solution. Water-resistant 45L duffel bag equipped with isolated shoe ventilation compartment, wet/dry separation pocket, padded laptop sleeve, and includes the ALEXFITNESSHUB Stainless Steel Shaker.",
    category: "ALEXFITNESSHUB Collections",
    price: 32000,
    originalPrice: 38000,
    frontImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=900&auto=format&fit=crop&q=80",
    sizes: ["One Size (45L)"],
    colors: [
      { name: "Tactical Matte Black", hex: "#111827" }
    ],
    stock: 20,
    sizeStock: { "One Size (45L)": 20 },
    sizeGuide: {
      length: 'Dimensions: 54cm x 28cm x 26cm',
      notes: "Meets carry-on airline requirements. Fits lifting belt, two pairs of shoes, gym clothes, towels, and pre-workout bottles."
    },
    fabric: "1000D Cordura Ballistic Waterproof Nylon",
    features: [
      "Dedicated ventilated shoe tunnel fits up to US Size 14 sneakers",
      "Bonus 750ml double-wall vacuum insulated Stainless Steel Shaker included",
      "Padded air-mesh shoulder strap with heavy metal carabiners",
      "Luggage trolley strap for travel"
    ],
    featured: false,
    isNewArrival: true,
    badge: "Gear Pack",
    rating: 5.0,
    reviewsCount: 47
  },
  {
    id: "afh-col-performance-cap",
    name: "ALEXFITNESSHUB Hydro-Vent Dad Cap & Wristband Set",
    description: "Structured low-profile athletic hat with sweat-wicking headband and laser-cut breathable side perforations. Comes packaged with matching dual terrycloth absorbent wristbands.",
    category: "ALEXFITNESSHUB Collections",
    price: 12500,
    originalPrice: 15000,
    frontImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80",
    backImage: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=900&auto=format&fit=crop&q=80",
    sizes: ["Adjustable Snapback"],
    colors: [
      { name: "Stealth Black", hex: "#111827" },
      { name: "Crimson Red", hex: "#DC2626" }
    ],
    stock: 45,
    sizeStock: { "Adjustable Snapback": 45 },
    sizeGuide: {
      notes: "One size fits all. Adjustable strap at back."
    },
    fabric: "Water-repellent Performance Poly-Spandex Blend",
    features: [
      "Laser-perforated side cooling panels",
      "Absorbent internal anti-sweat terry band",
      "Includes 2x matching heavyweight wrist sweatbands"
    ],
    featured: false,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 39
  }
];

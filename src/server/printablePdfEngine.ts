import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import sharp from "sharp";
import { PrintablePdfProduct, PrintablePdfOrder } from "../types/printablePdf";

const DATA_DIR = path.join(process.cwd(), "data");
const MASTERS_DIR = path.join(DATA_DIR, "pdf_masters");
const PHOTOS_DIR = path.join(DATA_DIR, "pdf_photos");
const GENERATED_DIR = path.join(DATA_DIR, "pdf_generated");
const CATALOG_FILE = path.join(DATA_DIR, "pdf_catalog.json");
const ORDERS_FILE = path.join(DATA_DIR, "pdf_orders.json");

export function ensurePdfDirectories() {
  [DATA_DIR, MASTERS_DIR, PHOTOS_DIR, GENERATED_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 5 Core Seed Products as instructed in prompt
export const INITIAL_PDF_PRODUCTS: PrintablePdfProduct[] = [
  {
    id: "afh-journal-weight-loss",
    title: "ALEXFITNESSHUB Weight Loss Journal",
    shortDescription: "Daily transformation tracker, habit checklist, caloric deficit planner, and milestone journal.",
    fullDescription: "Engineered specifically for athletes striving for sustainable fat reduction, this comprehensive journal provides structured daily tracking sheets, body measurement grids, weekly reflection reviews, and positive habit reinforcement prompts. Includes official AlexFitnessHub cover personalization with your fitness photo.",
    benefits: [
      "Structured 68-day physical & habit tracking sheets",
      "Caloric deficit and metabolic expenditure calculator matrix",
      "Bi-weekly body measurement & weigh-in logs",
      "Official personalized athlete cover dedication",
      "Printable on A4/US Letter & tablet compatible"
    ],
    priceNGN: 5500,
    originalPriceNGN: 8000,
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80",
    pageCount: 68,
    category: "Journal",
    requiresPersonalization: true,
    personalizationConfig: {
      page: 1,
      x: 180,
      y: 280,
      width: 250,
      height: 300,
      borderRadius: 8
    },
    previewPages: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    salesCount: 142,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "afh-planner-gym-energy",
    title: "ALEXFITNESSHUB Gym Energy Meal Planner",
    shortDescription: "Pre-workout fueling protocols, macro-balanced recipes, hydration matrix & energy logs.",
    fullDescription: "Eliminate guesswork from your nutritional timing. Features localized African and international whole food guides, high-protein recipes, meal prep worksheets, and energy calibration timetables to maximize gym performance.",
    benefits: [
      "Pre & Post workout nutrient timing timetable",
      "Over 40 high-protein energy recipes with Nigerian whole foods",
      "Weekly grocery shopping matrix & budget planner",
      "Electrolyte & intracellular hydration formula",
      "Instant high-res printable PDF delivery"
    ],
    priceNGN: 4500,
    originalPriceNGN: 6500,
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&auto=format&fit=crop&q=80",
    pageCount: 52,
    category: "Meal Planner",
    requiresPersonalization: false,
    previewPages: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    salesCount: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "afh-guide-stamina-nutrition",
    title: "ALEXFITNESSHUB Stamina Nutrition Guide",
    shortDescription: "Cardiovascular endurance dietary blueprints, electrolyte balance & recovery protocols.",
    fullDescription: "Formulated for high-output runners, cross-training athletes, and endurance seekers. Includes meal timing strategies, micronutrient optimization, anti-inflammatory recovery drinks, and carb-cycling principles.",
    benefits: [
      "Cardiovascular glycogen storage protocols",
      "Cramp prevention & electrolyte balance charts",
      "Anti-inflammatory recovery smoothy formulas",
      "Endurance run fuel timing strategy (3KM - 21KM)",
      "Printable high-contrast worksheets"
    ],
    priceNGN: 4800,
    originalPriceNGN: 7000,
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&auto=format&fit=crop&q=80",
    pageCount: 46,
    category: "Nutrition",
    requiresPersonalization: false,
    previewPages: [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    salesCount: 76,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "afh-tracker-workout-pro",
    title: "ALEXFITNESSHUB Workout Tracker",
    shortDescription: "Detailed exercise logsheets, progressive overload tables, 1RM calculators & rest timers.",
    fullDescription: "Keep track of every set, rep, RPE, and poundage. Designed to be printed weekly or kept on a tablet for relentless gym session accountability and strength progression across all major movement patterns.",
    benefits: [
      "Progressive overload log tables for 12 weeks",
      "Warmup sets vs working sets tracking matrix",
      "1-Rep Max estimation formula charts",
      "Personalized athlete profile badge on cover",
      "Clean high-contrast printable black & white pages"
    ],
    priceNGN: 3900,
    originalPriceNGN: 5500,
    coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    pageCount: 60,
    category: "Workout",
    requiresPersonalization: true,
    personalizationConfig: {
      page: 1,
      x: 180,
      y: 280,
      width: 250,
      height: 300,
      borderRadius: 8
    },
    previewPages: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    salesCount: 165,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "afh-journal-fitness-progress",
    title: "ALEXFITNESSHUB Fitness Progress Journal",
    shortDescription: "Comprehensive 90-day physical and mental accountability workbook.",
    fullDescription: "Combines biometric weekly weigh-ins, physique photo grids, mental mindset checkpoints, workout consistency graphs, and coach Alex's peak performance principles into a structured 90-day printable workbook.",
    benefits: [
      "90-Day daily physical and mindset accountability pages",
      "Weekly biometric circumference & weight curves",
      "Coach Alex's mindset and motivation principles",
      "Personalized athlete transformation cover",
      "Printable binder format with margins"
    ],
    priceNGN: 6000,
    originalPriceNGN: 9000,
    coverImage: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900&auto=format&fit=crop&q=80",
    pageCount: 90,
    category: "Journal",
    requiresPersonalization: true,
    personalizationConfig: {
      page: 1,
      x: 180,
      y: 280,
      width: 250,
      height: 300,
      borderRadius: 8
    },
    previewPages: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    salesCount: 210,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Read/write catalog
export function getPdfProducts(): PrintablePdfProduct[] {
  ensurePdfDirectories();
  if (fs.existsSync(CATALOG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf-8"));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn("[PDF Catalog] Error reading JSON catalog:", e);
    }
  }
  // Initialize with seed products
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(INITIAL_PDF_PRODUCTS, null, 2), "utf-8");
  return INITIAL_PDF_PRODUCTS;
}

export function savePdfProducts(products: PrintablePdfProduct[]) {
  ensurePdfDirectories();
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export function getPdfOrders(): PrintablePdfOrder[] {
  ensurePdfDirectories();
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn("[PDF Orders] Error reading JSON orders:", e);
    }
  }
  return [];
}

export function savePdfOrders(orders: PrintablePdfOrder[]) {
  ensurePdfDirectories();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function saveOrUpdateOrder(order: PrintablePdfOrder) {
  const list = getPdfOrders();
  const idx = list.findIndex((o) => o.id === order.id || o.paymentReference === order.paymentReference);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...order };
  } else {
    list.unshift(order);
  }
  savePdfOrders(list);
}

/**
 * Generates a clean, professional, high-resolution master template PDF using pdf-lib
 * if a custom master PDF was not manually uploaded by admin.
 */
export async function generateMasterPdfFallback(product: PrintablePdfProduct): Promise<Buffer> {
  ensurePdfDirectories();
  const masterPath = path.join(MASTERS_DIR, `${product.id}.pdf`);
  if (fs.existsSync(masterPath)) {
    return fs.readFileSync(masterPath);
  }

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Page 1: Official Cover Page (612 x 792 pt, Standard US Letter / A4 proportion)
  const page1 = pdfDoc.addPage([612, 792]);
  const { width, height } = page1.getSize();

  // Top Brand Header Banner
  page1.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.06, 0.09, 0.15) // Deep Slate Black #0f172a
  });

  page1.drawText("ALEXFITNESSHUB", {
    x: 50,
    y: height - 60,
    size: 26,
    font: fontBold,
    color: rgb(0.9, 0.15, 0.15) // Crimson Red #e53935
  });

  page1.drawText("OFFICIAL ATHLETE PRINTABLE WORKBOOK & PROTOCOL", {
    x: 50,
    y: height - 85,
    size: 10,
    font: fontRegular,
    color: rgb(0.9, 0.9, 0.95)
  });

  // Product Title
  page1.drawText(product.title.toUpperCase(), {
    x: 50,
    y: height - 170,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  page1.drawText(product.category.toUpperCase() + " EDITION • " + product.pageCount + " PAGES", {
    x: 50,
    y: height - 195,
    size: 11,
    font: fontBold,
    color: rgb(0.9, 0.15, 0.15)
  });

  // Photo Area Placeholder Frame (if personalization supported)
  if (product.requiresPersonalization && product.personalizationConfig) {
    const pX = product.personalizationConfig.x;
    const pY = product.personalizationConfig.y;
    const pW = product.personalizationConfig.width;
    const pH = product.personalizationConfig.height;

    page1.drawRectangle({
      x: pX,
      y: pY,
      width: pW,
      height: pH,
      borderColor: rgb(0.85, 0.2, 0.2),
      borderWidth: 2,
      color: rgb(0.97, 0.97, 0.99)
    });

    page1.drawText("ATHLETE PERSONALIZATION DEDICATION AREA", {
      x: pX + 20,
      y: pY + pH / 2,
      size: 9,
      font: fontBold,
      color: rgb(0.6, 0.6, 0.6)
    });
  }

  // Cover Benefits Summary
  let curY = 220;
  page1.drawText("INCLUDED IN THIS OFFICIAL EDITION:", {
    x: 50,
    y: curY,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  curY -= 20;
  (product.benefits || []).slice(0, 4).forEach((benefit) => {
    page1.drawText(`•  ${benefit}`, {
      x: 60,
      y: curY,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.3)
    });
    curY -= 18;
  });

  // Cover Footer
  page1.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 40,
    color: rgb(0.06, 0.09, 0.15)
  });

  page1.drawText("ALEXFITNESSHUB • WWW.ALEXFITNESSHUB.COM • ALL RIGHTS RESERVED", {
    x: 110,
    y: 15,
    size: 9,
    font: fontBold,
    color: rgb(0.7, 0.7, 0.8)
  });

  // Page 2: Table of Contents & Methodology
  const page2 = pdfDoc.addPage([612, 792]);
  page2.drawText("PROGRAM PHILOSOPHY & WORKBOOK INSTRUCTIONS", {
    x: 50,
    y: height - 60,
    size: 16,
    font: fontBold,
    color: rgb(0.9, 0.15, 0.15)
  });

  page2.drawText("Consistency is the primary driver of physical transformation. Use this journal daily.", {
    x: 50,
    y: height - 90,
    size: 11,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3)
  });

  // Table Grid Simulation on Page 2
  page2.drawRectangle({
    x: 50,
    y: 200,
    width: 512,
    height: 460,
    borderColor: rgb(0.8, 0.8, 0.85),
    borderWidth: 1,
    color: rgb(0.99, 0.99, 1.0)
  });

  page2.drawText("DAILY ATHLETIC METRIC CHECKLIST", {
    x: 70,
    y: 630,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  const sampleRows = [
    "Hydration Target (Minimum 3.5 Liters Water Daily)",
    "Caloric & Protein Intake Compliance Checkpoint",
    "Prescribed Resistance Training Sets & Progressive Overload Logs",
    "Resting Heart Rate & Morning Fasted Weigh-in",
    "Quality Sleep & Central Nervous System Recovery Target (7-8 Hours)",
    "Post-Workout Mobility & Muscle Fascia Care"
  ];

  let rY = 590;
  sampleRows.forEach((row, i) => {
    page2.drawText(`[  ]  Step ${i + 1}: ${row}`, {
      x: 70,
      y: rY,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.25)
    });
    rY -= 35;
  });

  // Page 3: Printable Daily Workout & Nutrition Matrix Log
  const page3 = pdfDoc.addPage([612, 792]);
  page3.drawText("DAILY DRILL & MEAL LOGGING SHEET", {
    x: 50,
    y: height - 60,
    size: 16,
    font: fontBold,
    color: rgb(0.9, 0.15, 0.15)
  });

  page3.drawText("Date: ____________________   Day of Week: [  ] M [  ] T [  ] W [  ] T [  ] F [  ] S [  ] S", {
    x: 50,
    y: height - 90,
    size: 10,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2)
  });

  // Grid of log lines
  for (let i = 0; i < 18; i++) {
    const lineY = height - 130 - (i * 32);
    page3.drawLine({
      start: { x: 50, y: lineY },
      end: { x: 562, y: lineY },
      thickness: 0.75,
      color: rgb(0.85, 0.85, 0.9)
    });
  }

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);
  fs.writeFileSync(masterPath, buffer);
  return buffer;
}

/**
 * Generates a personalized copy of the PDF template:
 * - Preserves original PDF text, layout, fonts, and dimensions.
 * - Embeds customer photo into the exact photoPage and bounding box coordinates.
 * - Handles JPG, PNG, and WEBP proportionally without stretching or distortion.
 * - Saves separate file for the individual order.
 */
export async function generatePersonalizedPdf(
  product: PrintablePdfProduct,
  order: PrintablePdfOrder
): Promise<string> {
  ensurePdfDirectories();

  // 1. Get Master PDF bytes
  let masterBytes: Buffer;
  let masterPath = product.masterPdfFilename
    ? path.join(MASTERS_DIR, product.masterPdfFilename)
    : path.join(MASTERS_DIR, `${product.id}.pdf`);

  if (fs.existsSync(masterPath)) {
    masterBytes = fs.readFileSync(masterPath);
  } else {
    masterBytes = await generateMasterPdfFallback(product);
  }

  // Load the master PDF into pdf-lib
  const pdfDoc = await PDFDocument.load(masterBytes);

  // If personalization required and customer photo exists
  if (product.requiresPersonalization && order.uploadedPhotoFilename) {
    const photoPath = path.join(PHOTOS_DIR, order.uploadedPhotoFilename);

    if (fs.existsSync(photoPath)) {
      const rawPhotoBuffer = fs.readFileSync(photoPath);

      let embeddedImage: any = null;
      try {
        const pngBuffer = await sharp(rawPhotoBuffer)
          .rotate() // auto-orient based on EXIF
          .png({ quality: 90 })
          .toBuffer();
        embeddedImage = await pdfDoc.embedPng(pngBuffer);
      } catch (sharpErr: any) {
        console.warn("[PDF Personalization] Sharp conversion fallback:", sharpErr?.message);
        try {
          if (rawPhotoBuffer[0] === 0xff && rawPhotoBuffer[1] === 0xd8) {
            embeddedImage = await pdfDoc.embedJpg(rawPhotoBuffer);
          } else {
            embeddedImage = await pdfDoc.embedPng(rawPhotoBuffer);
          }
        } catch (directErr: any) {
          console.warn("[PDF Personalization] Direct embed fallback:", directErr?.message);
          const cleanBuffer = await sharp({
            create: {
              width: 300,
              height: 300,
              channels: 4,
              background: { r: 229, g: 57, b: 53, alpha: 1 }
            }
          }).png().toBuffer();
          embeddedImage = await pdfDoc.embedPng(cleanBuffer);
        }
      }

      const imgWidth = embeddedImage.width;
      const imgHeight = embeddedImage.height;

      // Coordinate Config (Defaults to page 1)
      const config = product.personalizationConfig || {
        page: 1,
        x: 180,
        y: 280,
        width: 250,
        height: 300
      };

      const targetPageNum = Math.max(0, Math.min(pdfDoc.getPageCount() - 1, (config.page || 1) - 1));
      const targetPage = pdfDoc.getPage(targetPageNum);

      // Calculate proportional aspect ratio (no stretching!)
      const boxW = config.width || 250;
      const boxH = config.height || 300;
      const boxX = config.x || 180;
      const boxY = config.y || 280;

      const scale = Math.min(boxW / imgWidth, boxH / imgHeight);
      const drawW = imgWidth * scale;
      const drawH = imgHeight * scale;

      // Center within the bounding box
      const drawX = boxX + (boxW - drawW) / 2;
      const drawY = boxY + (boxH - drawH) / 2;

      // Clean decorative border box behind/around photo
      targetPage.drawRectangle({
        x: boxX - 3,
        y: boxY - 3,
        width: boxW + 6,
        height: boxH + 6,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.85, 0.2, 0.2),
        borderWidth: 2
      });

      // Draw the customer photo
      targetPage.drawImage(embeddedImage, {
        x: drawX,
        y: drawY,
        width: drawW,
        height: drawH
      });

      // Add personalized attribution text
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const customerLabel = order.customerName ? `${order.customerName} (${order.customerEmail})` : order.customerEmail;
      targetPage.drawText("ALEXFITNESSHUB ATHLETE DEDICATION EDITION", {
        x: boxX,
        y: boxY - 18,
        size: 9,
        font: fontBold,
        color: rgb(0.9, 0.15, 0.15)
      });

      targetPage.drawText(`Prepared for: ${customerLabel} • Order: ${order.orderNumber}`, {
        x: boxX,
        y: boxY - 30,
        size: 8,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3)
      });
    }
  }

  // Save personalized copy
  const cleanTitle = product.title.replace(/[^a-zA-Z0-9_-]/g, "_");
  const outputFilename = `${cleanTitle}-Order-${order.orderNumber}.pdf`;
  const outputPath = path.join(GENERATED_DIR, outputFilename);

  const finalPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, Buffer.from(finalPdfBytes));

  return outputFilename;
}

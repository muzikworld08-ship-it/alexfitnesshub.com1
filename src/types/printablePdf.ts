export interface PersonalizationConfig {
  page: number; // 1-indexed page number
  x: number; // PDF points (x position from left)
  y: number; // PDF points (y position from bottom)
  width: number; // width in points
  height: number; // height in points
  borderRadius?: number;
  label?: string;
}

export interface PrintablePdfProduct {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  priceNGN: number;
  originalPriceNGN?: number;
  coverImage: string;
  pageCount: number;
  category: "Journal" | "Meal Planner" | "Nutrition" | "Workout" | "Guides";
  requiresPersonalization: boolean;
  personalizationConfig?: PersonalizationConfig;
  previewPages: string[];
  masterPdfFilename?: string;
  isActive: boolean;
  salesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type PdfOrderStatus = "pending" | "paid" | "failed";
export type PdfGenerationStatus = "pending" | "processing" | "ready" | "failed";

export interface PrintablePdfOrder {
  id: string; // Order reference ID, e.g. ORD-AFH-PDF-XXXX
  orderNumber: string;
  productId: string;
  productTitle: string;
  customerEmail: string;
  customerName?: string;
  amountNGN: number;
  currency: "NGN";
  paymentReference: string;
  paymentStatus: PdfOrderStatus;
  personalizationRequired: boolean;
  uploadedPhotoUrl?: string;
  uploadedPhotoFilename?: string;
  generatedPdfFilename?: string;
  downloadToken: string;
  downloadCount: number;
  downloadExpiry?: string;
  pdfGenerationStatus: PdfGenerationStatus;
  generationError?: string;
  simulated?: boolean;
  createdAt: string;
  paidAt?: string;
}

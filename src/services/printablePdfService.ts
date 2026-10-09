import { PrintablePdfProduct, PrintablePdfOrder } from "../types/printablePdf";
import { db } from "../lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export interface InitializeOrderParams {
  productId: string;
  customerEmail: string;
  customerName?: string;
  photoBase64?: string;
  photoFilename?: string;
}

export interface InitializeOrderResponse {
  success: boolean;
  orderId: string;
  reference: string;
  authorization_url?: string;
  downloadToken?: string;
  simulated?: boolean;
  error?: string;
}

export interface VerifyOrderResponse {
  success: boolean;
  order?: PrintablePdfOrder;
  downloadToken?: string;
  message?: string;
  error?: string;
}

const DELETED_PDF_STORAGE_KEY = "afh_deleted_pdf_product_ids";
const STORE_DELETED_KEY = "afh_permanently_deleted_product_ids";

export function getClientDeletedPdfIds(): Set<string> {
  const merged = new Set<string>();
  try {
    const raw = localStorage.getItem(DELETED_PDF_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) arr.forEach((id: string) => merged.add(id));
    }
  } catch {}
  try {
    const rawStore = localStorage.getItem(STORE_DELETED_KEY);
    if (rawStore) {
      const arr = JSON.parse(rawStore);
      if (Array.isArray(arr)) arr.forEach((id: string) => merged.add(id));
    }
  } catch {}
  return merged;
}

export function recordClientDeletedPdfId(id: string) {
  try {
    const set = getClientDeletedPdfIds();
    set.add(id);
    const arr = Array.from(set);
    localStorage.setItem(DELETED_PDF_STORAGE_KEY, JSON.stringify(arr));
    localStorage.setItem(STORE_DELETED_KEY, JSON.stringify(arr));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fit-pdf-catalog-changed"));
      window.dispatchEvent(new CustomEvent("fit-store-products-changed"));
    }
  } catch {}
}

class PrintablePdfService {
  private getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    try {
      const email = localStorage.getItem("fit_user_email") || localStorage.getItem("fit_saved_email") || "alexfitnesshub@gmail.com";
      headers["x-admin-email"] = email || "alexfitnesshub@gmail.com";
      const token = localStorage.getItem("fit_id_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {}
    return headers;
  }

  async getProducts(): Promise<PrintablePdfProduct[]> {
    try {
      const res = await fetch("/api/printable-pdfs");
      if (!res.ok) throw new Error("Failed to load PDF products");
      const data = await res.json();
      
      // If server returned deleted IDs, merge into client storage
      if (Array.isArray(data.deletedIds)) {
        data.deletedIds.forEach((id: string) => {
          if (id) recordClientDeletedPdfId(id);
        });
      }

      const deletedIds = getClientDeletedPdfIds();
      return (data.products || []).filter((p: PrintablePdfProduct) => !deletedIds.has(p.id) && !(p as any).isDeleted);
    } catch (err) {
      console.warn("[PrintablePdfService] getProducts error:", err);
      return [];
    }
  }

  async getProductById(id: string): Promise<PrintablePdfProduct | null> {
    try {
      const res = await fetch(`/api/printable-pdfs/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.product || null;
    } catch (err) {
      console.warn("[PrintablePdfService] getProductById error:", err);
      return null;
    }
  }

  async initializeOrder(params: InitializeOrderParams): Promise<InitializeOrderResponse> {
    const res = await fetch("/api/printable-pdfs/order/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to initialize order.");
    }
    return data;
  }

  async verifyOrder(reference: string, orderId?: string): Promise<VerifyOrderResponse> {
    const res = await fetch("/api/printable-pdfs/order/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, orderId })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Payment verification failed.");
    }
    return data;
  }

  async getOrderStatus(orderId: string): Promise<PrintablePdfOrder | null> {
    try {
      const res = await fetch(`/api/printable-pdfs/order/status/${encodeURIComponent(orderId)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.order || null;
    } catch (err) {
      console.warn("[PrintablePdfService] getOrderStatus error:", err);
      return null;
    }
  }

  async getMyOrders(email: string): Promise<PrintablePdfOrder[]> {
    try {
      if (!email) return [];
      const res = await fetch(`/api/printable-pdfs/my-orders?email=${encodeURIComponent(email)}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.orders || [];
    } catch (err) {
      console.warn("[PrintablePdfService] getMyOrders error:", err);
      return [];
    }
  }

  getDownloadUrl(token: string): string {
    return `/api/printable-pdfs/download/${encodeURIComponent(token)}`;
  }

  // --- Admin API Methods ---

  async getAdminProducts(): Promise<PrintablePdfProduct[]> {
    const res = await fetch("/api/admin/printable-pdfs", {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch admin products");
    const data = await res.json();
    const deletedIds = getClientDeletedPdfIds();
    return (data.products || []).filter((p: PrintablePdfProduct) => !deletedIds.has(p.id));
  }

  async saveProduct(product: Partial<PrintablePdfProduct>): Promise<PrintablePdfProduct> {
    const isEdit = !!product.id;
    const url = isEdit ? `/api/admin/printable-pdfs/${product.id}` : "/api/admin/printable-pdfs";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save PDF product.");
    }

    if (db && data.product?.id) {
      try {
        await setDoc(doc(db, "printable_pdf_products", data.product.id), data.product, { merge: true });
      } catch (fbErr) {
        console.warn("[PDF Service] Firestore save notice:", fbErr);
      }
    }

    return data.product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    recordClientDeletedPdfId(id);

    if (db) {
      try {
        await deleteDoc(doc(db, "printable_pdf_products", id));
        await setDoc(doc(db, "app_settings", "deleted_pdf_products"), {
          ids: Array.from(getClientDeletedPdfIds()),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (fbErr) {
        console.warn("[PDF Service] Firestore delete notice:", fbErr);
      }
    }

    const res = await fetch(`/api/admin/printable-pdfs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete product.");
    }
    return true;
  }

  async uploadAsset(fileData: string, filename: string, mimeType: string, assetType: "cover" | "master_pdf"): Promise<{ url: string; filename: string }> {
    const res = await fetch("/api/admin/printable-pdfs/upload-asset", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ fileData, filename, mimeType, assetType })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to upload asset.");
    }
    return { url: data.url, filename: data.filename };
  }

  async getAdminOrders(): Promise<PrintablePdfOrder[]> {
    const res = await fetch("/api/admin/printable-pdfs/orders", {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.orders || [];
  }

  async regenerateOrderPdf(orderId: string): Promise<boolean> {
    const res = await fetch(`/api/admin/printable-pdfs/orders/${encodeURIComponent(orderId)}/regenerate`, {
      method: "POST",
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to regenerate PDF.");
    }
    return true;
  }
}

export const printablePdfService = new PrintablePdfService();

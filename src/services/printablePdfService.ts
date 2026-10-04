import { PrintablePdfProduct, PrintablePdfOrder } from "../types/printablePdf";

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

function getClientDeletedPdfIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PDF_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

function recordClientDeletedPdfId(id: string) {
  try {
    const set = getClientDeletedPdfIds();
    set.add(id);
    localStorage.setItem(DELETED_PDF_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

class PrintablePdfService {
  private getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    try {
      const email = localStorage.getItem("fit_user_email") || localStorage.getItem("fit_saved_email") || "alexfitnesshub@gmail.com";
      if (email) {
        headers["x-admin-email"] = email;
      }
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
      const deletedIds = getClientDeletedPdfIds();
      return (data.products || []).filter((p: PrintablePdfProduct) => !deletedIds.has(p.id));
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
    return data.product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    recordClientDeletedPdfId(id);
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

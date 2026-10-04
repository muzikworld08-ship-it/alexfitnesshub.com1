import type { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { 
  getPdfProducts, 
  savePdfProducts, 
  getPdfOrders, 
  savePdfOrders, 
  saveOrUpdateOrder, 
  generatePersonalizedPdf, 
  generateMasterPdfFallback,
  ensurePdfDirectories,
  recordDeletedPdfId
} from "./printablePdfEngine";
import { PrintablePdfProduct, PrintablePdfOrder } from "../types/printablePdf";

const DATA_DIR = path.join(process.cwd(), "data");
const MASTERS_DIR = path.join(DATA_DIR, "pdf_masters");
const PHOTOS_DIR = path.join(DATA_DIR, "pdf_photos");
const GENERATED_DIR = path.join(DATA_DIR, "pdf_generated");

export function registerPrintablePdfRoutes(
  app: Express,
  options: {
    requireAdmin: any;
    paystackSecretKey: string;
    appUrl?: string;
  }
) {
  ensurePdfDirectories();
  const { requireAdmin, paystackSecretKey, appUrl } = options;

  // 1. GET /api/printable-pdfs - List public active products
  app.get("/api/printable-pdfs", (req: Request, res: Response) => {
    try {
      const all = getPdfProducts();
      const active = all.filter((p) => p.isActive !== false);
      res.json({ success: true, products: active });
    } catch (err: any) {
      console.error("[PDF Routes] Error fetching products:", err);
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  });

  // 2. GET /api/printable-pdfs/my-orders - Lookup orders for a customer email
  app.get("/api/printable-pdfs/my-orders", (req: Request, res: Response) => {
    try {
      const email = ((req.query.email as string) || (req.headers["x-customer-email"] as string) || "").trim().toLowerCase();
      if (!email) {
        return res.json({ success: true, orders: [] });
      }

      const orders = getPdfOrders();
      const customerOrders = orders.filter((o) => o.customerEmail && o.customerEmail.toLowerCase() === email);
      res.json({ success: true, orders: customerOrders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to retrieve orders." });
    }
  });

  // 3. POST /api/printable-pdfs/order/initialize - Create pending order & start Paystack checkout
  app.post("/api/printable-pdfs/order/initialize", async (req: Request, res: Response) => {
    try {
      const { productId, customerEmail, customerName, photoBase64, photoFilename } = req.body;

      if (!productId || !customerEmail) {
        return res.status(400).json({
          success: false,
          error: "productId and customerEmail are required fields."
        });
      }

      const products = getPdfProducts();
      const product = products.find((p) => p.id === productId);
      if (!product) {
        return res.status(404).json({ success: false, error: "Specified PDF product does not exist." });
      }

      // Check personalization constraint
      if (product.requiresPersonalization && !photoBase64) {
        return res.status(400).json({
          success: false,
          error: "This product requires a personal photo upload for custom generation."
        });
      }

      const orderNumber = "AFH-PDF-" + Math.floor(100000 + Math.random() * 900000);
      const orderId = `ord_pdf_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const reference = "ref_afh_pdf_" + crypto.randomBytes(8).toString("hex").toUpperCase();
      const downloadToken = crypto.randomBytes(24).toString("hex");

      let savedPhotoFilename: string | undefined = undefined;

      // Handle photo upload if provided (strictly ONE photo validation)
      if (photoBase64) {
        const match = photoBase64.match(/^data:([^;]+);base64,(.+)$/);
        let mime = "image/jpeg";
        let rawBase64 = photoBase64;
        if (match) {
          mime = match[1];
          rawBase64 = match[2];
        }

        const buffer = Buffer.from(rawBase64, "base64");
        // Validate max 5MB
        if (buffer.length > 5 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            error: "Uploaded photo exceeds the maximum size limit of 5 MB."
          });
        }

        let ext = "jpg";
        if (mime.includes("png")) ext = "png";
        else if (mime.includes("webp")) ext = "webp";

        savedPhotoFilename = `photo_${orderNumber}_${Date.now()}.${ext}`;
        fs.writeFileSync(path.join(PHOTOS_DIR, savedPhotoFilename), buffer);
      }

      const order: PrintablePdfOrder = {
        id: orderId,
        orderNumber,
        productId: product.id,
        productTitle: product.title,
        customerEmail: customerEmail.trim().toLowerCase(),
        customerName: customerName ? customerName.trim() : undefined,
        amountNGN: product.priceNGN,
        currency: "NGN",
        paymentReference: reference,
        paymentStatus: "pending",
        personalizationRequired: product.requiresPersonalization,
        uploadedPhotoFilename: savedPhotoFilename,
        downloadToken,
        downloadCount: 0,
        pdfGenerationStatus: "pending",
        simulated: !paystackSecretKey || !!req.body.simulate,
        createdAt: new Date().toISOString()
      };

      saveOrUpdateOrder(order);

      const requestBaseUrl = appUrl || `${req.protocol}://${req.get("host")}`;
      const resolvedCallbackUrl = `${requestBaseUrl.replace(/\/$/, "")}/printable-pdfs/success?reference=${reference}&orderId=${orderId}`;

      // Check if Paystack secret key is configured or simulated mode requested
      if (!paystackSecretKey || req.body.simulate) {
        console.warn("[PDF Order] Operating in simulated mode (local dev/test or missing secret key).");
        return res.json({
          success: true,
          orderId,
          reference,
          downloadToken,
          simulated: true
        });
      }

      // Initialize Paystack transaction
      const amountInKobo = Math.round(product.priceNGN) * 100;
      const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: customerEmail.trim().toLowerCase(),
          amount: amountInKobo,
          reference,
          callback_url: resolvedCallbackUrl,
          metadata: {
            type: "printable_pdf",
            orderId,
            productId: product.id,
            productTitle: product.title,
            customerEmail: customerEmail.trim().toLowerCase(),
            custom_fields: [
              { display_name: "Product", variable_name: "product_title", value: product.title },
              { display_name: "Order Number", variable_name: "order_number", value: orderNumber }
            ]
          }
        })
      });

      const paystackData: any = await paystackRes.json();
      if (paystackData?.status && paystackData?.data?.authorization_url) {
        return res.json({
          success: true,
          orderId,
          reference,
          authorization_url: paystackData.data.authorization_url,
          access_code: paystackData.data.access_code
        });
      } else {
        console.error("[PDF Paystack Error]", paystackData);
        return res.status(400).json({
          success: false,
          error: paystackData?.message || "Failed to initialize Paystack checkout."
        });
      }
    } catch (err: any) {
      console.error("[PDF Checkout Exception]:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to initialize order." });
    }
  });

  // 4. POST /api/printable-pdfs/order/verify - Verify payment & generate PDF
  app.post("/api/printable-pdfs/order/verify", async (req: Request, res: Response) => {
    try {
      const { reference, orderId } = req.body;
      if (!reference && !orderId) {
        return res.status(400).json({ success: false, error: "Payment reference or orderId is required." });
      }

      const orders = getPdfOrders();
      let order = orders.find((o) => (reference && o.paymentReference === reference) || (orderId && o.id === orderId));
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }

      // If already paid and PDF ready, return idempotent response immediately
      if (order.paymentStatus === "paid" && order.pdfGenerationStatus === "ready") {
        return res.json({
          success: true,
          alreadyProcessed: true,
          order,
          downloadToken: order.downloadToken
        });
      }

      // Verify with Paystack if secret key is configured and not in simulated test mode
      if (paystackSecretKey && !order.simulated) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(order.paymentReference)}`, {
            headers: {
              Authorization: `Bearer ${paystackSecretKey}`,
              "Content-Type": "application/json"
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const verifyData: any = await verifyRes.json();
          if (!verifyData?.status || verifyData?.data?.status !== "success") {
            return res.status(400).json({
              success: false,
              error: `Transaction status is ${verifyData?.data?.status || "unverified"}. Payment not completed.`
            });
          }
        } catch (vErr: any) {
          console.warn("[PDF Verify Warning] Paystack verification notice:", vErr.message);
          if (vErr.name === "AbortError") {
            return res.status(504).json({ success: false, error: "Payment verification timed out contacting Paystack." });
          }
        }
      }

      // Mark order as PAID
      order.paymentStatus = "paid";
      order.paidAt = order.paidAt || new Date().toISOString();
      order.pdfGenerationStatus = "processing";
      saveOrUpdateOrder(order);

      // Trigger PDF generation in background / immediately
      const products = getPdfProducts();
      const product = products.find((p) => p.id === order!.productId) || products[0];

      try {
        if (order.personalizationRequired && order.uploadedPhotoFilename) {
          const generatedName = await generatePersonalizedPdf(product, order);
          order.generatedPdfFilename = generatedName;
          order.pdfGenerationStatus = "ready";
        } else {
          // Standard non-personalized master delivery
          const masterPath = product.masterPdfFilename
            ? path.join(MASTERS_DIR, product.masterPdfFilename)
            : path.join(MASTERS_DIR, `${product.id}.pdf`);

          if (!fs.existsSync(masterPath)) {
            await generateMasterPdfFallback(product);
          }
          order.pdfGenerationStatus = "ready";
        }
      } catch (genErr: any) {
        console.error("[PDF Generation Failure]", genErr);
        order.pdfGenerationStatus = "failed";
        order.generationError = genErr.message;
      }

      saveOrUpdateOrder(order);

      // Increment product sales count
      const pIdx = products.findIndex((p) => p.id === product.id);
      if (pIdx >= 0) {
        products[pIdx].salesCount = (products[pIdx].salesCount || 0) + 1;
        savePdfProducts(products);
      }

      return res.json({
        success: true,
        order,
        downloadToken: order.downloadToken
      });
    } catch (err: any) {
      console.error("[PDF Verify Exception]:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to verify order." });
    }
  });

  // 5. GET /api/printable-pdfs/order/status/:orderId - Status polling for download page
  app.get("/api/printable-pdfs/order/status/:orderId", (req: Request, res: Response) => {
    try {
      const orders = getPdfOrders();
      const order = orders.find((o) => o.id === req.params.orderId || o.paymentReference === req.params.orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }
      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to get order status." });
    }
  });

  // 6. GET /api/printable-pdfs/download/:token - Secure PDF delivery endpoint
  app.get("/api/printable-pdfs/download/:token", async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      if (!token) {
        return res.status(400).send("Download token is required.");
      }

      const orders = getPdfOrders();
      const order = orders.find((o) => o.downloadToken === token);

      if (!order) {
        return res.status(404).send("Invalid or expired download link.");
      }

      if (order.paymentStatus !== "paid") {
        return res.status(403).send("This order is unpaid. Download access is restricted to verified paid orders.");
      }

      const products = getPdfProducts();
      const product = products.find((p) => p.id === order.productId) || products[0];

      let targetFilePath = "";
      let downloadFilename = `${product.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

      if (order.personalizationRequired && order.generatedPdfFilename) {
        targetFilePath = path.join(GENERATED_DIR, order.generatedPdfFilename);
        downloadFilename = order.generatedPdfFilename;
      } else {
        targetFilePath = product.masterPdfFilename
          ? path.join(MASTERS_DIR, product.masterPdfFilename)
          : path.join(MASTERS_DIR, `${product.id}.pdf`);

        if (!fs.existsSync(targetFilePath)) {
          await generateMasterPdfFallback(product);
        }
      }

      if (!fs.existsSync(targetFilePath)) {
        // Fallback generation if file was purged
        if (order.personalizationRequired && order.uploadedPhotoFilename) {
          const gen = await generatePersonalizedPdf(product, order);
          targetFilePath = path.join(GENERATED_DIR, gen);
        } else {
          await generateMasterPdfFallback(product);
        }
      }

      // Increment download count
      order.downloadCount = (order.downloadCount || 0) + 1;
      saveOrUpdateOrder(order);

      // Deliver securely with strict headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFilename)}"`);
      res.setHeader("Cache-Control", "private, no-transform, no-cache");

      const stream = fs.createReadStream(targetFilePath);
      stream.pipe(res);
    } catch (err: any) {
      console.error("[PDF Download Exception]:", err);
      res.status(500).send("Failed to deliver PDF file: " + err.message);
    }
  });

  // 7. GET /api/printable-pdfs/:id - Get single product by id
  app.get(["/api/printable-pdfs/product/:id", "/api/printable-pdfs/:id"], (req: Request, res: Response) => {
    try {
      const all = getPdfProducts();
      const p = all.find((item) => item.id === req.params.id);
      if (!p) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }
      res.json({ success: true, product: p });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Error fetching product" });
    }
  });

  // --- Admin Protected Endpoints ---

  // 8. GET /api/admin/printable-pdfs - List all products including disabled
  app.get("/api/admin/printable-pdfs", requireAdmin, (req: Request, res: Response) => {
    try {
      const list = getPdfProducts();
      res.json({ success: true, products: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to fetch admin products" });
    }
  });

  // 9. POST /api/admin/printable-pdfs - Create product
  app.post("/api/admin/printable-pdfs", requireAdmin, (req: Request, res: Response) => {
    try {
      const {
        title,
        shortDescription,
        fullDescription,
        benefits,
        priceNGN,
        originalPriceNGN,
        coverImage,
        pageCount,
        category,
        requiresPersonalization,
        personalizationConfig,
        masterPdfFilename,
        isActive
      } = req.body;

      if (!title || !priceNGN) {
        return res.status(400).json({ success: false, error: "title and priceNGN are required." });
      }

      const products = getPdfProducts();
      const newProduct: PrintablePdfProduct = {
        id: `pdf_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
        title: title.trim(),
        shortDescription: shortDescription || "",
        fullDescription: fullDescription || "",
        benefits: Array.isArray(benefits) ? benefits : [],
        priceNGN: Number(priceNGN),
        originalPriceNGN: originalPriceNGN ? Number(originalPriceNGN) : undefined,
        coverImage: coverImage || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80",
        pageCount: Number(pageCount) || 50,
        category: category || "Journal",
        requiresPersonalization: !!requiresPersonalization,
        personalizationConfig: requiresPersonalization ? personalizationConfig : undefined,
        previewPages: [coverImage || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80"],
        masterPdfFilename,
        isActive: isActive !== false,
        salesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      products.unshift(newProduct);
      savePdfProducts(products);
      res.json({ success: true, product: newProduct });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to create product" });
    }
  });

  // 10. PUT /api/admin/printable-pdfs/:id - Update product
  app.put("/api/admin/printable-pdfs/:id", requireAdmin, (req: Request, res: Response) => {
    try {
      const products = getPdfProducts();
      const idx = products.findIndex((p) => p.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      const updated: PrintablePdfProduct = {
        ...products[idx],
        ...req.body,
        id: products[idx].id,
        updatedAt: new Date().toISOString()
      };

      products[idx] = updated;
      savePdfProducts(products);
      res.json({ success: true, product: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to update product" });
    }
  });

  // 11. DELETE /api/admin/printable-pdfs/:id - Delete product
  app.delete("/api/admin/printable-pdfs/:id", requireAdmin, (req: Request, res: Response) => {
    try {
      const prodId = String(req.params.id);
      recordDeletedPdfId(prodId);

      let products = getPdfProducts();
      const productToDelete = products.find((p) => p.id === prodId);
      
      // Clean up master PDF if custom
      if (productToDelete?.masterPdfFilename) {
        const masterPath = path.join(MASTERS_DIR, productToDelete.masterPdfFilename);
        if (fs.existsSync(masterPath)) {
          try { fs.unlinkSync(masterPath); } catch {}
        }
      }

      products = products.filter((p) => p.id !== prodId);
      savePdfProducts(products);
      res.json({ success: true, message: `Product ${prodId} permanently deleted.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to delete product" });
    }
  });

  // 12. POST /api/admin/printable-pdfs/upload-asset - Upload cover or master PDF file
  app.post("/api/admin/printable-pdfs/upload-asset", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { fileData, filename = `asset_${Date.now()}`, mimeType = "image/png", assetType = "cover" } = req.body;
      if (!fileData) {
        return res.status(400).json({ success: false, error: "Missing fileData." });
      }

      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      const rawBase64 = match ? match[2] : fileData;
      const detectedMime = match ? match[1] : mimeType;
      const buffer = Buffer.from(rawBase64, "base64");

      const cleanFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

      if (assetType === "master_pdf") {
        // Master PDFs are stored strictly in private MASTERS_DIR, NEVER public!
        const fullFilename = `master_${Date.now()}_${cleanFilename}`;
        fs.writeFileSync(path.join(MASTERS_DIR, fullFilename), buffer);
        console.log(`[Admin PDF] Saved private master template: ${fullFilename}`);
        return res.json({ success: true, filename: fullFilename, url: "" });
      } else {
        // Cover Image can be served as static asset for catalog display
        const publicDir = path.join(process.cwd(), "public", "assets", "pdf_covers");
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const fullCoverName = `cover_${Date.now()}_${cleanFilename}`;
        fs.writeFileSync(path.join(publicDir, fullCoverName), buffer);
        const publicUrl = `/assets/pdf_covers/${fullCoverName}`;
        return res.json({ success: true, url: publicUrl, filename: fullCoverName });
      }
    } catch (err: any) {
      console.error("[Admin Asset Upload Error]:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to upload asset." });
    }
  });

  // 13. GET /api/admin/printable-pdfs/orders - View all orders
  app.get("/api/admin/printable-pdfs/orders", requireAdmin, (req: Request, res: Response) => {
    try {
      const orders = getPdfOrders();
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to fetch orders." });
    }
  });

  // 14. POST /api/admin/printable-pdfs/orders/:orderId/regenerate - Re-trigger PDF generation
  app.post("/api/admin/printable-pdfs/orders/:orderId/regenerate", requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = getPdfOrders();
      const order = orders.find((o) => o.id === req.params.orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }

      const products = getPdfProducts();
      const product = products.find((p) => p.id === order.productId) || products[0];

      if (order.personalizationRequired && order.uploadedPhotoFilename) {
        const generated = await generatePersonalizedPdf(product, order);
        order.generatedPdfFilename = generated;
        order.pdfGenerationStatus = "ready";
        saveOrUpdateOrder(order);
      }

      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to regenerate PDF." });
    }
  });
}

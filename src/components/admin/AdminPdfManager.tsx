import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  FileText, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, 
  Clock, Download, RefreshCw, Eye, Search, Filter, Upload, 
  X, Sparkles, ShieldCheck, DollarSign, Layers, ExternalLink, Sliders
} from "lucide-react";
import { PrintablePdfProduct, PrintablePdfOrder, PersonalizationConfig } from "../../types/printablePdf";
import { printablePdfService } from "../../services/printablePdfService";

export const AdminPdfManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<PrintablePdfProduct[]>([]);
  const [orders, setOrders] = useState<PrintablePdfOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Search & Filter
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PrintablePdfProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<PrintablePdfProduct | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<any>("Journal");
  const [formPrice, setFormPrice] = useState<number>(4500);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(6000);
  const [formPageCount, setFormPageCount] = useState<number>(60);
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formFullDesc, setFormFullDesc] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formBenefits, setFormBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [formRequiresPersonalization, setFormRequiresPersonalization] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  // Photo Personalization Coordinates Config
  const [photoPage, setPhotoPage] = useState<number>(1);
  const [photoX, setPhotoX] = useState<number>(200);
  const [photoY, setPhotoY] = useState<number>(350);
  const [photoWidth, setPhotoWidth] = useState<number>(200);
  const [photoHeight, setPhotoHeight] = useState<number>(250);

  // Master PDF upload state
  const [masterPdfFilename, setMasterPdfFilename] = useState("");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, ords] = await Promise.all([
        printablePdfService.getAdminProducts(),
        printablePdfService.getAdminOrders(),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err: any) {
      console.warn("Failed to load admin PDF data:", err);
      setMessage({ text: err.message || "Failed to load PDF data.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle("");
    setFormCategory("Journal");
    setFormPrice(4500);
    setFormOriginalPrice(6000);
    setFormPageCount(60);
    setFormShortDesc("");
    setFormFullDesc("");
    setFormCoverImage("https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80");
    setFormBenefits([
      "High-resolution vector printable design",
      "Comprehensive daily habit and workout tracking matrix",
      "Instant secure delivery"
    ]);
    setFormRequiresPersonalization(false);
    setFormIsActive(true);
    setPhotoPage(1);
    setPhotoX(200);
    setPhotoY(350);
    setPhotoWidth(200);
    setPhotoHeight(250);
    setMasterPdfFilename("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: PrintablePdfProduct) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormPrice(p.priceNGN);
    setFormOriginalPrice(p.originalPriceNGN);
    setFormPageCount(p.pageCount);
    setFormShortDesc(p.shortDescription);
    setFormFullDesc(p.fullDescription);
    setFormCoverImage(p.coverImage);
    setFormBenefits(p.benefits || []);
    setFormRequiresPersonalization(p.requiresPersonalization);
    setFormIsActive(p.isActive !== false);

    if (p.personalizationConfig) {
      setPhotoPage(p.personalizationConfig.page || 1);
      setPhotoX(p.personalizationConfig.x || 200);
      setPhotoY(p.personalizationConfig.y || 350);
      setPhotoWidth(p.personalizationConfig.width || 200);
      setPhotoHeight(p.personalizationConfig.height || 250);
    } else {
      setPhotoPage(1);
      setPhotoX(200);
      setPhotoY(350);
      setPhotoWidth(200);
      setPhotoHeight(250);
    }

    setMasterPdfFilename(p.masterPdfFilename || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please provide a product title.");
      return;
    }

    setActionLoading(true);
    try {
      const payload: Partial<PrintablePdfProduct> = {
        ...(editingProduct ? { id: editingProduct.id } : {}),
        title: formTitle.trim(),
        category: formCategory,
        priceNGN: Number(formPrice),
        originalPriceNGN: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        pageCount: Number(formPageCount),
        shortDescription: formShortDesc.trim(),
        fullDescription: formFullDesc.trim(),
        coverImage: formCoverImage.trim(),
        benefits: formBenefits,
        requiresPersonalization: formRequiresPersonalization,
        isActive: formIsActive,
        masterPdfFilename: masterPdfFilename || undefined,
        personalizationConfig: formRequiresPersonalization ? {
          page: Number(photoPage),
          x: Number(photoX),
          y: Number(photoY),
          width: Number(photoWidth),
          height: Number(photoHeight),
        } : undefined,
      };

      await printablePdfService.saveProduct(payload);
      window.dispatchEvent(new CustomEvent("fit-pdf-catalog-changed"));
      setMessage({ text: "Product saved successfully!", isError: false });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save product.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      await printablePdfService.deleteProduct(productToDelete.id);
      window.dispatchEvent(new CustomEvent("fit-pdf-catalog-changed"));
      setMessage({ text: `Product "${productToDelete.title}" deleted.`, isError: false });
      setProductToDelete(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleProductStatus = async (product: PrintablePdfProduct) => {
    try {
      await printablePdfService.saveProduct({
        ...product,
        isActive: !product.isActive,
      });
      window.dispatchEvent(new CustomEvent("fit-pdf-catalog-changed"));
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to toggle status.");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setIsUploadingCover(true);
        const res = await printablePdfService.uploadAsset(
          reader.result as string,
          file.name,
          file.type,
          "cover"
        );
        setFormCoverImage(res.url);
      } catch (err: any) {
        alert(err.message || "Failed to upload cover.");
      } finally {
        setIsUploadingCover(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMasterPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid .pdf file.");
      return;
    }
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setIsUploadingPdf(true);
        const res = await printablePdfService.uploadAsset(
          reader.result as string,
          file.name,
          "application/pdf",
          "master_pdf"
        );
        setMasterPdfFilename(res.filename);
        alert(`Master PDF "${file.name}" uploaded successfully and protected on secure storage.`);
      } catch (err: any) {
        alert(err.message || "Failed to upload PDF.");
      } finally {
        setIsUploadingPdf(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRegeneratePdf = async (orderId: string) => {
    if (!confirm("Regenerate personalized PDF for this order?")) return;
    try {
      await printablePdfService.regenerateOrderPdf(orderId);
      alert("PDF regenerated successfully!");
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to regenerate PDF.");
    }
  };

  // Stats calculation
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + (o.amountNGN || 0), 0);
  }, [orders]);

  const totalDownloads = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.downloadCount || 0), 0);
  }, [orders]);

  const paidOrdersCount = useMemo(() => {
    return orders.filter((o) => o.paymentStatus === "paid").length;
  }, [orders]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.paymentReference && o.paymentReference.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.productTitle && o.productTitle.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchesStatus = orderStatusFilter === "all" || o.paymentStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Top Banner & Stats */}
      <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border border-red-200">
              <FileText className="w-3.5 h-3.5 text-red-600" />
              Digital Goods Control
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Secure Delivery Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Printable PDF Products & Order Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create products, configure photo personalization coordinates, manage master PDF templates, and monitor customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add PDF Product</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs min-w-0">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block truncate">Total Revenue</span>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-1 truncate">
            ₦{totalRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block truncate">From paid PDF orders</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs min-w-0">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block truncate">Active Products</span>
          <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">
            {products.filter((p) => p.isActive).length} / {products.length}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block truncate">Catalog editions</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs min-w-0">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block truncate">Paid Orders</span>
          <p className="text-lg sm:text-2xl font-black text-blue-600 mt-1 truncate">
            {paidOrdersCount}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block truncate">Confirmed transactions</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs min-w-0">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block truncate">Total Downloads</span>
          <p className="text-lg sm:text-2xl font-black text-purple-600 mt-1 truncate">
            {totalDownloads}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block truncate">Secure PDF requests</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab("products")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            activeSubTab === "products"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("orders")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            activeSubTab === "orders"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Orders & Deliveries ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Products List */}
      {activeSubTab === "products" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products by title or category..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Pages</th>
                    <th className="py-3 px-4">Personalization</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-10 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-black text-slate-900 block truncate max-w-xs">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate block">
                              {p.masterPdfFilename ? `PDF: ${p.masterPdfFilename}` : "Standard master template"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{p.category}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">₦{p.priceNGN.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{p.pageCount} pgs</td>
                      <td className="py-3.5 px-4">
                        {p.requiresPersonalization ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Photo Required
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Standard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleProductStatus(p)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                            p.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {p.isActive ? "Active (Live)" : "Disabled"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders List */}
      {activeSubTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search email, order ID or reference..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              {["all", "paid", "pending", "failed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                    orderStatusFilter === st
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Email</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Paystack Ref</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Downloads</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {o.orderNumber || o.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {o.customerEmail}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <span className="block truncate max-w-xs">{o.productTitle}</span>
                        {o.personalizationRequired && (
                          <span className="text-[10px] text-amber-600 font-mono block">Personalized Photo</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₦{o.amountNGN.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {o.paymentReference}
                      </td>
                      <td className="py-3.5 px-4">
                        {o.paymentStatus === "paid" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            PAID
                          </span>
                        ) : o.paymentStatus === "failed" ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                            FAILED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {o.downloadCount || 0} times
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {o.personalizationRequired && o.paymentStatus === "paid" && (
                          <button
                            onClick={() => handleRegeneratePdf(o.id)}
                            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Regenerate personalized PDF from customer photo"
                          >
                            <RefreshCw className="w-3 h-3 text-red-600" />
                            <span>Regenerate</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-black text-slate-900">
                {editingProduct ? "Edit Printable PDF Product" : "Add New Printable PDF Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800 uppercase">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. ALEXFITNESSHUB Weight Loss Journal"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="Journal">Journal</option>
                    <option value="Meal Planner">Meal Planner</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Workout">Workout</option>
                    <option value="Guides">Guides</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase">Price in Naira (NGN) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase">Original Price (Strikeout)</label>
                  <input
                    type="number"
                    value={formOriginalPrice || ""}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase">Page Count</label>
                  <input
                    type="number"
                    min={1}
                    value={formPageCount}
                    onChange={(e) => setFormPageCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Cover Image & Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase">Product Cover Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="Cover image URL or upload below..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingCover ? "Uploading..." : "Upload Cover"}</span>
                  </button>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </div>
                {formCoverImage && (
                  <div className="w-20 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-2xs mt-1">
                    <img src={formCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Master PDF File Upload */}
              <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase block">Master PDF Template</span>
                    <span className="text-[11px] text-slate-500">
                      Private protected storage. Never publicly exposed.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => pdfFileInputRef.current?.click()}
                    disabled={isUploadingPdf}
                    className="py-2 px-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingPdf ? "Uploading PDF..." : "Upload Master PDF"}</span>
                  </button>
                  <input
                    ref={pdfFileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleMasterPdfUpload}
                    className="hidden"
                  />
                </div>

                {masterPdfFilename ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Master Template File: {masterPdfFilename}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    No custom master PDF uploaded yet. The system will use its auto-compiled high-resolution master template.
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Summary shown on cards and catalogs..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase">Full Description</label>
                <textarea
                  rows={4}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  placeholder="Detailed breakdown shown on product page..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Personalization Section & Coordinates Configuration */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-900 block">
                      Customer Photo Personalization
                    </span>
                    <span className="text-[11px] text-slate-500">
                      When enabled, customer uploads exactly 1 photo rendered onto their custom PDF copy.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formRequiresPersonalization}
                    onChange={(e) => setFormRequiresPersonalization(e.target.checked)}
                    className="w-5 h-5 accent-red-600 cursor-pointer"
                  />
                </div>

                {formRequiresPersonalization && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-800 uppercase block">
                      Photo Placement Coordinates & Dimensions (PDF Points)
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block">Page #</label>
                        <input
                          type="number"
                          min={1}
                          value={photoPage}
                          onChange={(e) => setPhotoPage(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block">X Pos (pt)</label>
                        <input
                          type="number"
                          value={photoX}
                          onChange={(e) => setPhotoX(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block">Y Pos (pt)</label>
                        <input
                          type="number"
                          value={photoY}
                          onChange={(e) => setPhotoY(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block">Width (pt)</label>
                        <input
                          type="number"
                          value={photoWidth}
                          onChange={(e) => setPhotoWidth(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block">Height (pt)</label>
                        <input
                          type="number"
                          value={photoHeight}
                          onChange={(e) => setPhotoHeight(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Interactive Visual Placement Preview Simulation */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">
                        Interactive Visual Placement Preview (Page {photoPage} Simulation):
                      </span>
                      <div className="relative w-48 h-64 bg-white border-2 border-slate-300 rounded-lg mx-auto shadow-inner overflow-hidden">
                        {/* Simulated page content lines */}
                        <div className="p-3 space-y-1.5 opacity-30 select-none">
                          <div className="h-2 w-3/4 bg-slate-400 rounded" />
                          <div className="h-1.5 w-1/2 bg-slate-300 rounded" />
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
                        </div>

                        {/* Customer Photo Box Preview mapped proportionally */}
                        <div
                          style={{
                            position: "absolute",
                            left: `${Math.min(80, Math.max(5, (photoX / 612) * 100))}%`,
                            bottom: `${Math.min(80, Math.max(5, (photoY / 792) * 100))}%`,
                            width: `${Math.min(80, Math.max(15, (photoWidth / 612) * 100))}%`,
                            height: `${Math.min(80, Math.max(15, (photoHeight / 792) * 100))}%`,
                          }}
                          className="bg-red-500/20 border-2 border-red-600 rounded flex flex-col items-center justify-center text-[8px] font-mono font-bold text-red-700 shadow-sm"
                        >
                          <span>Photo Target</span>
                          <span>{photoWidth}x{photoHeight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase block">Product Visibility</span>
                  <span className="text-[11px] text-slate-500">Live products appear in the public PDF store.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete PDF Product?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove <span className="font-bold text-slate-800">"{productToDelete.title}"</span>? Customers who have already purchased will maintain their download access.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={actionLoading}
                className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

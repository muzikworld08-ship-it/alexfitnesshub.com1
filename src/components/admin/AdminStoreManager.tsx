import React, { useState } from "react";
import { 
  ShoppingBag, Package, Plus, Edit2, Trash2, CheckCircle2, 
  Clock, Truck, AlertCircle, Search, Filter, ExternalLink, 
  MessageSquare, Save, X, DollarSign, Tag, RefreshCw, Eye
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Product, StoreOrder, ProductCategory, ProductColor } from "../../types";

export const AdminStoreManager: React.FC = () => {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    resetToDefaultProducts
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<"products" | "orders">("products");

  // Product Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProductCategory>("Men");
  const [formPrice, setFormPrice] = useState<number>(18500);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(22000);
  const [formFrontImage, setFormFrontImage] = useState("");
  const [formBackImage, setFormBackImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSizes, setFormSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [formColors, setFormColors] = useState<ProductColor[]>([
    { name: "Black", hex: "#111827" },
    { name: "Crimson Red", hex: "#E53935" }
  ]);
  const [formStock, setFormStock] = useState<number>(30);
  const [formFabric, setFormFabric] = useState("88% Polyester, 12% Spandex");
  const [formBadge, setFormBadge] = useState("");
  const [formFitType, setFormFitType] = useState<any>("Athletic Tapered");
  const [formStatusMsg, setFormStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Orders Filter & State
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<StoreOrder | null>(null);
  const [orderTrackingInput, setOrderTrackingInput] = useState("");
  const [orderNotesInput, setOrderNotesInput] = useState("");

  // Populate form for Editing
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormFrontImage(p.frontImage);
    setFormBackImage(p.backImage || "");
    setFormDescription(p.description);
    setFormSizes([...p.sizes]);
    setFormColors(p.colors ? [...p.colors] : [{ name: "Black", hex: "#111827" }]);
    setFormStock(p.stock);
    setFormFabric(p.fabric || "");
    setFormBadge(p.badge || "");
    setFormFitType(p.sizeGuide?.fitType || "Athletic Tapered");
    setFormStatusMsg(null);
  };

  // Reset form for Adding
  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Men");
    setFormPrice(18500);
    setFormOriginalPrice(22000);
    setFormFrontImage("https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80");
    setFormBackImage("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80");
    setFormDescription("");
    setFormSizes(["S", "M", "L", "XL", "XXL"]);
    setFormColors([
      { name: "Onyx Black", hex: "#111827" },
      { name: "Crimson Red", hex: "#E53935" }
    ]);
    setFormStock(30);
    setFormFabric("88% Microfiber, 12% Spandex (4-Way Stretch)");
    setFormBadge("New Release");
    setFormFitType("Athletic Tapered");
    setFormStatusMsg(null);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formFrontImage.trim()) {
      setFormStatusMsg({ text: "Name and Front Image URL are required.", isError: true });
      return;
    }

    const payload = {
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      frontImage: formFrontImage.trim(),
      backImage: formBackImage.trim() || formFrontImage.trim(),
      description: formDescription.trim(),
      sizes: formSizes,
      colors: formColors,
      stock: Number(formStock),
      fabric: formFabric.trim(),
      badge: formBadge.trim() || undefined,
      sizeGuide: {
        fitType: formFitType,
        notes: `Standard ${formFitType}. Choose true to size.`
      }
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        setEditingProduct(null);
      } else {
        setFormStatusMsg({ text: res.error || "Failed to update product.", isError: true });
      }
    } else {
      const res = await addProduct(payload as any);
      if (res.success) {
        setIsAddModalOpen(false);
      } else {
        setFormStatusMsg({ text: res.error || "Failed to add product.", isError: true });
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  // KPIs
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockItems = products.filter(p => p.stock <= 5);

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderFilterStatus === "all" || ord.orderStatus === orderFilterStatus;
    const matchesSearch = orderSearch.trim() === "" ||
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header & Overview KPIs */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 text-red-600">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                ALEXFITNESSHUB Store & Merch Desk
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Manage athletic clothing catalog, stock levels, sizes, colors, front/back imagery, and customer delivery orders.
            </p>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveSubTab("products")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === "products"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4 text-red-600" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === "orders"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Orders ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Catalog Items</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{products.length}</div>
            <span className="text-[10px] text-slate-400">Active apparel items</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="text-2xl font-black text-indigo-600 font-mono">{orders.length}</div>
            <span className="text-[10px] text-slate-400">Placed store orders</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Paid Store Revenue</span>
            <div className="text-2xl font-black text-emerald-600 font-mono">₦{totalRevenue.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400">Secured via Paystack</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Low Stock Items</span>
            <div className={`text-2xl font-black font-mono ${lowStockItems.length > 0 ? "text-amber-600" : "text-slate-400"}`}>
              {lowStockItems.length}
            </div>
            <span className="text-[10px] text-slate-400">&le; 5 units available</span>
          </div>
        </div>
      </div>

      {/* 2. TAB A: PRODUCTS CATALOG MANAGEMENT */}
      {activeSubTab === "products" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Products List ({products.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetToDefaultProducts}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reload default starter products into Firestore"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Defaults</span>
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Sizes</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Front & Back Thumbnails */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0" title="Front View">
                            <img src={p.frontImage} alt="Front" className="w-full h-full object-cover" />
                          </div>
                          {p.backImage && (
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0" title="Back View">
                              <img src={p.backImage} alt="Back" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name & Badge */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {p.badge && (
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-red-50 text-red-600 rounded">
                              {p.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₦{p.price.toLocaleString()}
                        {p.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ₦{p.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Sizes */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${p.stock <= 5 ? "text-red-600" : "text-slate-800"}`}>
                          {p.stock} units
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {deleteConfirmId === p.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 text-slate-400 hover:text-slate-700"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* 3. TAB B: ORDERS & SHIPMENTS MANAGEMENT */}
      {activeSubTab === "orders" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Customer Orders ({filteredOrders.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer, phone..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <select
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No Orders Found</h3>
              <p className="text-xs text-slate-500">Customer orders placed through the store checkout will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{ord.orderNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          ord.orderStatus === "delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          ord.orderStatus === "shipped" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                          ord.orderStatus === "processing" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {ord.orderStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
                          PAID
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Order Total</span>
                        <span className="font-mono font-black text-slate-900 text-sm">₦{ord.totalAmount.toLocaleString()}</span>
                      </div>

                      {/* WhatsApp Link to Customer */}
                      <a
                        href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(ord.customerName)},%20this%20is%20Coach%20Alex%20from%20ALEXFITNESSHUB%20regarding%20your%20Order%20%23${ord.orderNumber}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Customer Info & Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl">
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Customer</span>
                      <p className="font-medium text-slate-800">{ord.customerName}</p>
                      <p className="text-[11px] text-slate-500">{ord.customerEmail}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="font-bold text-slate-900 block mb-0.5">Delivery Destination</span>
                      <p className="text-slate-800 leading-normal">
                        {ord.shippingAddress?.address}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.country})
                      </p>
                      {ord.shippingAddress?.deliveryNotes && (
                        <p className="text-[11px] text-amber-700 italic mt-0.5">
                          Notes: {ord.shippingAddress.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="divide-y divide-slate-100">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt={item.name} className="w-9 h-11 object-cover rounded-lg bg-slate-100" />
                          <div>
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-slate-500 block text-[11px]">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-800">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status Management Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Update Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {ord.trackingNumber && (
                      <span className="text-xs text-slate-500 font-mono">
                        Tracking: <strong className="text-slate-800">{ord.trackingNumber}</strong>
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 4. MODAL: ADD / EDIT PRODUCT */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                {editingProduct ? "Edit Store Apparel" : "Add New Apparel Product"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formStatusMsg && (
                <div className={`p-3 rounded-xl text-xs ${formStatusMsg.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-700"}`}>
                  {formStatusMsg.text}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. ALEXFITNESSHUB Pro-Mesh Performance Tee"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-slate-50/50"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="ALEXFITNESSHUB Collections">ALEXFITNESSHUB Collections</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Badge (e.g. Best Seller, New)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Signature Series / Best Seller"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Strike Price (₦)</label>
                  <input
                    type="number"
                    value={formOriginalPrice || ""}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono"
                  />
                </div>
              </div>

              {/* Front Image & Back Image URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Front View Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formFrontImage}
                    onChange={(e) => setFormFrontImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Back View Image URL</label>
                  <input
                    type="url"
                    value={formBackImage}
                    onChange={(e) => setFormBackImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Engineered for high volume lifting..."
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                />
              </div>

              {/* Fabric */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fabric Composition</label>
                <input
                  type="text"
                  value={formFabric}
                  onChange={(e) => setFormFabric(e.target.value)}
                  placeholder="88% Nylon, 12% Spandex (4-Way Stretch)"
                  className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
                />
              </div>

              {/* Sizes Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL", "3XL", "One Size"].map((sz) => {
                    const isChecked = formSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFormSizes(formSizes.filter(s => s !== sz));
                          } else {
                            setFormSizes([...formSizes, sz]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isChecked ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? "Update Product" : "Save Product"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

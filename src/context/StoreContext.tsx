import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  arrayUnion
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useApp, isEmailAdmin } from "./AppContext";
import { Product, CartItem, StoreOrder, StoreDeliveryInfo } from "../types";
import { INITIAL_STORE_PRODUCTS } from "../data/storeProducts";

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  selectedProductForBuyNow: Product | null;
  setSelectedProductForBuyNow: (product: Product | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, size: string, color: string, quantity?: number, openCart?: boolean) => void;
  buyNow: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  lastAddedItem: { product: Product; size: string; color: string; quantity: number } | null;
  clearLastAddedItem: () => void;
  cartSubtotal: number;
  cartCount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  appliedPromoCode: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  orderTotal: number;

  // Orders
  orders: StoreOrder[];
  isLoadingOrders: boolean;
  lastCompletedOrder: StoreOrder | null;
  setLastCompletedOrder: (order: StoreOrder | null) => void;
  submitStoreOrder: (deliveryInfo: StoreDeliveryInfo, paymentReference?: string) => Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }>;

  // Admin Actions
  addProduct: (productData: Omit<Product, "id">) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  permanentlyDeleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  updateOrderStatus: (orderId: string, orderStatus: StoreOrder["orderStatus"], trackingNumber?: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  resetToDefaultProducts: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = "afh_fitness_wear_cart_v1";
const PROMO_STORAGE_KEY = "afh_applied_promo_v1";
const PRODUCTS_CACHE_KEY = "afh_store_products_cache_v2";
const DELETED_PRODUCT_IDS_KEY = "afh_permanently_deleted_product_ids";

function getStoredDeletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCT_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveStoredDeletedIds(set: Set<string>) {
  try {
    localStorage.setItem(DELETED_PRODUCT_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn("Failed to persist deleted product IDs:", e);
  }
}

function getInitialCachedProducts(): Product[] {
  const deletedSet = getStoredDeletedIds();
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(p => !deletedSet.has(p.id));
      }
    }
  } catch (e) {
    console.warn("Failed to read cached store products:", e);
  }
  return INITIAL_STORE_PRODUCTS.filter(p => !deletedSet.has(p.id));
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const isAdmin = user?.role === "admin" || (user?.email ? isEmailAdmin(user.email) : false);

  const [permanentlyDeletedIds, setPermanentlyDeletedIds] = useState<Set<string>>(() => getStoredDeletedIds());
  const [products, setProducts] = useState<Product[]>(() => getInitialCachedProducts());
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForBuyNow, setSelectedProductForBuyNow] = useState<Product | null>(null);
  
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<StoreOrder | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<{ product: Product; size: string; color: string; quantity: number } | null>(null);
  const toastTimerRef = useRef<any>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage:", e);
    }
  }, [cart]);

  // Synchronize permanently deleted product IDs from Firestore store_meta
  useEffect(() => {
    let unsub: () => void = () => {};
    try {
      const metaRef = doc(db, "store_meta", "deleted_products");
      unsub = onSnapshot(metaRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.ids) && data.ids.length > 0) {
            setPermanentlyDeletedIds((prev) => {
              const merged = new Set([...prev, ...data.ids]);
              saveStoredDeletedIds(merged);
              return merged;
            });
            // Also filter existing products immediately
            setProducts((prev) => {
              const filtered = prev.filter((p) => !data.ids.includes(p.id));
              try {
                localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(filtered));
              } catch (e) {}
              return filtered;
            });
          }
        }
      }, (err) => {
        console.warn("[Store] Deleted products listener error:", err);
      });
    } catch (e) {
      console.warn("[Store] Error setting up deleted products listener:", e);
    }
    return () => unsub();
  }, []);

  // Load and subscribe to products from Firestore
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const productsCollectionRef = collection(db, "products");
      unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {
        const currentDeletedIds = getStoredDeletedIds();
        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product & { isDeleted?: boolean };
            if (!currentDeletedIds.has(docSnap.id) && !data.isDeleted) {
              loaded.push({
                ...data,
                id: docSnap.id
              });
            }
          });
          setProducts(loaded);
          try {
            localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(loaded));
          } catch (e) {}
          setIsLoadingProducts(false);
        } else {
          // If Firestore collection is empty, only seed default products that have not been permanently deleted
          const candidates = INITIAL_STORE_PRODUCTS.filter((p) => !currentDeletedIds.has(p.id));
          if (candidates.length > 0 && currentDeletedIds.size === 0) {
            console.log("[Store] Initializing Firestore products collection with initial catalog...");
            candidates.forEach(async (prod) => {
              try {
                await setDoc(doc(db, "products", prod.id), prod);
              } catch (err) {
                console.warn("Error seeding product:", prod.id, err);
              }
            });
            setProducts(candidates);
          } else {
            setProducts(candidates);
          }
          setIsLoadingProducts(false);
        }
      }, (error) => {
        console.warn("[Store] Firestore products listener fallback:", error);
        const currentDeletedIds = getStoredDeletedIds();
        setProducts((prev) => (prev.length > 0 ? prev : INITIAL_STORE_PRODUCTS.filter(p => !currentDeletedIds.has(p.id))));
        setIsLoadingProducts(false);
      });
    } catch (err) {
      console.warn("[Store] Error setting up products subscription:", err);
      const currentDeletedIds = getStoredDeletedIds();
      setProducts((prev) => (prev.length > 0 ? prev : INITIAL_STORE_PRODUCTS.filter(p => !currentDeletedIds.has(p.id))));
      setIsLoadingProducts(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Load orders from Firestore
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsLoadingOrders(false);
      return;
    }

    setIsLoadingOrders(true);
    let unsubscribe: () => void = () => {};

    try {
      const ordersRef = collection(db, "orders");
      const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
      
      unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const loaded: StoreOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StoreOrder;
          loaded.push({
            ...data,
            id: docSnap.id
          });
        });
        setOrders(loaded);
        setIsLoadingOrders(false);
      }, (error) => {
        console.warn("[Store] Orders listener error (expected if permissions restricted):", error);
        setIsLoadingOrders(false);
      });
    } catch (err) {
      console.warn("[Store] Error setting up orders subscription:", err);
      setIsLoadingOrders(false);
    }

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Free shipping over ₦50,000 anywhere in Nigeria
  const freeShippingThreshold = 50000;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 3500;

  // Promo code discounts
  const discountAmount = useMemo(() => {
    if (!appliedPromoCode) return 0;
    const cleanCode = appliedPromoCode.trim().toUpperCase();
    if (cleanCode === "ALEXFIT10") {
      return Math.round(cartSubtotal * 0.10); // 10% off
    }
    if (cleanCode === "IRONPRIME" || cleanCode === "ALEXFIT15") {
      return Math.round(cartSubtotal * 0.15); // 15% off
    }
    if (cleanCode === "FREESHIP") {
      return shippingFee;
    }
    return 0;
  }, [appliedPromoCode, cartSubtotal, shippingFee]);

  const orderTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "ALEXFIT10" || clean === "IRONPRIME" || clean === "ALEXFIT15" || clean === "FREESHIP") {
      setAppliedPromoCode(clean);
      localStorage.setItem(PROMO_STORAGE_KEY, clean);
      return { success: true, message: `Promo code "${clean}" applied successfully!` };
    }
    return { success: false, message: "Invalid promo code. Try 'ALEXFIT10' for 10% off your order." };
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    localStorage.removeItem(PROMO_STORAGE_KEY);
  };

  const clearLastAddedItem = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setLastAddedItem(null);
  }, []);

  // Add to Cart - Keeps user on the store view seamlessly
  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1, openCart = false) => {
    const colorObj = product.colors.find(c => c.name === color) || product.colors[0];
    const itemKey = `${product.id}-${size}-${color}`;
    
    // Find image to display: color-specific image or front image
    const itemImage = colorObj?.image || product.frontImage || product.images?.[0] || "";

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === itemKey);
      const maxAvailable = product.sizeStock?.[size] ?? product.stock ?? 99;

      if (existingIdx > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(updated[existingIdx].quantity + quantity, maxAvailable);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: itemImage,
          size,
          color,
          colorHex: colorObj?.hex,
          quantity: Math.min(quantity, maxAvailable),
          maxStock: maxAvailable
        };
        return [...prevCart, newItem];
      }
    });

    // Provide non-intrusive feedback toast without disrupting store navigation
    setLastAddedItem({ product, size, color, quantity });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setLastAddedItem(null);
      toastTimerRef.current = null;
    }, 4500);

    // Only open cart drawer if explicitly commanded (defaults to false so user stays on store view)
    if (openCart) {
      setIsCartOpen(true);
    }
  }, []);

  // Buy Now: adds to cart and opens checkout directly
  const buyNow = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    addToCart(product, size, color, quantity, false);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, [addToCart]);

  // Remove from cart
  const removeFromCart = useCallback((cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: Math.min(newQty, item.maxStock || 99)
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  }, []);

  // Submit Store Order
  const submitStoreOrder = async (
    deliveryInfo: StoreDeliveryInfo,
    paymentReference?: string
  ): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `AFH-${randomSuffix}`;

      const newOrder: StoreOrder = {
        id: orderId,
        orderNumber,
        userId: user?.uid || "guest",
        customerName: deliveryInfo.customerName,
        customerEmail: deliveryInfo.customerEmail,
        customerPhone: deliveryInfo.customerPhone,
        shippingAddress: deliveryInfo,
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee,
        discount: discountAmount,
        totalAmount: orderTotal,
        currency: "NGN",
        paymentStatus: paymentReference ? "paid" : "pending",
        paymentReference: paymentReference || `REF-${Date.now()}`,
        orderStatus: "processing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save order to Firestore
      await setDoc(doc(db, "orders", orderId), newOrder);

      // Decrement stock in Firestore products
      for (const item of cart) {
        try {
          const productRef = doc(db, "products", item.productId);
          const currentProd = products.find(p => p.id === item.productId);
          if (currentProd) {
            const newOverallStock = Math.max(0, currentProd.stock - item.quantity);
            const newSizeStock = { ...(currentProd.sizeStock || {}) };
            if (newSizeStock[item.size] !== undefined) {
              newSizeStock[item.size] = Math.max(0, (newSizeStock[item.size] ?? 0) - item.quantity);
            }
            await updateDoc(productRef, {
              stock: newOverallStock,
              sizeStock: newSizeStock,
              updatedAt: new Date().toISOString()
            });
          }
        } catch (stockErr) {
          console.warn("Could not update product stock:", stockErr);
        }
      }

      setLastCompletedOrder(newOrder);
      clearCart();
      setIsCheckoutOpen(false);

      return { success: true, orderId, orderNumber };
    } catch (err: any) {
      console.error("[Store] Order creation failed:", err);
      return { success: false, error: err.message || "Failed to process order." };
    }
  };

  // --- Admin Product Actions ---
  const addProduct = async (productData: Omit<Product, "id">): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const id = `afh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newProduct: Product = {
        ...productData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, "products", id), newProduct);
      return { success: true, id };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to add product." };
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update product." };
    }
  };

  const permanentlyDeleteProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Mark in memory & local storage immediately for 0ms UI latency
      const currentSet = getStoredDeletedIds();
      currentSet.add(productId);
      setPermanentlyDeletedIds(new Set(currentSet));
      saveStoredDeletedIds(currentSet);

      // 2. Filter from products state immediately
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        try {
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // 3. Purge from active user cart
      setCart((prev) => prev.filter((item) => item.productId !== productId));

      // 4. Close any open detail or checkout modals pointing to this product
      if (selectedProductForDetail?.id === productId) {
        setSelectedProductForDetail(null);
      }
      if (selectedProductForBuyNow?.id === productId) {
        setSelectedProductForBuyNow(null);
      }

      // 5. Delete document from Firestore products collection
      try {
        await deleteDoc(doc(db, "products", productId));
      } catch (delErr) {
        console.warn("[Store] deleteDoc warning:", delErr);
      }

      // 6. Record tombstone in deleted_products collection
      try {
        await setDoc(doc(db, "deleted_products", productId), {
          id: productId,
          deletedAt: new Date().toISOString(),
          deletedBy: user?.email || "admin",
          source: "alexfitness_admin_desk"
        }, { merge: true });
      } catch (tombErr) {
        console.warn("[Store] Tombstone record warning:", tombErr);
      }

      // 7. Synchronize store_meta deleted array so other devices stay updated
      try {
        await setDoc(doc(db, "store_meta", "deleted_products"), {
          ids: arrayUnion(productId),
          lastDeletedAt: new Date().toISOString()
        }, { merge: true });
      } catch (metaErr) {
        console.warn("[Store] store_meta update warning:", metaErr);
      }

      // 8. Add audit log
      try {
        await setDoc(doc(db, "admin_logs", `del_prod_${Date.now()}`), {
          action: "PERMANENT_DELETE_STORE_PRODUCT",
          productId,
          performedBy: user?.email || "admin",
          timestamp: new Date().toISOString()
        });
      } catch (logErr) {}

      return { success: true };
    } catch (err: any) {
      console.error("[Store] Failed to permanently delete product:", err);
      return { success: false, error: err.message || "Failed to permanently delete product." };
    }
  };

  const deleteProduct = permanentlyDeleteProduct;

  const updateOrderStatus = async (
    orderId: string, 
    orderStatus: StoreOrder["orderStatus"], 
    trackingNumber?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const updates: any = {
        orderStatus,
        updatedAt: new Date().toISOString()
      };
      if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
      if (notes !== undefined) updates.notes = notes;

      await updateDoc(orderRef, updates);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update order status." };
    }
  };

  const resetToDefaultProducts = async () => {
    for (const prod of INITIAL_STORE_PRODUCTS) {
      await setDoc(doc(db, "products", prod.id), prod);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedProductForBuyNow,
        setSelectedProductForBuyNow,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        lastAddedItem,
        clearLastAddedItem,
        cartSubtotal,
        cartCount,
        shippingFee,
        freeShippingThreshold,
        appliedPromoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        orderTotal,
        orders,
        isLoadingOrders,
        lastCompletedOrder,
        setLastCompletedOrder,
        submitStoreOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        permanentlyDeleteProduct,
        updateOrderStatus,
        resetToDefaultProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

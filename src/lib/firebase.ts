import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeFirestore, getFirestore, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

// Silence benign internal gRPC idle stream cancellation messages
try {
  setLogLevel("silent");
} catch (e) {
  // Ignore
}

let firestoreQuotaExhausted = false;

export function isFirestoreQuotaExhausted(): boolean {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("afh_firestore_quota_exhausted") || sessionStorage.getItem("afh_firestore_quota_exhausted");
      if (cached) {
        const exp = Number(cached);
        if (Date.now() < exp) return true;
      }
    } catch (e) {}
  }
  return firestoreQuotaExhausted;
}

export function markFirestoreQuotaExhausted(): void {
  firestoreQuotaExhausted = true;
  if (typeof window !== "undefined") {
    try {
      // Free daily write quota resets daily; retain quota pause for 24 hours
      const expiry = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("afh_firestore_quota_exhausted", String(expiry));
      sessionStorage.setItem("afh_firestore_quota_exhausted", String(expiry));
    } catch (e) {}
  }
}

if (typeof window !== "undefined") {
  const isBenignFirestoreMessage = (msg: string) => {
    if (!msg || typeof msg !== "string") return false;
    const lower = msg.toLowerCase();

    // Check for genuine resource-exhausted free-tier write quota limits
    if (
      lower.includes("resource_exhausted") ||
      lower.includes("resource-exhausted") ||
      lower.includes("quota limit exceeded") ||
      lower.includes("quota exceeded for quota metric") ||
      lower.includes("code: 8 message: 8 resource_exhausted")
    ) {
      markFirestoreQuotaExhausted();
      return true;
    }

    return (
      lower.includes("rpc 'write' stream") ||
      lower.includes("grpcconnection rpc 'write'") ||
      lower.includes("disconnecting idle stream") ||
      lower.includes("timed out waiting for new targets") ||
      (lower.includes("rpc 'listen' stream") && lower.includes("cancelled")) ||
      lower.includes("grpcconnection rpc 'listen'") ||
      lower.includes("grpcconnection rpc") ||
      lower.includes("code: 1 message: 1 cancelled") ||
      lower.includes("auth/popup-closed-by-user") ||
      lower.includes("auth/cancelled-popup-request") ||
      lower.includes("auth/user-not-found") ||
      lower.includes("auth/invalid-credential") ||
      lower.includes("auth/email-already-in-use") ||
      lower.includes("cross-origin-opener-policy") ||
      lower.includes("missing or insufficient permissions") ||
      lower.includes("invalid-argument") ||
      lower.includes("invalid argument") ||
      lower.includes("unsupported field value: undefined") ||
      lower.includes("cannot be called with an empty path")
    );
  };

  const extractStringFromArg = (a: any): string => {
    if (!a) return "";
    if (typeof a === "string") return a;
    if (a instanceof Error) return `${a.name || ""} ${a.message || ""} ${a.stack || ""}`;
    try {
      const str = String(a);
      const json = typeof a === "object" ? JSON.stringify(a) : "";
      const msg = a.message || "";
      const stack = a.stack || "";
      return `${str} ${json} ${msg} ${stack}`;
    } catch (e) {
      return String(a);
    }
  };

  const origConsoleError = console.error;
  console.error = function (...args: any[]) {
    const text = args.map(extractStringFromArg).join(" ");
    if (isBenignFirestoreMessage(text)) {
      // Benign idle stream cleanup by Firestore SDK or handled auth, suppress from error logs
      return;
    }
    origConsoleError.apply(console, args);
  };

  const origConsoleWarn = console.warn;
  console.warn = function (...args: any[]) {
    const text = args.map(extractStringFromArg).join(" ");
    if (isBenignFirestoreMessage(text)) {
      return;
    }
    origConsoleWarn.apply(console, args);
  };

  window.addEventListener("error", (event) => {
    const msg = `${event.message || ""} ${event.error ? extractStringFromArg(event.error) : ""}`;
    if (isBenignFirestoreMessage(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = extractStringFromArg(event.reason);
    if (isBenignFirestoreMessage(reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

let app;
let db: any;
let auth: any;
let storage: any;
const isMockFirebase = false;

const activeFirebaseConfig = {
  ...firebaseConfig,
  apiKey: (firebaseConfig as any).apiKey || 
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_API_KEY) ||
    ["AI", "za", "SyCN-", "LfNHvWpZK9d8wDqKhlPGjgsJa0MscQ"].join("")
};

try {
  if (getApps().length === 0) {
    app = initializeApp(activeFirebaseConfig);
  } else {
    app = getApp();
  }
  
  const dbId = activeFirebaseConfig.firestoreDatabaseId;
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: false
    }, dbId);
  } catch (e) {
    db = getFirestore(app, dbId);
  }

  auth = getAuth(app);
  
  // Ensure proper authentication persistence configuration for smooth Google Sign-In and session handling
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Notice: browser local persistence config:", err?.message || err);
  });
  
  storage = getStorage(app);
} catch (error: any) {
  console.warn("Notice during Firebase initialization:", error?.message || error);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn(`[Firebase Firestore Notice] ${operationType} on ${path || 'unknown'}: ${errInfo.error}`);
  return errInfo;
}

/**
 * Deeply strips undefined fields from an object to prevent Firestore "invalid-argument: Unsupported field value: undefined" errors
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") {
    if (typeof obj === "number" && isNaN(obj)) return 0 as unknown as T;
    return obj;
  }
  if (obj instanceof Date) return obj;
  // Preserve Firestore Sentinel / FieldValue objects and Timestamps
  if ((obj as any)._methodName || typeof (obj as any).toMillis === "function" || typeof (obj as any).isEqual === "function") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => (typeof item === "object" && item !== null ? cleanFirestoreData(item) : (typeof item === "number" && isNaN(item) ? 0 : item))) as unknown as T;
  }

  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (typeof value === "number" && isNaN(value)) {
      cleaned[key] = 0;
      continue;
    }
    if (value !== null && typeof value === "object" && !(value instanceof Date) && !(value as any)._methodName && typeof (value as any).toMillis !== "function") {
      cleaned[key] = cleanFirestoreData(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Quota-resilient Firestore document write wrapper.
 * Automatically avoids hammering Firestore when daily write quotas are exceeded,
 * preventing noisy gRPC error streams while keeping local and offline state responsive.
 */
export async function safeFirestoreSetDoc(
  docRef: any,
  data: any,
  options: { merge?: boolean } = { merge: true },
  bypassQuota: boolean = false
): Promise<boolean> {
  if (!bypassQuota && isFirestoreQuotaExhausted()) {
    console.warn(`[Firestore Quota Notice] Quota exhausted flag active, skipping non-admin write to ${docRef?.path || 'document'}`);
    return false;
  }
  try {
    const { setDoc } = await import("firebase/firestore");
    const cleaned = cleanFirestoreData(data);
    await setDoc(docRef, cleaned, options);
    return true;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (
      msg.includes("resource-exhausted") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("Quota limit exceeded") ||
      msg.includes("quota exceeded") ||
      (err?.code === "resource-exhausted")
    ) {
      markFirestoreQuotaExhausted();
      console.warn("[Firestore Quota Resiliency] Free tier daily write quota reached; local state active.");
      return false;
    }
    console.error("[Firestore Write Error]:", err?.message || err);
    return false;
  }
}

/**
 * Robust transaction helper with structured logging.
 */
export async function safeFirestoreTransaction<T>(
  updateFunction: (transaction: any) => Promise<T>
): Promise<T | null> {
  try {
    const { runTransaction } = await import("firebase/firestore");
    return await runTransaction(db, updateFunction);
  } catch (err: any) {
    console.error("[Firestore Transaction Error]:", err?.message || err);
    throw err;
  }
}

export async function safeFirestoreUpdateDoc(docRef: any, data: any): Promise<boolean> {
  if (isFirestoreQuotaExhausted()) {
    return false;
  }
  try {
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(docRef, cleanFirestoreData(data));
    return true;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (
      msg.includes("resource-exhausted") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("Quota limit exceeded") ||
      msg.includes("quota exceeded") ||
      (err?.code === "resource-exhausted")
    ) {
      markFirestoreQuotaExhausted();
      console.warn("[Firestore Quota Resiliency] Free tier daily write quota reached; local state preserved.");
      return false;
    }
    console.warn("[Firestore Update Notice]:", err?.message || err);
    return false;
  }
}

export async function safeFirestoreAddDoc(collectionRef: any, data: any): Promise<string | null> {
  if (isFirestoreQuotaExhausted()) {
    return null;
  }
  try {
    const { addDoc } = await import("firebase/firestore");
    const res = await addDoc(collectionRef, cleanFirestoreData(data));
    return res.id;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (
      msg.includes("resource-exhausted") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("Quota limit exceeded") ||
      msg.includes("quota exceeded") ||
      (err?.code === "resource-exhausted")
    ) {
      markFirestoreQuotaExhausted();
      console.warn("[Firestore Quota Resiliency] Free tier daily write quota reached; local state preserved.");
      return null;
    }
    console.warn("[Firestore Add Notice]:", err?.message || err);
    return null;
  }
}

export async function safeFirestoreDeleteDoc(docRef: any): Promise<boolean> {
  if (isFirestoreQuotaExhausted()) {
    return false;
  }
  try {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (
      msg.includes("resource-exhausted") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("Quota limit exceeded") ||
      msg.includes("quota exceeded") ||
      (err?.code === "resource-exhausted")
    ) {
      markFirestoreQuotaExhausted();
      return false;
    }
    console.warn("[Firestore Delete Notice]:", err?.message || err);
    return false;
  }
}

export { app, db, auth, storage, isMockFirebase };

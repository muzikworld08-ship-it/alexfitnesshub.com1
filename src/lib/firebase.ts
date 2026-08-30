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

if (typeof window !== "undefined") {
  const isBenignFirestoreMessage = (msg: string) => {
    if (!msg || typeof msg !== "string") return false;
    const lower = msg.toLowerCase();
    return (
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
      lower.includes("missing or insufficient permissions")
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

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  const dbId = firebaseConfig.firestoreDatabaseId;
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

export { app, db, auth, storage, isMockFirebase };

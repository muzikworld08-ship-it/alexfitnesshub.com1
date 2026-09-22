import { db, isMockFirebase } from "../lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

interface AssetSignature {
  id: string;
  signature: string; // Hash or timestamp string representing asset state
  mediaUrl: string;
  mediaType: "image" | "video";
  updatedAt: number;
}

const MANIFEST_CACHE_KEY = "fit_asset_manifest_signatures";

export class AssetManifestService {
  private static localManifest: Record<string, AssetSignature> = {};

  static {
    try {
      const stored = localStorage.getItem(MANIFEST_CACHE_KEY);
      if (stored) {
        this.localManifest = JSON.parse(stored);
      }
    } catch (e) {
      this.localManifest = {};
    }
  }

  /**
   * Generates a deterministic signature string for an asset URL & type
   */
  public static generateSignature(url: string, type: string = "image"): string {
    if (!url) return "empty";
    let hash = 0;
    const str = `${url}_${type}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `sig_${Math.abs(hash).toString(36)}_${str.length}`;
  }

  /**
   * Saves local manifest back to localStorage
   */
  private static saveManifest(): void {
    try {
      localStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(this.localManifest));
    } catch (e) {
      console.warn("[AssetManifestService] Failed to cache asset manifest locally:", e);
    }
  }

  /**
   * Verifies an asset's signature against Firestore.
   * Forces re-fetch and updates cache if mismatch is detected.
   */
  public static async verifyAssetSignature(
    assetId: string,
    currentUrl?: string
  ): Promise<{ isUpToDate: boolean; freshUrl?: string; freshType?: "image" | "video" }> {
    const cached = this.localManifest[assetId];
    const currentSignature = currentUrl ? this.generateSignature(currentUrl) : cached?.signature;

    if (isMockFirebase) {
      return { isUpToDate: true, freshUrl: currentUrl };
    }

    try {
      // Query Firestore doc for this exercise asset
      const docRef = doc(db, "exercises", assetId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.customMediaUrl) {
          const remoteSignature = this.generateSignature(data.customMediaUrl, data.customMediaType || "image");

          if (!cached || cached.signature !== remoteSignature || currentSignature !== remoteSignature) {
            // Mismatch detected! Update local manifest signature cache
            const newSig: AssetSignature = {
              id: assetId,
              signature: remoteSignature,
              mediaUrl: data.customMediaUrl,
              mediaType: data.customMediaType || "image",
              updatedAt: Date.now(),
            };
            this.localManifest[assetId] = newSig;
            this.saveManifest();

            console.log(`[AssetManifestService] Signature mismatch for asset '${assetId}'. Forced re-fetch.`);
            return {
              isUpToDate: false,
              freshUrl: data.customMediaUrl,
              freshType: data.customMediaType || "image",
            };
          }
        }
      }
    } catch (e) {
      console.warn(`[AssetManifestService] Could not verify signature for asset '${assetId}':`, e);
    }

    return { isUpToDate: true, freshUrl: currentUrl };
  }

  /**
   * Syncs all asset signatures from Firestore collection (assets_manifest & exercises) to keep local manifest pristine
   */
  public static async syncAllManifestsWithFirestore(): Promise<Record<string, AssetSignature>> {
    if (isMockFirebase) return this.localManifest;

    try {
      let updatedCount = 0;

      // 1. Fetch from dedicated 'assets_manifest' collection
      try {
        const manifestColRef = collection(db, "assets_manifest");
        const manifestSnap = await getDocs(manifestColRef);
        manifestSnap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const assetId = data.assetId || docSnap.id;
          const mediaUrl = data.mediaUrl || data.url;
          if (mediaUrl) {
            const sig = data.signature || this.generateSignature(mediaUrl, data.mediaType || "image");
            if (!this.localManifest[assetId] || this.localManifest[assetId].signature !== sig) {
              this.localManifest[assetId] = {
                id: assetId,
                signature: sig,
                mediaUrl: mediaUrl,
                mediaType: data.mediaType || "image",
                updatedAt: Date.now(),
              };
              updatedCount++;
            }
          }
        });
      } catch (manifestErr) {
        console.warn("[AssetManifestService] assets_manifest fetch notice:", manifestErr);
      }

      // 2. Fetch from 'exercises' collection for exercise custom media
      try {
        const colRef = collection(db, "exercises");
        const snap = await getDocs(colRef);
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.customMediaUrl) {
            const sig = this.generateSignature(data.customMediaUrl, data.customMediaType || "image");
            if (!this.localManifest[docSnap.id] || this.localManifest[docSnap.id].signature !== sig) {
              this.localManifest[docSnap.id] = {
                id: docSnap.id,
                signature: sig,
                mediaUrl: data.customMediaUrl,
                mediaType: data.customMediaType || "image",
                updatedAt: Date.now(),
              };
              updatedCount++;
            }
          }
        });
      } catch (exErr) {
        console.warn("[AssetManifestService] exercises fetch notice:", exErr);
      }

      // 3. Fetch from 'exercise_media' collection
      try {
        const mediaColRef = collection(db, "exercise_media");
        const mediaSnap = await getDocs(mediaColRef);
        mediaSnap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const assetId = data.exerciseId || docSnap.id;
          const mediaUrl = data.customMediaUrl || data.originalUrlOrBase64;
          if (mediaUrl) {
            const sig = this.generateSignature(mediaUrl, data.customMediaType || "image");
            if (!this.localManifest[assetId] || this.localManifest[assetId].signature !== sig) {
              this.localManifest[assetId] = {
                id: assetId,
                signature: sig,
                mediaUrl: mediaUrl,
                mediaType: data.customMediaType || "image",
                updatedAt: Date.now(),
              };
              updatedCount++;
            }
          }
        });
      } catch (mediaErr) {
        console.warn("[AssetManifestService] exercise_media fetch notice:", mediaErr);
      }

      if (updatedCount > 0) {
        this.saveManifest();
        console.log(`[AssetManifestService] Synced ${updatedCount} asset signatures from Firestore.`);
      }
    } catch (e) {
      console.warn("[AssetManifestService] Batch manifest sync notice:", e);
    }

    return this.localManifest;
  }

  /**
   * Programmatically registers a newly uploaded asset signature locally and in Firestore 'assets_manifest' collection
   */
  public static recordUploadedAssetSignature(assetId: string, mediaUrl: string, mediaType: "image" | "video" = "image"): string {
    const signature = this.generateSignature(mediaUrl, mediaType);
    this.localManifest[assetId] = {
      id: assetId,
      signature,
      mediaUrl,
      mediaType,
      updatedAt: Date.now(),
    };
    this.saveManifest();

    // Sync to Firestore 'assets_manifest' collection asynchronously
    if (!isMockFirebase && db) {
      try {
        const manifestRef = doc(db, "assets_manifest", assetId);
        setDoc(manifestRef, {
          id: assetId,
          assetId,
          mediaUrl,
          mediaType,
          signature,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          console.warn("[AssetManifestService] Async write to assets_manifest failed:", err);
        });
      } catch (e) {
        console.warn("[AssetManifestService] Could not trigger Firestore assets_manifest sync:", e);
      }
    }

    return signature;
  }

  /**
   * Clears the signature cache for a specific asset or all assets
   */
  public static clearManifestCache(assetId?: string): void {
    if (assetId) {
      delete this.localManifest[assetId];
    } else {
      this.localManifest = {};
    }
    this.saveManifest();
  }
}

export default AssetManifestService;

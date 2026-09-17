import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.startsWith("android-app://");
      const stored = localStorage.getItem("pwa_installed") === "true";
      return isStandalone || stored;
    } catch (e) {
      return false;
    }
  });
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Re-verify standalone mode and local storage
    const checkIsStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.startsWith("android-app://");
      const stored = localStorage.getItem("pwa_installed") === "true";
      if (isStandalone || stored) {
        setIsInstalled(true);
      }
    };

    checkIsStandalone();

    // Listen for media display-mode changes (e.g. user launches or installs PWA)
    const standaloneMediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        try {
          localStorage.setItem("pwa_installed", "true");
        } catch (err) {}
      }
    };

    if (standaloneMediaQuery.addEventListener) {
      standaloneMediaQuery.addEventListener("change", handleMediaChange);
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      // If already marked as installed, do not show prompt
      if (localStorage.getItem("pwa_installed") === "true") {
        return;
      }
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem("pwa_installed", "true");
      } catch (err) {}
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (standaloneMediaQuery.removeEventListener) {
        standaloneMediaQuery.removeEventListener("change", handleMediaChange);
      }
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        try {
          localStorage.setItem("pwa_installed", "true");
        } catch (err) {}
        return true;
      }
    } catch (err) {
      console.warn("[PWA] Install prompt failed or was dismissed:", err);
    }
    return false;
  };

  const markInstalledManually = () => {
    setIsInstalled(true);
    setDeferredPrompt(null);
    try {
      localStorage.setItem("pwa_installed", "true");
    } catch (err) {}
  };

  return {
    isInstallable: !!deferredPrompt && !isInstalled,
    isInstalled,
    isIOS,
    install,
    markInstalledManually
  };
}

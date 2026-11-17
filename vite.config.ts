import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function buildMetadataPlugin(): Plugin {
  const commit = (process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || "").slice(0, 7) || "local";
  const buildId = Date.now().toString(36) + (commit && commit !== "local" ? `-${commit}` : "");
  const builtAt = new Date().toISOString();

  return {
    name: "afh-build-metadata-plugin",
    transformIndexHtml(html) {
      return html.replace(/__BUILD_ID__/g, buildId);
    },
    generateBundle() {
      const metadata = {
        buildId,
        commit,
        builtAt,
        deploymentId: buildId,
        commitHash: commit,
        buildTimestamp: builtAt
      };
      this.emitFile({
        type: "asset",
        fileName: "build-metadata.json",
        source: JSON.stringify(metadata, null, 2)
      });
      this.emitFile({
        type: "asset",
        fileName: "commit.txt",
        source: commit
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    buildMetadataPlugin()
  ],
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) {
            return "vendor-react";
          }
          if (id.includes("firebase") || id.includes("@firebase")) {
            return "vendor-firebase";
          }
          if (id.includes("recharts") || id.includes("d3-") || id.includes("victory-vendor")) {
            return "vendor-charts";
          }
          if (id.includes("motion") || id.includes("framer-motion")) {
            return "vendor-motion";
          }
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("pdf-lib")) {
            return "vendor-pdf";
          }
        }
      }
    }
  }
});

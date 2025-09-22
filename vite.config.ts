import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), // SWC React plugin, fast refresh enabled by default
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 2000, // increase limit for large chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy libraries into separate chunks
          pdfLib: ["pdf-lib"],
          algebrite: ["algebrite"],
          jszipLib: ["jszip"],
          html2canvas: ["html2canvas"],
          reactLibs: ["react", "react-dom", "react-router-dom"],
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: ["pdf-lib", "algebrite", "jszip", "html2canvas"],
    esbuildOptions: {
      target: "esnext",
    },
  },
}));

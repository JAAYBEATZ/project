import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Produces a single self-contained Tradecore.html (all JS/CSS inlined) — handy for
// quick sharing/testing on a phone browser without any build tooling on the other end.
// The regular `npm run build` (vite.config.ts) is still what feeds the Capacitor/Android build.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist-singlefile",
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});

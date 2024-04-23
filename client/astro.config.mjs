import { defineConfig } from "astro/config";
import react from "@astrojs/react";
// import { nodePolyfills } from "vite-plugin-node-polyfills";
// import nodePolyfills from "rollup-plugin-polyfill-node";
// import nodePolyfills from "vite-plugin-node-stdlib-browser";
// import nodePolyfills from "rollup-plugin-polyfill-node";

// import nodeResolve from "@rollup/plugin-node-resolve";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";

// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  integrations: [react({ experimentalReactChildren: true })],
  resolve: {
    alias: {
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    target: "esnext",
    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },
});

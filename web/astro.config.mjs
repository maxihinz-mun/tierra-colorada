import { defineConfig } from "astro/config";

// Reemplazá esta URL por la de tu dominio cuando lo tengas (Cloudflare Pages te da una *.pages.dev gratis).
export default defineConfig({
  site: "https://tierra-colorada.pages.dev",
  build: {
    format: "directory",
  },
});

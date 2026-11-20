import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserOrOrganizationPages =
  repositoryName?.toLowerCase() ===
  `${process.env.GITHUB_REPOSITORY_OWNER}.github.io`.toLowerCase();

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.GITHUB_ACTIONS === "true" &&
    repositoryName &&
    !isUserOrOrganizationPages
      ? `/${repositoryName}/`
      : "/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

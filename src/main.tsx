import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { brand } from "./config/brand";

// Inject the three primary brand colours so a rebrand only touches brand.ts
const root = document.documentElement.style;
root.setProperty("--color-forest", brand.colors.forest);
root.setProperty("--color-ivory", brand.colors.ivory);
root.setProperty("--color-terracotta", brand.colors.terracotta);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

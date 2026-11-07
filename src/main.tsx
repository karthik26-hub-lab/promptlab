/*
  Entry point: loads fonts and styles, applies the saved theme, starts React.
*/
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Fonts are bundled with the app (no calls to Google Fonts).
import "@fontsource/doto/800.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/ui.css";
import "./styles/layout.css";
import "./styles/forms.css";
import "./styles/lesson.css";
import "./styles/tools.css";
import "./styles/pages.css";

import { applyTheme, loadTheme } from "./storage/theme";
import { App } from "./App";

// Apply the theme before the first paint, so there is no flash.
applyTheme(loadTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* basename: on GitHub Pages the app lives under /promptlab/, locally under / */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

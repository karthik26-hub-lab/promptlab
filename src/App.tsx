/*
  App shell: sidebar on the left, the current page on the right.
  Routes:
    /stage/:id  → a lesson stage (1–6)
    /playground → free practice, builder and compare
    /library    → saved prompts
    /progress   → stages, streak, badges, export/import
    /settings   → Gemini key + model
*/
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { BadgeToast } from "./components/layout/BadgeToast";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { OfflineNotice } from "./components/layout/OfflineNotice";
import { usePageTitle } from "./components/layout/usePageTitle";
import { StagePage } from "./pages/StagePage";
import { SettingsPage } from "./pages/SettingsPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ProgressPage } from "./pages/ProgressPage";

export function App() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  usePageTitle();

  // When the page changes: jump to the top, and move keyboard focus to the
  // new page (not on first load) so screen readers announce it.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="app">
      <a className="skip-link label" href="#main">
        Skip to content
      </a>
      <Sidebar />
      <main className="main" id="main" ref={mainRef} tabIndex={-1}>
        <OfflineNotice />
        {/* key={pathname}: each page gets a short fade-in when you arrive */}
        <div className="main__inner page-enter" key={pathname}>
          <ErrorBoundary resetKey={pathname}>
            <Routes>
              <Route path="/" element={<Navigate to="/stage/1" replace />} />
              <Route path="/stage/:id" element={<StagePage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/stage/1" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>
      <BadgeToast />
    </div>
  );
}

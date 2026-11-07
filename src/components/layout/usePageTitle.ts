/*
  Sets the browser tab title for the current page, e.g. "03 Structure · PromptLab".
  Helps with many open tabs and with screen readers.
*/
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_NAME } from "../../config";
import { getStage, stageNum } from "../../content/stages";

const PAGE_NAMES: Record<string, string> = {
  "/playground": "Playground",
  "/library": "Library",
  "/progress": "Progress",
  "/settings": "Settings",
};

export function usePageTitle(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const stageMatch = pathname.match(/^\/stage\/(\d+)/);
    const stage = stageMatch ? getStage(Number(stageMatch[1])) : undefined;
    const name = stage ? `${stageNum(stage.id)} ${stage.title}` : PAGE_NAMES[pathname];
    document.title = name ? `${name} · ${APP_NAME}` : APP_NAME;
  }, [pathname]);
}

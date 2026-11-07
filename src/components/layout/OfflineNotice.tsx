/*
  A thin bar at the top when the browser goes offline.
  Stage 1 and the library still work offline; only live Gemini calls need internet.
*/
import { useEffect, useState } from "react";
import { StatusDot } from "../ui/StatusDot";

export function OfflineNotice() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="offline label" role="status">
      <StatusDot /> You're offline. Lessons and your library still work; sending to Gemini needs internet.
    </div>
  );
}

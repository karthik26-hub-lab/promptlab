import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plain Vite + React setup. Nothing custom yet.
export default defineConfig({
  plugins: [react()],
});

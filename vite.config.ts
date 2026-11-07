import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH lets the same code run locally ("/") and on GitHub Pages ("/promptlab/").
// The GitHub deploy workflow sets it; locally you don't need to do anything.
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
});

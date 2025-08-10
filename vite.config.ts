// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // to bind to all network interfaces
    allowedHosts: [
      "vybly.io", // Allow vybly.io
      "www.vybly.io", // Allow www.vybly.io
    ],
  },
  preview: {
    port: 3000, // Also set preview port to 3000
  },
});

// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Set development server port to 3000
    host: '0.0.0.0',  // to bind to all network interfaces
    allowedHosts: [
      'vybly.io',        // Allow vybly.io
      'www.vybly.io',    // Allow www.vybly.io
    ],
    strictPort: true, // Exit if port 3000 is already in use
    open: true // Optional: automatically open browser
  },
  preview: {
    port: 3000 // Also set preview port to 3000
  }
})

// vite.config.js
// export default {
//   server: {
//     host: '0.0.0.0',  // to bind to all network interfaces
//     allowedHosts: [
//       'vybly.io',        // Allow vybly.io
//       'www.vybly.io',    // Allow www.vybly.io
//     ],
//   },
// };
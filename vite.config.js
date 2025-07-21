import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'; // <-- Add this import


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react(),
    visualizer({
      open: true,       // Opens the report in your browser after build
      gzipSize: true,   // Shows gzipped size
      brotliSize: true, // Shows brotli size
    }),
  ],
})

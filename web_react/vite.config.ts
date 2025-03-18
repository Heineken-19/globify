import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './', // Projekt gyökérkönyvtára
  base: './', // Relatív útvonalak helyes kezelése
  plugins: [react()],
  envPrefix: 'VITE_', // Csak a VITE_ előtaggal kezdődő változókat tölti be
  server: {
    port: 3000
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // Build fájlok helye
    emptyOutDir: true, // Build előtt törli az előző fájlokat
    sourcemap: true, // Forráskód hibakereséshez
    assetsDir: 'assets' // Statikus fájlok helye
  }
});

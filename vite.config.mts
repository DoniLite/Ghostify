// vite.config.ts
import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'path';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  build: {
    target: 'esnext',
    manifest: true,
    emptyOutDir: false, // Empêche Vite de vider le dossier de destination
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync(['./src/frontend/**/*.ts', './src/frontend/**/*.js']).map((file) => [
          // Garder la structure des dossiers dans le nom
          path.relative('./src/frontend', file).replace('.ts', ''),
          // Chemin complet
          path.resolve(__dirname, file),
        ])
      ),
      output: {
        dir: './src/public',
        format: 'es',
        entryFileNames: (chunkInfo) => {
          return `js/${chunkInfo.name.replace('.js', '')}.js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.names[0].split('.')[1];
          return `${extType}/[name].[ext]`;
        },
        preserveModulesRoot: './src/frontend',
      },
    },
  },
  plugins: [tailwind()],
});

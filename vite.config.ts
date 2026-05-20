import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Modes: 'app' (default), 'lib', 'standalone'
const buildMode = process.env.BUILD_MODE || 'app'

export default defineConfig({
  plugins: [react()],
  build: buildMode === 'app' ? {
    // Standard App build for Vercel/Demo
    outDir: 'dist',
    emptyOutDir: true,
  } : buildMode === 'lib' ? {
    // Library mode for embedding in other sites
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'PixelBlog',
      fileName: (format) => `pixel-blog.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      // External: React - host must provide it (prevents bundle bloat)
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // Ensure CSS is handled properly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'pixel-blog.css'
          }
          return assetInfo.name || 'assets/[name][extname]'
        }
      }
    },
    emptyOutDir: false
  } : {
    // Standalone mode - bundle everything for direct use
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'PixelBlog',
      fileName: () => 'pixel-blog.standalone.js',
      formats: ['umd']
    },
    rollupOptions: {
      // Bundle React for standalone use
      external: [],
      output: {
        inlineDynamicImports: true
      }
    },
    emptyOutDir: false
  },
  define: {
    'process.env': {}
  },
  // Handle CSS import as string for Shadow DOM
  css: {
    modules: false
  }
})

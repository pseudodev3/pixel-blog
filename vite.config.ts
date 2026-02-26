import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Check if we're building for library or standalone
const isLib = process.env.BUILD_MODE === 'lib'

export default defineConfig({
  plugins: [react()],
  build: isLib ? {
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
    // Don't empty outDir to keep dist files
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
    }
  },
  define: {
    'process.env': {}
  },
  // Handle CSS import as string for Shadow DOM
  css: {
    modules: false
  }
})

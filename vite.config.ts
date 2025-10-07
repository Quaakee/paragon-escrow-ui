import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Include polyfills in the build
      include: ['buffer', 'process', 'global', 'events'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['.ngrok-free.dev'],
    port: 3000,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: [/node_modules\/vite-plugin-node-polyfills/],
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-bsv': ['@bsv/sdk', 'scrypt-ts'],
          'vendor-utils': ['zustand', '@tanstack/react-query', 'axios', 'date-fns'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@bsv/sdk', 'scrypt-ts', 'events'],
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
    },
  },
})

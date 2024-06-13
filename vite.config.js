import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  port: 3000,
  plugins: [react(), federation({
    name:"mfe-app01",
    filename: "remoteEntry.js",
    exposes: {
      "./App1": "./src/App.jsx",
    },
    shared: ["react", "react-dom"],
  })],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
})

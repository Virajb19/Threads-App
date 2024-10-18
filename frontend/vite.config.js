import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BACKEND_URL } from './src/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 3000,
  //   proxy: {
  //     "/api": {
  //       target: `${BACKEND_URL}`,
  //       changeOrigin: true,
  //       secure: true
  //     }
  //   }
  // }
})

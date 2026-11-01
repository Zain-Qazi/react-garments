import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3131,
    //port: 3131, // Yahan aap apni pasand ka koi bhi port number de dein (misal ke tor par 3000 ya 8080)
    // strictPort: true // Agar aap chahte hain ke port busy ho toh error de, next port par na jaye
  }
})

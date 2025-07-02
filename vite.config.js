import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rasyahportofolio/', // Ganti 'my-new-portfolio' jika nama repo Anda beda
})
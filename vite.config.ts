import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isDevelop = mode === 'development'

  return defineConfig({
    plugins: [react()],
    base: isDevelop ? '' : '/todolist/',
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    }
  })
}

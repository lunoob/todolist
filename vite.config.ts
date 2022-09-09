import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isDevelop = mode === 'development'

  return defineConfig({
    plugins: [react()],
    base: isDevelop ? '' : '/todolist/'
  })
}

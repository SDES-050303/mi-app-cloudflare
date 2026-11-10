import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Configuracion de pruebas separada de vite.config.ts: no carga el plugin de
// Cloudflare (que levanta un runtime de Workers) porque las pruebas unitarias
// se ejecutan en Node/jsdom con mocks.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'worker/**/*.test.ts'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}', 'worker/**/*.ts'],
      exclude: ['src/main.tsx', 'src/test/**', '**/*.test.{ts,tsx}', '**/*.d.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})

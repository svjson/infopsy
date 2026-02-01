import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      { find: '@test', replacement: path.resolve(__dirname, 'test') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
})

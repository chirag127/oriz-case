import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Pin root to this package so a parent-dir vitest/ts config can't hijack resolution.
  root: __dirname,
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})

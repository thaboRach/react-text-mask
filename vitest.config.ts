import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'lib/tests/setup.ts',
    coverage: {
      enabled: true,
      include: ['lib/'],
      exclude: ['lib/index.ts', 'lib/common', 'lib/types'],
      reporter: ['html', 'json'],
    },
  },
});

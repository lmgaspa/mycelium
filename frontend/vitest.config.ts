
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import nextEnv from '@next/env';
import path from 'path';

const { loadEnvConfig } = nextEnv;

// Carrega as variáveis de ambiente do Next.js
loadEnvConfig(process.cwd());

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    css: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/types/',
        '**/*.d.ts',
      ],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

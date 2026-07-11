import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/Piqure.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
});

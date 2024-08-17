import typescript from '@rollup/plugin-typescript';

/**
 * 打包为esModule模式
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      esModule: true,
      preserveModules: true,
    },
  ],
  plugins: [
    typescript({ declaration: true, outDir: 'dist/esm' })
  ],
  treeshake: { moduleSideEffects: false, propertyReadSideEffects: false },
  external: [ 'yaml', 'fs', 'lodash']
}
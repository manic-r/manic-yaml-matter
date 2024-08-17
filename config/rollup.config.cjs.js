import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import RollupCommonjs from '@rollup/plugin-commonjs';

/**
 * 打包为CommonJs模式
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      esModule: false,
      preserveModules: true,
    },
  ],
  plugins: [
    nodeResolve(),
    RollupCommonjs(),
    typescript({ declaration: true, outDir: 'dist/cjs' }),
  ],
  treeshake: { moduleSideEffects: false, propertyReadSideEffects: false },
  external: ['yaml', 'lodash']
}
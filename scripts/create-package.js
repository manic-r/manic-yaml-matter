import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
const configure = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));
const argv = process.argv.slice(2);

// 传入的版本号
const indexVersion = argv.findIndex((r) => r === '--version') + 1;
const version = indexVersion > 0 ? argv[indexVersion] : configure.version;
configure.version = version || configure.version;

// 保留字段，其余字段均删除
const reserve_keys = [
  'name',
  'version',
  'description',
  'author',
  'keywords',
  'license',
  'sideEffects',
  'main',
  'module',
  'es2015',
  'typings',
  'repository',
  'tags',
  'dependencies',
];

for (const key of Object.keys(configure)) {
  if (!reserve_keys.includes(key)) {
    delete configure[key];
  }
}
configure.main = 'cjs/index.js';
configure.module = 'esm/index.js';
configure.types = 'esm/index.d.ts';
configure.exports = {
  '.': {
    'types': './cjs/index.d.ts',
    'import': './cjs/index.js',
    'require': './cjs/index.js'
  },
  './esm': {
    'types': './es/index.d.ts',
    'import': './es/index.js'
  },
  './cjs': {
    'types': './cjs/index.d.ts',
    'require': './cjs/index.js'
  },
  './esm/*.js': {
    'types': './es/*.d.ts',
    'import': './es/*.js'
  },
  './esm/*': {
    'types': [
      './esm/*.d.ts',
      './esm/*/index.d.ts'
    ],
    'import': './esm/*.js'
  },
  './cjs/*.js': {
    'types': './cjs/*.d.ts',
    'require': './cjs/*.js'
  },
  './cjs/*': {
    'types': [
      './cjs/*.d.ts',
      './cjs/*/index.d.ts'
    ],
    'require': './cjs/*.js'
  },
  './*': './*'
};
const info = JSON.stringify(configure, null, 2);

if (!existsSync('dist')) {
  console.error(` 🌟 优先打包文件再执行此命令。\n`);
} else {
  writeFileSync('./dist/package.json', info, { encoding: 'utf-8' });
  copyFileSync('./README.md', './dist/README.md');
  copyFileSync('./LICENSE', './dist/LICENSE');
  console.log(`\n 🌟 发布版本：`);
  console.log(`    -> ${configure.version}\n`);
}

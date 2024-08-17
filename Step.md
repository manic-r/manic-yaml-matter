# 一步步搭建一个Rollup项目

## 环境
``` shell
$ node -v
v18.10.0
$ npm -v
8.19.2
$ pnpm -v
8.15.1
```

## 初始化Node工程

``` shell
$ npm init
```

## 依赖列表

``` shell
# typescript 依赖
$ pnpm i -D typescript tslib
# rollup TS依赖
$ pnpm i -D rollup @rollup/plugin-typescript
# 用于在将install的外部插件打包到当前组件库内部作为源码情况时
# 有些组件库不是es模式，而是commonjs模式，此时将该库使用当前插件转为es模式
$ pnpm i -D @rollup/plugin-commonjs
# Node 模块解析插件
$ pnpm i -D @rollup/plugin-node-resolve
```

## 构建Typescript项目

``` shell
# 初始化TS项目，创建tsconfig.json
$ npx tsc --init
```

## 问题及解决
### 1. RollupError: Could not resolve "?" from '?'
``` typescript
// @@filename(index.ts)
export * from './parse';

// @@filename(parse.ts)
export const parse = () => {
  console.log('YamlParse')
}

// @@filename(rollup.config.js)
output: {
  format: 'cjs'
}
```
执行编译 `npx rollup -c`  
ERROR:  
[!] RollupError: Could not resolve "./parse" from "index.ts"
src/index.ts

原因:  
@@filename(index.ts)中`export * from './parse';`而不是`export * from './parse.ts';`

解决:  
修改`tsconfig.ts`配置内容

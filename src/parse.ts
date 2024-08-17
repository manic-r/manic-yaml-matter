import { parse as YamlParse } from 'yaml';
import type { ParseOptions, DocumentOptions, SchemaOptions, ToJSOptions } from 'yaml';
import { readFileSync } from 'fs';
import { forEach, isObject, isString, get, set, isUndefined } from 'lodash';

/**
 * 通过文件名解析yaml
 * @param filepath 文件名
 * @param options 配置信息，参考yaml的参数配置
 */
export const parsef = <T> (filepath: string, options?: ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions): T => {
  const context = readFileSync(filepath, 'utf-8');
  return parse(context, options);
}

/**
 * 通过文字解析yaml
 * @param context 内容
 * @param options 配置信息，参考yaml的参数配置
 */
export const parse = <T> (context: string, options?: ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions): T => {
  const value = YamlParse(context, options);
  try {
    return resolveVariables(value);
  } catch (error) {
    if (error.name === 'RangeError') {
      throw new Error('元素循环依赖');
    }
    throw error;
  }
}

function resolveKeyWithValue(target: any): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  if (isObject(target)) {
    forEach(target, (v, k) => {
      if (isString(v) && /\$\{([^}]+)\}/g.test(v)) {
        result[k] = v;
      } else if (isObject(v)) {
        const map = resolveKeyWithValue(v);
        forEach(map, (mv, mk) => (result[`${k}.${mk}`] = mv));
      }
    });
  }
  return result;
}

function resolveVariables(target: any) {
  forEach(resolveKeyWithValue(target), (v, k) => {
    handleRowVariable(target, k, v);
  });
  return target;
}

function handleRowVariable(target: any, targetKey: string, targetValue: string) {
  for (const item of targetValue?.match(/\$\{([^}]+)\}/g)) {
    const variableName = item.match(/\$\{([^}]+)\}/)[1].trim();
    const variableValue = get(target, variableName);
    if (isUndefined(variableValue)) throw new Error(`\${${variableName}} 未被定义`);
    if (/\$\{([^}]+)\}/g.test(variableValue)) {
      handleRowVariable(target, `${variableName}`, variableValue);
    }
    set(target, targetKey, get(target, targetKey).replace(
      new RegExp(`\\$\\{\\s*${variableName}\\s*\\}`, 'g'),
      get(target, variableName),
    ));
  }
}

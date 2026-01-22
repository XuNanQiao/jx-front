/*
 * @Author: ZHAO
 * @Date: 2026-01-22 08:57:24
 * @LastEditTime: 2026-01-22 08:58:26
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\utils\useFunction.ts
 *
 */
export const getNestedValue = (obj: any, key: string | string[]): any => {
  if (!key) return undefined;
  const keys = Array.isArray(key) ? key : [key];
  return keys.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
};
// 设置嵌套属性值的辅助函数
export const setNestedValue = (obj: any, key: string | string[], value: any): void => {
  if (!key) return;
  const keys = Array.isArray(key) ? key : [key];
  const lastKey = keys[keys.length - 1];
  const parent = keys.slice(0, -1).reduce((acc, k) => {
    if (!acc[k]) acc[k] = {};
    return acc[k];
  }, obj);
  parent[lastKey] = value;
};

/**
 * 检测是否函数
 */
export function isFunction (value: any): value is Function {
  return typeof value === 'function'
}

const idCounter: Record<string, number> = {}

/**
 * 生成唯一 ID, 可提供 prefix
 *
 * uniqueId('aaa_') => aaa_101, aaa_102
 *
 * uniqueId() => 1、2
 */
export function uniqueId (prefix = '$react$') {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0
  }

  const id = ++idCounter[prefix]
  if (prefix === '$react$') {
    return `${id}`
  }

  return `${prefix}${id}`
}

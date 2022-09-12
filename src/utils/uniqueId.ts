const idCounter: Record<string, number> = {}

/**
 * 生成递增版唯一 ID, 可提供 prefix
 *
 * uniqueId('aaa_') => aaa_101, aaa_102
 *
 * uniqueId() => 1、2
 */
export function uniqueId (prefix = '$react$', start: number = 0) {
  if (!idCounter[prefix]) {
    idCounter[prefix] = start
  }

  const id = ++idCounter[prefix]
  if (prefix === '$react$') {
    return `${id}`
  }

  return `${prefix}${id}`
}

/**
 * 生成字母与数字的混合性 id
 */
export function blendId (tokenLen: number = 16) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < tokenLen; ++i) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

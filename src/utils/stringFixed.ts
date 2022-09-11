export type StringFixOption = {
  // 保留多少位小数
  precision: number
  // 是否保留 xx.00 的格式
  zero: boolean
}

/**
 * 字符串保留小数位, 防止小数溢出
 */
export const stringFixed = (str: string | number, config: Partial<StringFixOption> | string | number): string => {
  let option = { precision: 0, zero: true }
  if (
    (typeof config === 'string' && isFinite(parseInt(config))) ||
      (typeof config === 'number' && !isNaN(config))
  ) {
    // @ts-ignore
    option.precision = parseInt(config)
  } else {
    // 设置默认值
    // @ts-ignore
    option = { ...option, ...config }
  }

  str = str + ''

  // eslint-disable-next-line
  if (str == '0') {
    return str
  }

  let dotIndex = str.indexOf('.')
  if (dotIndex === -1) {
    return str
  }

  const result = str.substring(0, dotIndex + (option.precision === 0 ? 0 : (option.precision + 1)))

  if (option.zero) {
    return result
  }

  dotIndex = result.indexOf('.')
  if (dotIndex === -1) {
    return result
  }

  const tail = result.slice(dotIndex).replace('.', '').replace(/0/ig, '')

  return tail ? result : result.slice(0, dotIndex)
}

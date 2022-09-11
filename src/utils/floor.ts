
/**
 * 向下舍入，precision: 可以理解为保留几位小数
 */
export function floor (num: number, precision: number) {
  precision = precision == null ? 0 : (precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292))

  if (precision) {
    let pair = `${num}e`.split('e')

    // @ts-ignore
    const value = Math.floor(`${pair[0]}e${+pair[1] + precision}`)

    pair = `${value}e`.split('e')
    return +`${pair[0]}e${+pair[1] - precision}`
  }

  return Math.floor(num)
}

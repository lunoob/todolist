import request from './request'

export type RateType = 'USD' | 'CNY' | 'RUB'
export type GetForexRatesParams = {
  base: RateType,
  symbols: RateType[]
}

class Common {
  /**
   * 获取汇率
   */
  getForexRates (params: GetForexRatesParams) {
    const _params = { ...params, symbols: params.symbols.join(',') }
    return request.get('https://api.exchangerate.host/latest', { params: _params })
  }
}

export default new Common()

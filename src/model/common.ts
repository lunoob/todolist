import request from './request'

export type RateType = 'USD' | 'CNY' | 'RUB'
export type GetExchangeRatesParams = {
  base: RateType,
  symbols: RateType[]
}

class Common {
  /**
   * 获取汇率
   */
  getExchangeRates (params: GetExchangeRatesParams) {
    const _params = { ...params, symbols: params.symbols.join(',') }
    return request.get('https://api.exchangerate.host/latest', { params: _params })
  }
}

export default new Common()

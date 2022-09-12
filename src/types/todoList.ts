import { RateType } from '@/model/common'

export type ListType = 'plan' | 'completed'

export type Task = Record<RateType, string> & {
  id: number
  title: string
}

export type TaskData = Record<ListType, Task[]>

export type RestRateType<K extends RateType, V = number> = Omit<Record<RateType, V>, K>

export type MatchExchangeRates = {
  <T extends RateType>(currency: T): RestRateType<T>
}

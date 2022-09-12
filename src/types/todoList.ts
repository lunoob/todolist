import { RateType } from '@/model/common'

export type Task = Record<RateType, string> & {
  id: number
  title: string
}

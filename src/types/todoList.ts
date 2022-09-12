import { RateType } from '@/model/common'

export type ListType = 'plan' | 'completed'

export type Task = Record<RateType, string> & {
  id: number
  title: string
}

export type TaskData = Record<ListType, Task[]>

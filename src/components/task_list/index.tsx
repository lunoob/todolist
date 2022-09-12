import type { Task } from '@/types/todoList'
import { FC, useMemo, memo } from 'react'
import { stringFixed } from '@/utils'
import { RateType } from '@/model/common'

const taskConfig = {
  plan: {
    title: '计划:',
    costLabel: '将要花费:'
  },
  completed: {
    title: '已完成:',
    costLabel: '一共花了:'
  }
}

const titleTip = {
  plan: '点击完成',
  completed: '点击重做'
}

/**
 * 匹配货币符号
 */
function m (value: number | string, type: RateType) {
  const symbols: Record<RateType, string> = {
    RUB: '₽',
    CNY: '¥',
    USD: '$'
  }

  return (symbols[type] || '') + value
}

type Props = {
    type: keyof typeof taskConfig
    list: Task[]
    onChecked?: (task: Task) => any
}

const TaskList: FC<Props> = (props) => {
  const { type, list, onChecked } = props

  const total = useMemo(() => {
    const initialValue = { RUB: '0', CNY: '0', USD: '0' }

    const fixed = (val: number) => stringFixed(val, 6)

    return list.reduce((prev, cur) => (
      Object.assign(prev, {
        RUB: fixed(parseFloat(prev.RUB) + parseFloat(cur.RUB)),
        CNY: fixed(parseFloat(prev.CNY) + parseFloat(cur.CNY)),
        USD: fixed(parseFloat(prev.USD) + parseFloat(cur.USD))
      })
    ), initialValue)
  }, [list])

  const proxyCheckboxChange = ({ target }: any) => {
    if (!target) {
      return
    }
    const id = target.dataset.id
    if (id == null) {
      return
    }
    const task = list.find(n => `${n.id}` === id)
    task && onChecked && onChecked(task)
  }

  const isCompleted = type === 'completed'

  const config = taskConfig[type]

  return (
    <div>
      <span>{ config.title }</span>
      <ul className="divide-y border rounded-lg my-2" onInput={proxyCheckboxChange}>
        {list.length
          ? list.map(task => (
          <li className="flex py-3 text-center" key={task.id}>
            <div className="basis-3/6 flex pl-3">
              <input
                title={titleTip[type]}
                type="checkbox"
                defaultChecked={isCompleted}
                className="checkbox checkbox-primary mr-3"
                data-id={task.id}
              />
              <p className={`flex-1 w-0 truncate text-left ${isCompleted && 'line-through'}`}>
                { task.title }
              </p>
            </div>
            <span className="basis-1/6 truncate" title={m(task.RUB, 'RUB')}>{m(task.RUB, 'RUB')}</span>
            <span className="basis-1/6 truncate" title={m(task.CNY, 'CNY')}>{m(task.CNY, 'CNY')}</span>
            <span className="basis-1/6 truncate" title={m(task.USD, 'USD')}>{m(task.USD, 'USD')}</span>
          </li>
          ))
          : <div className="text-center py-10 text-slate-400">暂无任务</div>
        }
      </ul>
      {
        !!list.length && (
          <div className="flex border border-transparent text-center">
            <span className="basis-3/6 text-left">{ config.costLabel }</span>
            <span className="basis-1/6 truncate" title={m(total.RUB, 'RUB')}>{m(total.RUB, 'RUB')}</span>
            <span className="basis-1/6 truncate" title={m(total.CNY, 'CNY')}>{m(total.CNY, 'CNY')}</span>
            <span className="basis-1/6 truncate" title={m(total.USD, 'USD')}>{m(total.USD, 'USD')}</span>
          </div>
        )
      }
    </div>
  )
}

export default memo(TaskList)

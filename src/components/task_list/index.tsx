import { FC, useMemo, memo } from 'react'

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

type Props = {
    type: keyof typeof taskConfig
}

const datas = [
  { id: 1, title: '去吃麻辣烫', rouble: 1, rmb: 0.08707, dollar: 0.01323 },
  { id: 2, title: '去吃去吃海底捞', rouble: 1, rmb: 0.08707, dollar: 0.01323 }
]

const TaskList: FC<Props> = (props) => {
  const { type } = props

  const config = useMemo(() => taskConfig[type], [type])

  const total = useMemo(() => {
    const initialValue = { rouble: 0, rmb: 0, dollar: 0 }

    return datas.reduce((prev, cur) => (
      Object.assign(prev, {
        rouble: prev.rouble + cur.rouble,
        rmb: prev.rmb + cur.rmb,
        dollar: prev.dollar + cur.dollar
      })
    ), initialValue)
  }, datas)

  const isCompleted = type === 'completed'

  return (
    <div>
      <span>{ config.title }</span>
      <ul className="divide-y border rounded-lg my-2">
        {datas.map(task => (
          <li className="flex py-3 text-center" key={task.id}>
            <div className="basis-3/6 flex pl-3">
              <input type="checkbox" checked={isCompleted} className="checkbox checkbox-primary mr-3" />
              <p className={`text-left ${isCompleted && 'line-through'}`}>{ task.title }</p>
            </div>
            <span className="basis-1/6">₽{task.rouble}</span>
            <span className="basis-1/6">¥{task.rmb}</span>
            <span className="basis-1/6">${task.dollar}</span>
          </li>
        ))}
      </ul>
      <div className="flex border border-transparent text-center">
        <span className="basis-3/6 text-left">{ config.costLabel }</span>
        <span className="basis-1/6">₽{total.rouble}</span>
        <span className="basis-1/6">¥{total.rmb}</span>
        <span className="basis-1/6">${total.dollar}</span>
      </div>
    </div>
  )
}

export default memo(TaskList)

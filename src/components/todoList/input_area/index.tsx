import type { RateType } from '@/model/common'
import type { Task, MatchExchangeRates } from '@/types/todoList'
import { FC, memo, useState } from 'react'
import { getIdStart, updateIdStart } from '@/storage/todoList'
import { validate, validators, RuleObject, isFunction, stringFixed, uniqueId } from '@/utils'
import Message from '@/public_components/message'
import cs from 'classnames'

type InputAreaProps = {
  getRate?: MatchExchangeRates
  onCreate: (taskObj: Task) => unknown
}

const currencyList = [
  { label: '美元', value: 'USD' },
  { label: '卢布', value: 'RUB' },
  { label: '人民币', value: 'CNY' }
]

/**
 * 创建 Message ID
 */
function createTaskId () {
  const prefix = 'Task_'
  const id = uniqueId(prefix, getIdStart())
  updateIdStart(+id.replace(prefix, ''))
  return id
}

const InputArea: FC<InputAreaProps> = (props) => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState<RateType | ''>('')
  const { onCreate, getRate } = props

  // 获取校验规则
  const getRules = (): RuleObject[] => {
    return [
      {
        value: title,
        rules: [
          { validator: validators.isEmpty, message: '任务不能为空' }
        ]
      },
      {
        value: price,
        rules: [
          { validator: validators.isEmpty, message: '价格不能为空' },
          { validator: validators.isNumber, message: '请输入正确的价格' }
        ]
      },
      {
        value: currency,
        rules: [
          { validator: validators.isEmpty, message: '请选择货币类型' }
        ]
      }
    ]
  }

  // 重置交互的状态
  const resetState = () => {
    setTitle('')
    setPrice('')
    setCurrency('')
  }

  // 创建新的计划中的任务
  const createTask = () => {
    const calcOtherPrice = (otherCurrency: Record<string, number>) => {
      const cloneCurrency = { ...otherCurrency }
      Object.keys(cloneCurrency).forEach(key => {
        const originValue = cloneCurrency[key]
        // @ts-ignore
        cloneCurrency[key] = stringFixed(originValue * price, 6)
      })

      return cloneCurrency
    }

    return {
      id: createTaskId(),
      title,
      [currency]: +price,
      ...calcOtherPrice(
        getRate!(currency as RateType)
      )
    } as Task
  }

  // 增加新的任务
  const addNewTask = async () => {
    if (!getRate) {
      return
    }

    const errorMsg = await validate(getRules())
    if (errorMsg) {
      return Message.warning(errorMsg)
    }

    onCreate && isFunction(onCreate) && onCreate(createTask())
    Message.success('创建成功')
    resetState()
  }

  return (
    <div className="space-x-3 flex">
      <input
        type="text"
        placeholder="任务"
        className="input input-bordered flex-1"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder="价格"
        className="input input-bordered"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
      />
      <select
        value={currency}
        className="select select-bordered max-w-xs"
        // @ts-ignore
        onChange={ev => setCurrency(ev.target.value)}>
        <option value="">货币类型</option>
        {!!getRate &&
          currencyList.map(n => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
      </select>
      <button
        className={cs('btn px-8', {
          'btn-primary': getRate,
          'btn-disabled': !getRate
        })}
        onClick={addNewTask}>
        添加
      </button>
    </div>
  )
}

export default memo(InputArea)

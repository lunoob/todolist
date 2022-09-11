import { FC, memo, useCallback, useEffect, useState } from 'react'
import { validate, validators, RuleObject, stringFixed } from '@/utils'
import { getPlanTasks, updatePlanTasks, getCompletedTasks, updateCompletedTasks } from '@/storage/todolist'
import Common, { GetForexRatesParams, RateType } from '@/model/common'
import TaskList from '@/components/task_list'
import Message from '@/public_components/message'
import cs from 'classnames'
import './index.css'

type RestRateType<K extends RateType> = Omit<Record<RateType, number>, K>
type MatchForexRates = {
  <T extends RateType>(currency: T): RestRateType<T>
}

const currencys = [
  { label: '美元', value: 'USD' },
  { label: '卢布', value: 'RUB' },
  { label: '人民币', value: 'CNY' }
]

// 计算外汇汇率
function calcforexRates<T extends RateType> (base: T, rates: RestRateType<T>) {
  const forexRatesMap = {
    [base]: rates
  }

  const restRateTypes = Object.keys(rates)

  restRateTypes.forEach((rate, idx) => {
    const rateMapOtherRateObj = {
      // @ts-ignore
      [base]: stringFixed(1 / rates[rate], 6)
    }
    const otherRates = [...restRateTypes].splice(idx - 1, 1)
    otherRates.forEach(other => {
      // @ts-ignore
      rateMapOtherRateObj[other] = stringFixed(rates[other] / rates[rate], 6)
    })

    // @ts-ignore
    forexRatesMap[rate] = rateMapOtherRateObj
  })

  return ((currency: RateType) => forexRatesMap[currency]) as MatchForexRates
}

const TodoList: FC = () => {
  const [planData, setPlanData] = useState<Task[]>(getPlanTasks())
  const [completedData, setCompletedData] = useState<Task[]>(getCompletedTasks())
  const [getR, setR] = useState<MatchForexRates>()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState<RateType | ''>('')

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
  // 获取外汇汇率
  const getForexRates = async () => {
    const params: GetForexRatesParams = { base: 'USD', symbols: ['CNY', 'RUB'] }
    const result = await Common.getForexRates(params)
    if (result.status === 200) {
      console.log(result)
      const { base, rates } = result.data
      setR(() => {
        return calcforexRates(base, rates)
      })
    } else {
      Message.error('外汇汇率加载失败')
    }
  }
  // 创建新的计划中的任务
  const createTask = () => {
    const calcOtherPrice = (otherCurrency: Record<string, number>) => {
      Object.keys(otherCurrency).forEach(key => {
        const originValue = otherCurrency[key]
        // @ts-ignore
        otherCurrency[key] = stringFixed(originValue * price, 6)
      })

      return otherCurrency
    }

    return {
      id: Date.now(),
      title,
      [currency]: +price,
      ...calcOtherPrice(
        getR!(currency as RateType)
      )
    } as Task
  }
  // 重置交互的状态
  const resetState = () => {
    setTitle('')
    setPrice('')
    setCurrency('')
  }
  // 更新计划任务数据（同时更新本地缓存）
  const updatePlanTaskData = (newTask: Task) => {
    const newPlanTasks = [newTask, ...planData]
    setPlanData(newPlanTasks)
    // 更新缓存
    updatePlanTasks(newPlanTasks)
  }
  // 增加新的任务
  const addNewTask = async () => {
    if (!getR) {
      return
    }

    const errorMsg = await validate(getRules())
    if (errorMsg) {
      return Message.warning(errorMsg)
    }

    Message.success('创建成功')
    // 创建数据，并更新缓存
    updatePlanTaskData(createTask())
    // 重置数据
    resetState()
  }
  // 完成了计划的任务
  const finishPlanTask = useCallback((task: Task) => {
    setPlanData((oldData) => {
      const taskIdx = oldData.findIndex(n => n.id === task.id)
      const newData = oldData.slice()
      newData.splice(taskIdx, 1)
      updatePlanTasks(newData)
      return newData
    })

    setCompletedData((oldData) => {
      const newData = [task, ...oldData]
      updateCompletedTasks(newData)
      return newData
    })
  }, [])
  // 重做已完成的任务
  const redoComputedTask = useCallback((task: Task) => {
    setCompletedData((oldData) => {
      const taskIdx = oldData.findIndex(n => n.id === task.id)
      const newData = oldData.slice()
      newData.splice(taskIdx, 1)
      updateCompletedTasks(newData)

      return newData
    })

    setPlanData((oldData) => {
      const newData = [...oldData, task]
      updatePlanTasks(newData)
      return newData
    })
  }, [])
  // 外汇汇率信息
  const rateInfo = (() => {
    const units = ['₽/¥', '₽/$', '¥/$']
    if (!getR) {
      return [
        new Array(units.length).fill(0),
        units
      ]
    }
    return [
      [getR('RUB').CNY, getR('RUB').USD, getR('CNY').USD],
      units
    ]
  })()

  useEffect(() => {
    getForexRates()
  }, [])

  return (
    <div className="todolist bg-slate-100 flex flex-col justify-start items-center">
      <div className="todolist-layout">
        <p className="mb-6 text-3xl font-bold text-slate-600">To Do List</p>
        <div className="todolist-content relative bg-white shadow rounded-lg pt-5 flex flex-col overflow-hidden">
          <div className="px-5">
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
                {!!getR && currencys.map(n => (
                  <option key={n.value} value={n.value}>{ n.label }</option>
                ))}
              </select>
              <button
                className={cs('btn px-8', {
                  'btn-primary': getR,
                  'btn-disabled': !getR
                })}
                onClick={addNewTask}>
                添加
              </button>
            </div>
            <div className="text-right space-x-4 mt-3 font-light">
              {rateInfo[0].map((n, idx) => {
                const unit = rateInfo[1][idx]
                return (
                  <span key={unit}>{n} {unit}</span>
                )
              })}
            </div>
          </div>
          <div className="space-y-10 px-5 overflow-auto mt-2 pb-5">
            <TaskList type="plan" list={planData} onChecked={finishPlanTask} />
            <TaskList type="completed" list={completedData} onChecked={redoComputedTask} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TodoList)

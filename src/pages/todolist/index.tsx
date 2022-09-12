import type { Task, TaskData, RestRateType, MatchExchangeRates } from '@/types/todoList'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { stringFixed } from '@/utils'
import { updateTodoListData, getPlanTasks, getCompletedTasks } from '@/storage/todoList'
import Common, { GetExchangeRatesParams, RateType } from '@/model/common'
import TaskList from '@/components/todoList/task_list'
import InputArea from '@/components/todoList/input_area'
import Message from '@/public_components/message'
import './index.css'

/**
 * 计算外汇汇率
 */
function calcExchangeRates<T extends RateType> (base: T, rates: RestRateType<T>) {
  const exchangeRatesMap = {
    [base]: rates
  }

  const restRateTypes = Object.keys(rates) as (keyof typeof rates)[]

  restRateTypes.forEach((rate, idx) => {
    const rateMapOtherRateObj: Record<string, string> = {
      [base]: stringFixed(1 / rates[rate], 6)
    }
    const otherRates = [...restRateTypes].splice(idx - 1, 1)
    otherRates.forEach(other => {
      rateMapOtherRateObj[other] = stringFixed(rates[other] / rates[rate], 6)
    })

    // @ts-ignore
    exchangeRatesMap[rate] = rateMapOtherRateObj
  })

  return ((currency: RateType) => exchangeRatesMap[currency]) as MatchExchangeRates
}

const TodoList: FC = () => {
  const [taskData, setTaskData] = useState<TaskData>({
    plan: getPlanTasks(),
    completed: getCompletedTasks()
  })
  const [getR, setR] = useState<MatchExchangeRates>()

  // 获取外汇汇率
  const getExchangeRates = async () => {
    const params: GetExchangeRatesParams = { base: 'USD', symbols: ['CNY', 'RUB'] }
    const result = await Common.getExchangeRates(params)
    if (result.status === 200) {
      const { base, rates } = result.data
      setR(() => calcExchangeRates(base, rates))
    } else {
      Message.error('外汇汇率加载失败')
    }
  }
  // 创建新的任务
  const createNewTask = useCallback((newTask: Task) => {
    setTaskData((oldData) => {
      const newData: TaskData = {
        ...oldData,
        plan: [newTask, ...oldData.plan]
      }

      updateTodoListData(newData)
      return newData
    })
  }, [])
  // 完成了计划的任务
  const finishPlanTask = useCallback((task: Task) => {
    setTaskData(({ plan, completed }) => {
      const newPlanTasks = plan.filter(n => n.id !== task.id)
      const newCompleted = [task, ...completed]
      const newTaskData = { plan: newPlanTasks, completed: newCompleted }
      updateTodoListData(newTaskData)
      return newTaskData
    })
  }, [])
  // 重做已完成的任务
  const redoComputedTask = useCallback((task: Task) => {
    setTaskData(({ plan, completed }) => {
      const newPlanTasks = [...plan, task]
      const newCompleted = completed.filter(n => n.id !== task.id)
      const newTaskData = { plan: newPlanTasks, completed: newCompleted }
      updateTodoListData(newTaskData)
      return newTaskData
    })
  }, [])
  // 外汇汇率信息
  const rateInfo = (() => {
    const units = ['₽/¥', '₽/$', '¥/$']
    const defaultInfo = [new Array(units.length).fill(0), units]

    if (getR) {
      defaultInfo[0] = [getR('RUB').CNY, getR('RUB').USD, getR('CNY').USD]
    }

    return defaultInfo
  })()

  useEffect(() => {
    getExchangeRates()
  }, [])

  return (
    <div className="todo-list bg-slate-100 flex flex-col justify-start items-center">
      <div className="todo-list-layout">
        <p className="mb-6 text-3xl font-bold text-slate-600">To Do List</p>
        <div className="todo-list-content relative bg-white shadow rounded-lg pt-5 flex flex-col overflow-hidden">
          <div className="px-5">
            <InputArea getRate={getR} onCreate={createNewTask} />
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
            <TaskList type="plan" list={taskData.plan} onChecked={finishPlanTask} />
            <TaskList type="completed" list={taskData.completed} onChecked={redoComputedTask} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TodoList)

/**
* @fileoverview Storage for todoList.
* @author Luoob
*/
import type { TaskData, ListType, Task } from '@/types/todoList'

const TODO_LIST_KEY = 'todo_list'
const OLD_PLAN_KEY = 'todolist_plan'
const OLD_COMPLETED_KEY = 'todolist_computed'

const defaultData: Record<ListType, unknown[]> = {
  plan: [],
  completed: []
}

/**
 * 获取并合并旧数据
 */
export function getAndMergeOldData (): TaskData {
  let planData: unknown = localStorage.getItem(OLD_PLAN_KEY)
  planData = planData ? JSON.parse(planData as string) : []

  let completedData: unknown = localStorage.getItem(OLD_COMPLETED_KEY)
  completedData = completedData ? JSON.parse(completedData as string) : []

  return {
    plan: planData as Task[],
    completed: completedData as Task[]
  }
}

/**
 * 获取 todo list 数据
 */
export function getTodoListData (): TaskData {
  const oldData = getAndMergeOldData()
  removeOldData()

  let data: unknown = localStorage.getItem(TODO_LIST_KEY)
  data = data ? JSON.parse(data as string) : defaultData

  return {
    plan: [...oldData.plan, ...(data as TaskData).plan],
    completed: [...oldData.completed, ...(data as TaskData).completed]
  }
}

/**
 * 更新 todo list 数据
 */
export function updateTodoListData (todoListData: TaskData) {
  localStorage.setItem(TODO_LIST_KEY, JSON.stringify(todoListData))
}

/**
 * 清除旧的缓存数据
 */
export function removeOldData () {
  localStorage.removeItem(OLD_PLAN_KEY)
  localStorage.removeItem(OLD_COMPLETED_KEY)
}

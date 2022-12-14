/**
* @fileoverview Storage for todoList.
* @author Luoob
*/
import type { TaskData, Task } from '@/types/todoList'

const PLAIN_KEY = 'todolist_plan'
const COMPUTED_KEY = 'todolist_computed'

/**
 * 获取计划中的任务
 */
export function getPlanTasks () {
  const tasks = localStorage.getItem(PLAIN_KEY)
  return tasks ? JSON.parse(tasks) : []
}

/**
 * 更新计划中的任务
 */
export function updatePlanTasks (tasks: Task[]) {
  localStorage.setItem(PLAIN_KEY, JSON.stringify(tasks))
}

/**
 * 获取已完成的任务
 */
export function getCompletedTasks () {
  const tasks = localStorage.getItem(COMPUTED_KEY)
  return tasks ? JSON.parse(tasks) : []
}

/**
 * 更新已完成的任务
 */
export function updateCompletedTasks (tasks: Task[]) {
  localStorage.setItem(COMPUTED_KEY, JSON.stringify(tasks))
}

/**
 * 更新 todo list 数据
 */
export function updateTodoListData (todoListData: TaskData) {
  updatePlanTasks(todoListData.plan)
  updateCompletedTasks(todoListData.completed)
}

import type { FC } from 'react'
import { getPlanTasks } from '@/storage/todolist'
import TaskList from '@/components/task_list'
import './index.css'

console.log(getPlanTasks)

const TodoList: FC = () => {
  return (
    <div className="todolist bg-slate-100 flex flex-col justify-start items-center">
      <div className="todolist-layout">
        <p className="mb-6 text-3xl font-bold text-slate-600">To Do List</p>
        <div className="todolist-content bg-white shadow rounded-lg p-5">
          <div className="space-x-3 flex">
            <input type="text" placeholder="任务" className="input input-bordered flex-1" />
            <input type="text" placeholder="价格" className="input input-bordered" />
            <select defaultValue="" className="select select-bordered max-w-xs">
              <option value="">货币类型</option>
              <option>卢布</option>
              <option>人民币</option>
              <option>美元</option>
            </select>
            <button className="btn btn-primary px-8">添加</button>
          </div>
          <div className="text-right space-x-4 mt-3 font-light">
            <span>11.526 ₽/¥</span>
            <span>75.815 ₽/$</span>
            <span>6.578 ¥/$</span>
          </div>
          <div className="space-y-10">
            <TaskList type="plan" />
            <TaskList type="completed" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoList

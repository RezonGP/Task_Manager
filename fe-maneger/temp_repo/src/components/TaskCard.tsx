import { memo } from 'react'
import { type TaskStatus, type TaskCardProps, statusStyles, statusLabels } from '../types'



function TaskCardComponent({
    task,
    isBusy,
    onEdit,
    onDelete,
    onStatusChange,
}: TaskCardProps) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                    >
                        {statusLabels[task.status]}
                    </span>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                    </div>
                </div>

                <span className="text-xs text-slate-400">
                    {new Date(task.createdAt).toLocaleString('vi-VN')}
                </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 text-sm text-slate-600">
                    <span>Trạng thái</span>
                    <select
                        disabled={isBusy}
                        onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
                        className="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="todo">{statusLabels.todo}</option>
                        <option value="doing">{statusLabels.doing}</option>
                        <option value="done">{statusLabels.done}</option>
                    </select>
                </label>

                <div className="flex gap-3">
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onEdit(task)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                        Sửa
                    </button>
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onDelete(task.id)}
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </article>
    )
}

export const TaskCard = memo(TaskCardComponent)

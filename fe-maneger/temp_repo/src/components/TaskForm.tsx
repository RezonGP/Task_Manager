import { memo, useState } from 'react'
import type { Task, TaskFormValues, TaskStatus } from '../types'

interface TaskFormProps {
    editingTask: Task | null
    isSubmitting: boolean
    onSubmit: (values: TaskFormValues) => Promise<void>
    onCancelEdit: () => void
}

const defaultValues: TaskFormValues = {
    title: '',
    description: '',
    status: 'todo',
}

function TaskFormComponent({
    editingTask,
    isSubmitting,
    onSubmit,
    onCancelEdit,
}: TaskFormProps) {
    const initialValues = editingTask
        ? {
            title: editingTask.title,
            description: editingTask.description,
            status: editingTask.status,
        }
        : defaultValues

    const [formValues, setFormValues] = useState<TaskFormValues>(initialValues)
    const [formError, setFormError] = useState('')

    const handleFieldChange = <TKey extends keyof TaskFormValues>(
        field: TKey,
        value: TaskFormValues[TKey],
    ) => {
        setFormValues((currentValues) => ({
            ...currentValues,
            [field]: value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!formValues.title.trim() || !formValues.description.trim()) {
            setFormError('Vui lòng nhập đầy đủ tiêu đề và mô tả.')
            return
        }

        setFormError('')
        await onSubmit({
            title: formValues.title.trim(),
            description: formValues.description.trim(),
            status: formValues.status,
        })

        if (!editingTask) {
            setFormValues(defaultValues)
        }
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {editingTask ? 'Chỉnh sửa task' : 'Tạo task mới'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Quản lý công việc với React Hooks và React Query.
                    </p>
                </div>

                {editingTask ? (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        Hủy sửa
                    </button>
                ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
                    <input
                        value={formValues.title}
                        onChange={(event) => handleFieldChange('title', event.target.value)}
                        placeholder="Ví dụ: Hoàn thiện wireframe"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Mô tả</span>
                    <textarea
                        value={formValues.description}
                        onChange={(event) => handleFieldChange('description', event.target.value)}
                        placeholder="Mô tả ngắn gọn công việc cần làm"
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Trạng thái</span>
                    <select
                        value={formValues.status}
                        onChange={(event) => handleFieldChange('status', event.target.value as TaskStatus)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="todo">Todo</option>
                        <option value="doing">Doing</option>
                        <option value="done">Done</option>
                    </select>
                </label>

                {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isSubmitting ? 'Đang lưu...' : editingTask ? 'Cập nhật task' : 'Tạo task'}
                </button>
            </form>
        </section>
    )
}

export const TaskForm = memo(TaskFormComponent)

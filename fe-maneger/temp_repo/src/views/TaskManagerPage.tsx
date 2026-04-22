import { useCallback, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { TaskFilters } from '../components/TaskFilters'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { TaskSkeleton } from '../components/TaskSkeleton'
import { reload } from '../hooks/useDebounce'
import { useTasks } from '../hooks/useTasks'
import type { Task, TaskFilter, TaskFormValues, TaskStatus } from '../types'

export const TaskManagerPage = () => {
    const { tasks, isLoading, isError, errorMessage, createTask, updateTask, deleteTask, isSubmitting } =
        useTasks()
    const [searchValue, setSearchValue] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<TaskFilter>('all')
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [submitError, setSubmitError] = useState('')
    const debouncedSearch = reload(searchValue, 400)
    const formKey = editingTask?.id ?? 'create-task'

    const filteredTasks = useMemo(() => {
        const normalizedSearch = debouncedSearch.trim().toLowerCase()

        return tasks.filter((task) => {
            const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
            const matchesTitle = task.title.toLowerCase().includes(normalizedSearch)

            return matchesStatus && matchesTitle
        })
    }, [debouncedSearch, selectedStatus, tasks])

    const handleSubmit = useCallback(
        async (values: TaskFormValues) => {
            try {
                setSubmitError('')

                if (editingTask) {
                    await updateTask(editingTask.id, values)
                    setEditingTask(null)
                    return
                }

                await createTask(values)
            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'Không thể lưu task.')
            }
        },
        [createTask, editingTask, updateTask],
    )

    const handleDeleteTask = useCallback(
        async (taskId: string) => {
            try {
                setSubmitError('')
                await deleteTask(taskId)

                setEditingTask((currentTask) => (currentTask?.id === taskId ? null : currentTask))
            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'Không thể xóa task.')
            }
        },
        [deleteTask],
    )

    const handleStatusChange = useCallback(
        async (taskId: string, status: TaskStatus) => {
            const currentTask = tasks.find((task) => task.id === taskId)

            if (!currentTask || currentTask.status === status) {
                return
            }

            try {
                setSubmitError('')
                await updateTask(taskId, {
                    title: currentTask.title,
                    description: currentTask.description,
                    status,
                })
            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.')
            }
        },
        [tasks, updateTask],
    )

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task)
        setSubmitError('')
    }, [])

    const handleCancelEdit = useCallback(() => {
        setEditingTask(null)
        setSubmitError('')
    }, [])

    const hasFilters = selectedStatus !== 'all' || debouncedSearch.trim().length > 0

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <header className="rounded-[2rem] bg-slate-900 px-6 py-8 text-white shadow-lg">
                    <p className="text-sm uppercase tracking-[0.25em] text-blue-200">Task Manager</p>
                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Quản lý công việc hiệu quả</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                        Ứng dụng CRUD tasks với React Hooks, React Query, custom hook và mock API theo đúng
                        luồng GET, POST, PUT, DELETE.
                    </p>
                </header>

                <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                    <div className="space-y-6">
                        <TaskForm
                            key={formKey}
                            editingTask={editingTask}
                            isSubmitting={isSubmitting}
                            onSubmit={handleSubmit}
                            onCancelEdit={handleCancelEdit}
                        />

                        {(submitError || (isError && errorMessage)) ? (
                            <section className="rounded-3xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                                {submitError || errorMessage}
                            </section>
                        ) : null}
                    </div>

                    <div className="space-y-6">
                        <TaskFilters
                            searchValue={searchValue}
                            selectedStatus={selectedStatus}
                            onSearchChange={setSearchValue}
                            onStatusChange={setSelectedStatus}
                        />

                        {isLoading ? (
                            <TaskSkeleton />
                        ) : filteredTasks.length === 0 ? (
                            <EmptyState hasFilters={hasFilters} />
                        ) : (
                            <TaskList
                                tasks={filteredTasks}
                                isBusy={isSubmitting}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

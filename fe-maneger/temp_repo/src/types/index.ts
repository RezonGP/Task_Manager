export type TaskStatus = 'todo' | 'doing' | 'done'


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
//from server
export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    createdAt: string
}

export const statusStyles: Record<TaskStatus, string> = {
    todo: 'bg-slate-100 text-slate-700',
    doing: 'bg-amber-100 text-amber-700',
    done: 'bg-emerald-100 text-emerald-700',
}

export const statusLabels: Record<TaskStatus, string> = {
    todo: 'Todo',
    doing: 'Doing',
    done: 'Done',
}

export interface TaskCardProps {
    task: Task
    isBusy: boolean
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onStatusChange: (taskId: string, status: TaskStatus) => void
}

export interface TaskFiltersProps {
    searchValue: string
    selectedStatus: TaskFilter
    onSearchChange: (value: string) => void
    onStatusChange: (status: TaskFilter) => void
}

export type EmptyStateProps = {
    hasFilters: boolean
}

//from create/edit task
export interface TaskFormValues {
    title: string
    description: string
    status: TaskStatus
}

//from update task
export interface UpdateTaskPayload {
    id: string
    data: Partial<TaskFormValues>
}

export type TaskFilter = TaskStatus | 'all'

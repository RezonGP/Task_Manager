import { memo } from 'react'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '../types'

interface TaskListProps {
    tasks: Task[]
    isBusy: boolean
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onStatusChange: (taskId: string, status: TaskStatus) => void
}

function TaskListComponent({
    tasks,
    isBusy,
    onEdit,
    onDelete,
    onStatusChange,
}: TaskListProps) {
    return (
        <div className="grid gap-4">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    isBusy={isBusy}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    )
}

export const TaskList = memo(TaskListComponent)

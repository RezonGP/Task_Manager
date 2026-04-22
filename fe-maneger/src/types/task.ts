


export type TaskStatus = 'todo' | 'doing' | 'done'


export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    createdAt: string
}

export interface CreateTaskDto {
    title: string
    description: string
    status: TaskStatus
}

export interface UpdateTaskDto {
    title?: string
    description?: string
    status?: TaskStatus
}

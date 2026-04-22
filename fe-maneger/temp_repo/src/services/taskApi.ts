import type { Task, TaskFormValues, UpdateTaskPayload } from '../types'
import { seedTasks } from '../moc-api/index'

const END_POINT = '/tasks'
const STORAGE_KEY = 'task-manager-tasks'
const NETWORK_DELAY = 450

const wait = (ms: number) =>
    new Promise((resolve) => {
        window.setTimeout(resolve, ms)
    })

const saveTasks = (tasks: Task[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

const resetTasks = () => {
    saveTasks(seedTasks)
    return seedTasks
}

const readTasks = (): Task[] => {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
        return resetTasks()
    }

    try {
        const parsedTasks = JSON.parse(rawValue) as Task[]

        if (!Array.isArray(parsedTasks)) {
            return resetTasks()
        }

        return parsedTasks
    } catch {
        return resetTasks()
    }
}

const sortTasks = (tasks: Task[]) =>
    [...tasks].sort(
        (firstTask, secondTask) =>
            new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime(),
    )

const normalizeTaskFormValues = (payload: TaskFormValues): TaskFormValues => ({
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: payload.status,
})

const createTaskEntity = (payload: TaskFormValues): Task => {
    const normalizedPayload = normalizeTaskFormValues(payload)

    return {
        id: crypto.randomUUID(),
        title: normalizedPayload.title,
        description: normalizedPayload.description,
        status: normalizedPayload.status,
        createdAt: new Date().toISOString(),
    }
}

const buildTaskPath = (id?: string) => (id ? `${END_POINT}/${id}` : END_POINT)
const getTaskIdFromPath = (path: string) => path.replace(`${END_POINT}/`, '')

const getTasks = async (): Promise<Task[]> => {
    await wait(NETWORK_DELAY)
    return sortTasks(readTasks())
}

const createTask = async (payload: TaskFormValues): Promise<Task> => {
    await wait(NETWORK_DELAY)

    const tasks = readTasks()
    const nextTask = createTaskEntity(payload)

    saveTasks([nextTask, ...tasks])
    return nextTask
}

const updateTaskById = async ({ id, data }: UpdateTaskPayload): Promise<Task> => {
    await wait(NETWORK_DELAY)

    const normalizedPayload = normalizeTaskFormValues(data as TaskFormValues)
    const tasks = readTasks()
    let updatedTask: Task | null = null

    const updatedTasks = tasks.map((task) => {
        if (task.id !== id) {
            return task
        }

        updatedTask = {
            ...task,
            title: normalizedPayload.title,
            description: normalizedPayload.description,
            status: normalizedPayload.status,
        }

        return updatedTask
    })

    if (!updatedTask) {
        throw new Error('Không tìm thấy task để cập nhật.')
    }

    saveTasks(updatedTasks)
    return updatedTask
}

const deleteTaskById = async (id: string): Promise<{ success: boolean }> => {
    await wait(NETWORK_DELAY)

    const tasks = readTasks()
    const nextTasks = tasks.filter((task) => task.id !== id)

    if (nextTasks.length === tasks.length) {
        throw new Error('Không tìm thấy task để xóa.')
    }

    saveTasks(nextTasks)
    return { success: true }
}

export const taskApi = {
    getTasks,
    createTask,
    updateTask: (id: string, payload: TaskFormValues) =>
        updateTaskById({
            id: getTaskIdFromPath(buildTaskPath(id)),
            data: payload,
        }),
    deleteTask: (id: string) => deleteTaskById(getTaskIdFromPath(buildTaskPath(id))),
}

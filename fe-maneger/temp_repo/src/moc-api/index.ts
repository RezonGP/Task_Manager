import type { UseMutationResult } from "@tanstack/react-query";
import type { Task, TaskFilter, TaskFormValues } from "../types";

export const seedTasks: Task[] = [
    {
        id: crypto.randomUUID(),
        title: 'Thiết kế giao diện dashboard',
        description: 'Tạo layout chính cho trang quản lý công việc.',
        status: 'doing',
        createdAt: new Date().toISOString(),
    },
    {
        id: crypto.randomUUID(),
        title: 'Viết tài liệu API',
        description: 'Mô tả luồng CRUD tasks cho team frontend.',
        status: 'todo',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        id: crypto.randomUUID(),
        title: 'Kiểm thử luồng cập nhật trạng thái',
        description: 'Đảm bảo task chuyển trạng thái không cần reload trang.',
        status: 'done',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
]
export interface UseTasksResult {
    tasks: Task[]
    isLoading: boolean
    isError: boolean
    errorMessage: string
    createTask: UseMutationResult<Task, Error, TaskFormValues>['mutateAsync']
    updateTask: (taskId: string, values: TaskFormValues) => Promise<Task>
    deleteTask: UseMutationResult<{ success: boolean }, Error, string>['mutateAsync']
    isSubmitting: boolean
}

export const filterOptions: Array<{ label: string; value: TaskFilter }> = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Todo', value: 'todo' },
    { label: 'Doing', value: 'doing' },
    { label: 'Done', value: 'done' },
]

import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
} from '@tanstack/react-query'
import { useCallback } from 'react'
import { taskApi } from '../services/taskApi'
import type { Task, TaskFormValues } from '../types'
import type { UseTasksResult } from '../moc-api'


const TASKS_QUERY_KEY = ['tasks']


export const useTasks = (): UseTasksResult => {
    const queryClient = useQueryClient()

    const tasksQuery = useQuery({
        queryKey: TASKS_QUERY_KEY,
        queryFn: taskApi.getTasks,
    })

    const createMutation = useMutation({
        mutationFn: taskApi.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ taskId, values }: { taskId: string; values: TaskFormValues }) =>
            taskApi.updateTask(taskId, values),
        onMutate: async ({ taskId, values }) => {
            await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })

            const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? []

            queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) =>
                currentTasks.map((task) => (task.id === taskId ? { ...task, ...values } : task)),
            )

            return { previousTasks }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: taskApi.deleteTask,
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })

            const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? []

            queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) =>
                currentTasks.filter((task) => task.id !== taskId),
            )

            return { previousTasks }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
        },
    })

    const updateTask = useCallback(
        (taskId: string, values: TaskFormValues) =>
            updateMutation.mutateAsync({
                taskId,
                values,
            }),
        [updateMutation],
    )

    return {
        tasks: tasksQuery.data ?? [],
        isLoading: tasksQuery.isLoading,
        isError: tasksQuery.isError,
        errorMessage: tasksQuery.error instanceof Error ? tasksQuery.error.message : '',
        createTask: createMutation.mutateAsync,
        updateTask,
        deleteTask: deleteMutation.mutateAsync,
        isSubmitting:
            createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    }
}

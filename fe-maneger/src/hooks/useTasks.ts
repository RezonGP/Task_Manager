import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../services/tasks.api';
import type { CreateTaskDto, UpdateTaskDto } from '../types/task';


export const useTasks = () => {
  const queryClient = useQueryClient();
  // Query
  // Tải danh sách Task từ server
  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });


  const createTask = useMutation({
    // Mutation
    // Tạo Task mới

    mutationFn: (newTask: CreateTaskDto) => tasksApi.create(newTask),
    onSuccess: () => {
      // Khi tạo thành công, cập nhật danh sách Task trên client
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  })


  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateTaskDto }) => tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  })


  const deleteTask = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  })


  return {
    tasks,
    isLoading,
    isError,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
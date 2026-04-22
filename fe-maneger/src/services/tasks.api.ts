
import type { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";


const API_URL = 'http://localhost:3000/tasks';


export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Không thể tải danh sách Task');
    return res.json();
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Không thể tạo Task');
    return res.json();
  },
  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const res = await fetch(`${API_URL}/${id}`
      , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    if (!res.ok) throw new Error('Không thể cập nhật Task');
    return res.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`
      , {
        method: 'DELETE',
      });
    if (!res.ok) throw new Error('Không thể xóa Task');
  }
}
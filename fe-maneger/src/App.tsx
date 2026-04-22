import { useState, useMemo, useCallback } from 'react'
import { useDebounce } from './hooks/useDebounce'
import type { Task, TaskStatus } from './types/task'
import { useTasks } from './hooks/useTasks'

import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Textarea } from './components/ui/textarea'
import { Loader2 } from 'lucide-react'

function App() {

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  //Debounce search term
  const debounceSearch = useDebounce(searchTerm, 350)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
  })

  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks()

  const statusConfig: Record<TaskStatus, string> = {
    todo: 'border-slate-200 bg-slate-50 text-slate-700',
    doing: 'border-amber-200 bg-amber-50 text-amber-700',
    done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }

  // useMemo: tránh render lại nhiều lần
  const filteredTasks = useMemo(() => {
    if (!tasks) return []

    return tasks.filter((task) => {
      const matchStatus = filterStatus === 'all' || task.status === filterStatus
      const matchSearch = task.title.toLowerCase().includes(debounceSearch.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [tasks, filterStatus, debounceSearch])

  //Sumbit FORM
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    }

    if (!payload.title) {
      return
    }

    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data: payload },
        { onSuccess: () => resetForm() }
      )
    } else {
      createTask.mutate(
        payload,
        { onSuccess: () => resetForm() }
      )
    }
  }, [createTask, editingTask, formData, updateTask])

  //ham reset form ve rong
  const resetForm = useCallback(() => {
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      status: 'todo',
    })
  }, [])

  //ham mo from
  const openForm = useCallback((task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    })
  }, [])


  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-blue-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">


        <header className="animate-in fade-in slide-in-from-top-3 rounded-[2rem] bg-slate-900 px-6 py-8 text-white shadow-lg duration-500">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">Task Manager</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Quản lý công việc hiệu quả</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Ứng dụng CRUD tasks với React Hooks, React Query và Tailwind CSS.
          </p>
        </header>


        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">

          {/* ================= CỘT TRÁI: FORM THÊM/SỬA ================= */}
          <div className="space-y-6">
            <section className="animate-in fade-in slide-in-from-left-3 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-sm duration-500">
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
                    onClick={resetForm}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  >
                    Hủy sửa
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" >
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Hoàn thiện wireframe"
                    className="rounded-2xl border-slate-200 px-4 py-5 transition focus-visible:ring-2 focus-visible:ring-blue-200"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Mô tả</span>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn công việc cần làm"
                    rows={4}
                    className="rounded-2xl border-slate-200 px-4 py-3 transition focus-visible:ring-2 focus-visible:ring-blue-200"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Trạng thái</span>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      if (!value) return
                      setFormData({ ...formData, status: value as TaskStatus })
                    }}
                  >
                    <SelectTrigger className="rounded-2xl border-slate-200 px-4 py-5 transition focus-visible:ring-2 focus-visible:ring-blue-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="doing">Doing</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <Button
                  type="submit"
                  className="w-full rounded-2xl py-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
                  disabled={createTask.isPending || updateTask.isPending}
                >
                  {createTask.isPending || updateTask.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </span>
                  ) : editingTask ? (
                    `Cập nhật task`
                  ) : (
                    `Tạo task`
                  )}
                </Button>
              </form>
            </section>
          </div>

          <div className="space-y-6">

            <section className="animate-in fade-in slide-in-from-right-3 grid gap-4 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm duration-500 md:grid-cols-[2fr_1fr]">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Tìm kiếm theo tiêu đề</span>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên task..."
                  className="rounded-2xl border-slate-200 px-4 py-5 transition focus-visible:ring-2 focus-visible:ring-blue-200"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Lọc theo trạng thái</span>
                <Select
                  value={filterStatus}
                  onValueChange={(value) => {
                    if (!value) return
                    setFilterStatus(value as TaskStatus | 'all')
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-slate-200 px-4 py-5 transition focus-visible:ring-2 focus-visible:ring-blue-200">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="doing">Doing</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </section>

            {isLoading ? (
              <div className="animate-in fade-in rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm duration-300">
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Đang tải dữ liệu...</span>
                </div>
              </div>
            ) : error ? (
              <div className="animate-in fade-in rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-600 shadow-sm duration-300">
                Không tải được danh sách task.
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="animate-in fade-in rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm duration-300">
                Không có task nào phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    className="animate-in fade-in zoom-in-95 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-3">
                        <Badge
                          variant="outline"
                          className={`rounded-full border px-3 py-1 capitalize ${statusConfig[task.status]}`}
                        >
                          {task.status}
                        </Badge>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {task.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description || 'Không có mô tả'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex items-center gap-3 text-sm text-slate-600">
                        <span>Trạng thái</span>
                        <Select
                          value={task.status}
                          onValueChange={(value) => {
                            if (!value) return

                            updateTask.mutate({
                              id: task.id,
                              data: {
                                title: task.title,
                                description: task.description,
                                status: value as TaskStatus,
                              },
                            })
                          }}
                        >
                          <SelectTrigger className="w-[120px] rounded-xl border-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="doing">Doing</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                          onClick={() => openForm(task)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-red-600"
                          onClick={() => {
                            if (confirm('Bạn có chắc muốn xóa task này không?')) {
                              deleteTask.mutate(task.id)
                            }
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

              </div>
            )}


          </div>

        </div>
      </div>
    </main >
  )
}

export default App

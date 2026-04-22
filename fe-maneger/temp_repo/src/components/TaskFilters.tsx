import { memo } from 'react'
import type { TaskFilter, TaskFiltersProps } from '../types'
import { filterOptions } from '../moc-api'

function TaskFiltersComponent({
    searchValue,
    selectedStatus,
    onSearchChange,
    onStatusChange,
}: TaskFiltersProps) {
    return (
        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[2fr_1fr]">
            <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Tìm kiếm theo tiêu đề</span>
                <input
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Nhập tên task..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
            </label>

            <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Lọc theo trạng thái</span>
                <select
                    value={selectedStatus}
                    onChange={(event) => onStatusChange(event.target.value as TaskFilter)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        </section>
    )
}

export const TaskFilters = memo(TaskFiltersComponent)

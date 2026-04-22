import type { EmptyStateProps } from '../types'

export const EmptyState = ({ hasFilters }: EmptyStateProps) => (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
            {hasFilters ? 'Không tìm thấy task phù hợp' : 'Chưa có task nào'}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
            {hasFilters
                ? 'Thử đổi từ khóa tìm kiếm hoặc trạng thái để xem kết quả khác.'
                : 'Hãy tạo task đầu tiên để bắt đầu quản lý công việc.'}
        </p>
    </section>
)

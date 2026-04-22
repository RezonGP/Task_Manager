export const TaskSkeleton = () => (
    <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
            <div
                key={index}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="h-6 w-20 rounded-full bg-slate-200" />
                <div className="mt-4 h-5 w-1/2 rounded-full bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
                <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
                <div className="mt-6 flex justify-between">
                    <div className="h-10 w-32 rounded-2xl bg-slate-100" />
                    <div className="flex gap-3">
                        <div className="h-10 w-20 rounded-xl bg-slate-100" />
                        <div className="h-10 w-20 rounded-xl bg-slate-100" />
                    </div>
                </div>
            </div>
        ))}
    </div>
)

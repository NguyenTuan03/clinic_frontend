export default function LoadingComponent() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
        Đang tải dữ liệu...
      </p>
    </div>
  );
}
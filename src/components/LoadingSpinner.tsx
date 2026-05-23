export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
}
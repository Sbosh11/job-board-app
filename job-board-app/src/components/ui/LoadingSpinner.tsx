// Purpose: Simple loading spinner used across the app.
export default function LoadingSpinner() {
  return (
    <div
      className="flex justify-center py-20"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

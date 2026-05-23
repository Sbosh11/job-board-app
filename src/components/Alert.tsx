interface AlertProps {
  type?: "success" | "error" | "info"
  message: string
}

export default function Alert({
  type = "info",
  message,
}: AlertProps) {
  const styles = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-300",
    error: "bg-red-100 text-red-700 border-red-300",
    info: "bg-blue-100 text-blue-700 border-blue-300",
  }

  return (
    <div
      className={`border px-4 py-3 rounded-lg text-sm ${styles[type]}`}
    >
      {message}
    </div>
  )
}
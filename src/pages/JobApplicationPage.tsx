import { useParams } from "react-router-dom"
import { useState } from "react"
import { submitApplication } from "../services/api"

export default function JobApplicationPage() {
  const { id } = useParams()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    await submitApplication({
      ...form,
      jobId: Number(id),
    })

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-20 text-emerald-600 font-semibold">
        Application submitted successfully 🎉
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-2xl p-6 space-y-4"
    >
      <input
        className="w-full border p-2 rounded"
        placeholder="Full Name"
        onChange={(e) =>
          setForm({ ...form, fullName: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Cover Letter"
        onChange={(e) =>
          setForm({ ...form, coverLetter: e.target.value })
        }
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  )
}
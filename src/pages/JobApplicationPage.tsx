import { useParams } from "react-router-dom";
import { useState } from "react";
import { submitApplication } from "../api/application.api";

export default function JobApplicationPage() {
  const { id } = useParams();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitApplication({
        ...form,
        jobId: Number(id),
      });

      setSuccess(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
      });
    } catch {
      // Fixed: Removed the unused 'err' variable binding
      setError("Failed to submit application. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 text-emerald-600 font-semibold">
        Application submitted successfully 🎉
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-2xl p-6 space-y-4"
    >
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Full Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Email"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Phone"
      />

      <textarea
        name="coverLetter"
        value={form.coverLetter}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Cover Letter"
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

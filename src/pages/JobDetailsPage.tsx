import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import type { JobListing } from "../types/job.types"
import { fetchJobById } from "../services/api"

import LoadingSpinner from "../components/LoadingSpinner"

export default function JobDetailsPage() {
  const { id } = useParams()
  const [job, setJob] = useState<JobListing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobById(id!)
      .then(setJob)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!job) return <p>Job not found</p>

  return (
    <div className="space-y-6">

      <div className="
  bg-white 
  rounded-2xl 
  p-5 
  shadow-sm 
  hover:shadow-lg
  transition-all 
  border border-transparent 
  hover:border-slate-100
">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-slate-500">
          {job.location} • {job.department}
        </p>

        <Link
          to={`/jobs/${job.id}/apply`}
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Apply Now
        </Link>
      </div>

      <div className="
  bg-white 
  rounded-2xl 
  p-5 
  shadow-sm 
  hover:shadow-lg
  transition-all 
  border border-transparent 
  hover:border-slate-100
">
        <p className="text-slate-600">{job.description}</p>
      </div>

    </div>
  )
}
import { useMemo, useEffect, useState } from "react"
import type { JobListing } from "../types/job.types"
import { fetchJobs } from "../services/api"

import JobCard from "../components/JobCard"
import LoadingSpinner from "../components/LoadingSpinner"

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
    )
  }, [jobs, search])

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">

      {/* ✅ SEARCH INPUT (this fixes your warning) */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search jobs..."
        className="
          w-full px-4 py-2 
          border rounded-xl 
          border-slate-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500
        "
      />

      {/* ✅ NOW USING filteredJobs */}
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

    </div>
  )
}
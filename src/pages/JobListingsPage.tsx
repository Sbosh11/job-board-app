import { useMemo, useEffect, useState } from "react";
import type { JobListing } from "../types/job.types";
import { fetchJobs } from "../api/jobs.api";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchJobs();

        if (active) setJobs(data);
      } catch {
        if (active) setError("Failed to load jobs");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase();

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search jobs..."
        className="w-full px-4 py-2 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredJobs.length === 0 ? (
        <p className="text-slate-500">No jobs found</p>
      ) : (
        filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))
      )}
    </div>
  );
}
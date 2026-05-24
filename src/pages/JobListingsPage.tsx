import { useEffect, useMemo, useState } from "react";

import { fetchJobs } from "../api/jobs.api";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageHeader from "../components/layout/PageHeader";
import JobSearchBar from "../components/ui/JobSearchBar";

import type { JobListing } from "../types/job.types";
import { searchJobs } from "../utils/search/searchEngine";

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchJobs();

        if (active) {
          setJobs(data);
        }
      } catch {
        if (active) {
          setError("Failed to load jobs");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

const filteredJobs = useMemo(() => {
  return searchJobs(jobs, filters);
}, [jobs, filters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <PageHeader
          title="Find Your Next Job"
          subtitle="Search by role, company or location"
        />

        <JobSearchBar onSearch={setFilters} jobs={jobs} />
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-slate-500">No jobs found</p>
      ) : (
        filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
}

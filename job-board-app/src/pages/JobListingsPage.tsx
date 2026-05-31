// Purpose: Page that fetches and displays a list of job postings.
import { useEffect, useMemo, useState } from "react";

import { fetchJobs } from "../api/jobs.api";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageHeader from "../components/layout/PageHeader";
import JobSearchBar from "../components/ui/JobSearchBar";

import type { JobListing } from "../types/job.types";
import { searchJobs } from "../utils/search/searchEngine";

import JobFiltersSideBar from "../components/ui/JobFiltersSideBar";

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    keyword: "",
    location: [] as string[],
    department: [] as string[],
    sort: "newest" as "newest" | "relevance",
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

  function setFilter(key: string, value: string) {
    setFilters((prev) => {
      const k = key as "location" | "department";
      const current = prev[k];

      const exists = current.includes(value);

      return {
        ...prev,
        [k]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  }

  function reset() {
    setFilters({
      keyword: "",
      location: [],
      department: [],
      sort: "newest",
    });
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4">
      {/* HEADER */}
      <div className="space-y-4">
        <PageHeader
          title="Find Your Next Job"
          subtitle="Search by role or location"
        />

        <JobSearchBar
          jobs={jobs}
          onSearch={(p) =>
            setFilters((prev) => ({
              ...prev,
              keyword: p.keyword,
              location: p.location ? [p.location] : [],
            }))
          }
        />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <aside className="lg:col-span-3">
          <JobFiltersSideBar
            jobs={jobs}
            filters={filters}
            setFilter={setFilter}
            reset={reset}
          />
        </aside>

        {/* LIST */}
        <main className="lg:col-span-9 space-y-4">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p role="alert" className="text-error">
              {error}
            </p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-slate-500">No jobs found</p>
          ) : (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </main>
      </div>
    </div>
  );
}

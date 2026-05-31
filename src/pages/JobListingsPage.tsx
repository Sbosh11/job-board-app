// Purpose: Page that fetches and displays a list of job postings.
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchJobs } from "../api/jobs.api";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageHeader from "../components/layout/PageHeader";
import JobSearchBar from "../components/ui/JobSearchBar";
import JobFiltersSideBar from "../components/ui/JobFiltersSideBar";

import { searchJobs } from "../utils/search/searchEngine";

export default function JobListingsPage() {
  const [filters, setFilters] = useState({
    keyword: "",
    location: [] as string[],
    department: [] as string[],
    sort: "newest" as "newest" | "relevance",
  });

  // Clean data fetching with React Query (wrapped queryFn ensures proper typing)
  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobs(),
  });

  // Client-side filtering remain optimized
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
          // The key prop forces a clean remount when filters are reset,
          // instantly clearing out the search bar inputs safely.
          key={`${filters.keyword}-${filters.location[0] || ""}`}
          jobs={jobs}
          initialKeyword={filters.keyword}
          initialLocation={filters.location[0] || ""}
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
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <p role="alert" className="text-error">
              Failed to load jobs
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
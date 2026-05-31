// Purpose: Page that fetches and displays a list of job postings using URL state.
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom"; // or your framework's router hook
import { useQuery } from "@tanstack/react-query";

import { fetchJobs } from "../api/jobs.api";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageHeader from "../components/layout/PageHeader";
import JobSearchBar from "../components/ui/JobSearchBar";
import JobFiltersSideBar from "../components/ui/JobFiltersSideBar";

import { searchJobs } from "../utils/search/searchEngine";

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Derive filter state directly from the URL query parameters
  const filters = useMemo(() => {
    return {
      keyword: searchParams.get("keyword") || "",
      location: searchParams.getAll("location"), // support multiple if needed, or get()
      department: searchParams.getAll("department"),
      sort: (searchParams.get("sort") as "newest" | "relevance") || "newest",
    };
  }, [searchParams]);

  // 2. React Query is now bound to the URL. If the URL changes, it fetches fresh data.
  // Senior Pro-Tip: Pass filters to fetchJobs() to support backend filtering later!
  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(), // In production, this would be: fetchJobs(filters)
  });

  // Client-side fallback fallback processing until backend search is active
  const filteredJobs = useMemo(() => {
    return searchJobs(jobs, filters);
  }, [jobs, filters]);

  // 3. State updaters now simply update the URL string
  function setFilter(key: string, value: string) {
    const newParams = new URLSearchParams(searchParams);

    if (key === "location" || key === "department") {
      const currentValues = newParams.getAll(key);
      if (currentValues.includes(value)) {
        // Toggle off
        const filtered = currentValues.filter((v) => v !== value);
        newParams.delete(key);
        filtered.forEach((v) => newParams.append(key, v));
      } else {
        // Toggle on
        newParams.append(key, value);
      }
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  }

  function handleSearchSubmit(p: { keyword: string; location: string }) {
    const newParams = new URLSearchParams(searchParams);
    if (p.keyword) newParams.set("keyword", p.keyword);
    else newParams.delete("keyword");

    if (p.location) {
      newParams.delete("location");
      newParams.append("location", p.location);
    } else {
      newParams.delete("location");
    }
    setSearchParams(newParams);
  }

  function reset() {
    setSearchParams(new URLSearchParams()); // Wipes the URL clean back to default
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4">
      <div className="space-y-4">
        <PageHeader
          title="Find Your Next Job"
          subtitle="Search by role or location"
        />

        <JobSearchBar
          jobs={jobs}
          // Pass the plain string values directly from our derived URL filters object
          keywordValue={filters.keyword}
          locationValue={filters.location[0] || ""}
          onSearch={handleSearchSubmit}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <JobFiltersSideBar
            jobs={jobs}
            filters={filters}
            setFilter={setFilter}
            reset={reset}
          />
        </aside>

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

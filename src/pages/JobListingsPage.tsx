// Purpose: Page that fetches and displays a list of job postings using URL state.
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchJobs } from "../api/jobs.api";
import type { JobListing } from "../types/job.types";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageHeader from "../components/layout/PageHeader";
import JobSearchBar from "../components/ui/JobSearchBar";
import JobFiltersSideBar from "../components/ui/JobFiltersSideBar";

import { searchJobs } from "../utils/search/searchEngine";

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ITEMS_PER_PAGE = 10;

  // 1. Derive page index directly from the URL parameters
  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  // 2. Derive filter state directly from the URL query parameters
  const filters = useMemo(() => {
    return {
      keyword: searchParams.get("keyword") || "",
      location: searchParams.getAll("location"),
      department: searchParams.getAll("department"),
      sort: (searchParams.get("sort") as "newest" | "relevance") || "newest",
    };
  }, [searchParams]);


  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"], 
    queryFn: () => fetchJobs(),
  });

 
  const filteredJobs = useMemo(() => {
    return searchJobs(jobs, filters);
  }, [jobs, filters]);

  // Paginate the filtered array locally on the client side
  const paginatedJobs = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, page]);

  // Total pages calculation based on matching search results
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  }, [filteredJobs.length]);

  // Helper utility to safely transition URL state parameters while resetting page to 1
  function updateUrlParams(updater: (params: URLSearchParams) => void) {
    const newParams = new URLSearchParams(searchParams);
    updater(newParams);
    newParams.set("page", "1"); // Drop back to page 1 when filters vary
    setSearchParams(newParams);
  }

  // Filter State updaters update the URL string
  function setFilter(key: string, value: string) {
    updateUrlParams((newParams) => {
      if (key === "location" || key === "department") {
        const currentValues = newParams.getAll(key);
        if (currentValues.includes(value)) {
          const filtered = currentValues.filter((v) => v !== value);
          newParams.delete(key);
          filtered.forEach((v) => newParams.append(key, v));
        } else {
          newParams.append(key, value);
        }
      } else {
        newParams.set(key, value);
      }
    });
  }

  function handleSearchSubmit(p: { keyword: string; location: string }) {
    updateUrlParams((newParams) => {
      if (p.keyword) newParams.set("keyword", p.keyword);
      else newParams.delete("keyword");

      newParams.delete("location");
      if (p.location) {
        newParams.append("location", p.location);
      }
    });
  }

  function handlePageChange(newPage: number) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
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
          // Explicit key clears rendering loops by managing lifecycle changes cleanly
          key={`${filters.keyword}-${filters.location[0] || ""}`}
          jobs={jobs}
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

        <main className="lg:col-span-9 space-y-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <p role="alert" className="text-error">
              Failed to load jobs
            </p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-slate-500">No jobs found</p>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {paginatedJobs.map((job: JobListing) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* PAGINATION PANEL */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

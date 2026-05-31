// Purpose: Page that fetches and displays a list of job postings using URL state.
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import JobCard from "../components/layout/JobCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageHeader from "../components/layout/PageHeader";
import JobSearchBar from "../components/ui/JobSearchBar";
import JobFiltersSideBar from "../components/ui/JobFiltersSideBar";

import { useJobs } from "../hooks/useJobs";
import { searchJobs } from "../utils/search/searchEngine";

const ITEMS_PER_PAGE = 10;

type SortOption = "newest" | "relevance";

type ListingFilters = {
  keyword: string;
  location: string[];
  department: string[];
  sort: SortOption;
};

function getSort(value: string | null): SortOption {
  return value === "relevance" ? "relevance" : "newest";
}

function getPage(value: string | null): number {
  const page = Number.parseInt(value || "1", 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    return getPage(searchParams.get("page"));
  }, [searchParams]);

  const filters = useMemo<ListingFilters>(
    () => ({
      keyword: searchParams.get("keyword") || "",
      location: searchParams.getAll("location"),
      department: searchParams.getAll("department"),
      sort: getSort(searchParams.get("sort")),
    }),
    [searchParams],
  );

  const { data: jobs = [], isLoading, isError } = useJobs();

  const filteredJobs = useMemo(() => {
    return searchJobs(jobs, filters);
  }, [jobs, filters]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  }, [filteredJobs.length]);

  const safePage = Math.min(page, totalPages);

  const paginatedJobs = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, safePage]);

  function updateUrlParams(
    updater: (params: URLSearchParams) => void,
    options: { resetPage?: boolean } = { resetPage: true },
  ) {
    const nextParams = new URLSearchParams(searchParams);

    updater(nextParams);

    if (options.resetPage !== false) {
      nextParams.set("page", "1");
    }

    if (nextParams.get("page") === "1") {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  }

  function updateKeyword(value: string) {
    updateUrlParams((nextParams) => {
      const keyword = value.trim();

      if (keyword) {
        nextParams.set("keyword", keyword);
      } else {
        nextParams.delete("keyword");
      }
    });
  }

  function updateSearchLocation(value: string) {
    updateUrlParams((nextParams) => {
      const location = value.trim();

      nextParams.delete("location");

      if (location) {
        nextParams.append("location", location);
      }
    });
  }

  function setFilter(key: string, value: string) {
    updateUrlParams((nextParams) => {
      if (key !== "location" && key !== "department") {
        if (value.trim()) {
          nextParams.set(key, value);
        } else {
          nextParams.delete(key);
        }

        return;
      }

      if (value === "__clear") {
        nextParams.delete(key);
        return;
      }

      const currentValues = nextParams.getAll(key);
      const alreadySelected = currentValues.includes(value);

      nextParams.delete(key);

      const nextValues = alreadySelected
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value];

      nextValues.forEach((nextValue) => {
        if (nextValue.trim()) {
          nextParams.append(key, nextValue);
        }
      });
    });
  }

  function handleSearchSubmit(params: { keyword: string; location: string }) {
    updateUrlParams((nextParams) => {
      const keyword = params.keyword.trim();
      const location = params.location.trim();

      if (keyword) {
        nextParams.set("keyword", keyword);
      } else {
        nextParams.delete("keyword");
      }

      nextParams.delete("location");

      if (location) {
        nextParams.append("location", location);
      }
    });
  }

  function handlePageChange(nextPage: number) {
    const clampedPage = Math.min(Math.max(nextPage, 1), totalPages);
    const nextParams = new URLSearchParams(searchParams);

    if (clampedPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(clampedPage));
    }

    setSearchParams(nextParams);
  }

  function reset() {
    setSearchParams({});
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
          keywordValue={filters.keyword}
          locationValue={filters.location[0] || ""}
          onKeywordChange={updateKeyword}
          onLocationChange={updateSearchLocation}
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
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600 font-medium">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
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

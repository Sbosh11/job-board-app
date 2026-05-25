// Purpose: Read and update job filter state from URL search params.
import { useSearchParams } from "react-router-dom";

export type JobFiltersState = {
  department: string;
  location: string;
  sort: "newest" | "relevance";
};

const DEFAULTS: JobFiltersState = {
  department: "",
  location: "",
  sort: "newest",
};

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: JobFiltersState = {
    department: searchParams.get("department") || DEFAULTS.department,
    location: searchParams.get("location") || DEFAULTS.location,
    sort:
      (searchParams.get("sort") as JobFiltersState["sort"]) || DEFAULTS.sort,
  };

  function setFilter<K extends keyof JobFiltersState>(
    key: K,
    value: JobFiltersState[K],
  ) {
    const newParams = new URLSearchParams(searchParams);

    if (!value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  }

  function resetFilters() {
    setSearchParams({});
  }

  return {
    filters,
    setFilter,
    resetFilters,
  };
}

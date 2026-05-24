import { useMemo, useState } from "react";
import type { JobSearchParams } from "../types/job.types";
import { normalizeLocation } from "../utils/location/normalizeLocation";
import { saveHistory } from "../utils/search/history";
import { getSuggestions } from "../utils/search/getSuggestions";

export function useJobSearch() {
  const [filters, setFilters] = useState<JobSearchParams>({
    keyword: "",
    location: "",
  });

  const [input, setInput] = useState({
    keyword: "",
    location: "",
  });

  const suggestions = useMemo(() => {
    return getSuggestions(input.keyword);
  }, [input.keyword]);

  function updateField(field: keyof typeof input, value: string) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  function applySearch() {
    const normalized = {
      keyword: input.keyword.trim(),
      location: normalizeLocation(input.location),
    };

    setFilters(normalized);

    if (normalized.keyword || normalized.location) {
      saveHistory(`${normalized.keyword} ${normalized.location}`.trim());
    }
  }

  return {
    filters,
    input,
    suggestions,
    updateField,
    applySearch,
    setFilters,
  };
}
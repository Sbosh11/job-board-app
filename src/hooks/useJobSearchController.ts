// Purpose: Manage search input state and suggestion interactions.
import { useMemo, useState } from "react";
import type { JobListing } from "../types/job.types";

import {
  getKeywordSuggestions,
  getLocationSuggestions,
} from "../utils/suggestions/suggestionEngine";

import { resolveLocation } from "../utils/search/normalizeLocation";
import { saveHistory } from "../utils/search/history";

type SearchPayload = {
  keyword: string;
  location: string;
};

export function useJobSearchController(jobs: JobListing[]) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [activeField, setActiveField] = useState<"keyword" | "location">(
    "keyword",
  );

  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (activeField === "keyword") {
      return getKeywordSuggestions(keyword, jobs);
    }

    if (activeField === "location") {
      return getLocationSuggestions(location);
    }

    return [];
  }, [keyword, location, activeField, jobs]);

  function setField(field: "keyword" | "location", value: string) {
    if (field === "keyword") setKeyword(value);
    if (field === "location") setLocation(value);

    setActiveField(field);
    setOpen(true);
  }

  function applySuggestion(value: string) {
    if (activeField === "keyword") setKeyword(value);
    if (activeField === "location") setLocation(value);

    setOpen(false);
  }

  function clear() {
    setKeyword("");
    setLocation("");
    setOpen(false);
  }

  function search(onSearch: (p: SearchPayload) => void) {
    const payload = {
      keyword: keyword.trim(),
      location: resolveLocation(location),
    };

    onSearch(payload);

    if (payload.keyword) {
      saveHistory(payload.keyword);
    }

    setOpen(false);
  }

  return {
    keyword,
    location,
    setField,
    applySuggestion,
    search,
    clear,
    suggestions,
    activeField,
    open,
  };
}

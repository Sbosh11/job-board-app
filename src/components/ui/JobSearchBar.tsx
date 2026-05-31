// Purpose: Search inputs with suggestion dropdowns for jobs.
import { useEffect, useRef, useState } from "react";
import { Search, MapPin, X, Clock } from "lucide-react";
import { toast } from "sonner";

import type { JobListing } from "../../types/job.types";

import {
  getKeywordSuggestions,
  getLocationSuggestions,
} from "../../utils/suggestions/suggestionEngine";

import { getHistory, saveHistory } from "../../utils/search/history";

interface JobSearchBarProps {
  onSearch: (params: { keyword: string; location: string }) => void;
  jobs: JobListing[];
  initialKeyword?: string;
  initialLocation?: string;
}

export default function JobSearchBar({
  onSearch,
  jobs,
  initialKeyword = "",
  initialLocation = "",
}: JobSearchBarProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const [openField, setOpenField] = useState<"keyword" | "location" | null>(
    null,
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  const history = getHistory();

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpenField(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- KEYWORD ---------------- */
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setKeywordSuggestions(getKeywordSuggestions(value, jobs));
    setOpenField("keyword");
  };

  /* ---------------- LOCATION ---------------- */
  const handleLocationChange = (value: string) => {
    setLocation(value);
    setLocationSuggestions(getLocationSuggestions(value));
    setOpenField("location");
  };

  /* ---------------- SEARCH ---------------- */
  const handleSearch = () => {
    if (!keyword.trim() && !location.trim()) {
      toast.error("Enter a job title or location to start a search");
      return;
    }

    if (keyword.trim()) saveHistory(keyword);

    onSearch({ keyword, location });
    setOpenField(null);
  };

  const clearKeyword = () => setKeyword("");
  const clearLocation = () => setLocation("");

  const showKeywordDropdown =
    openField === "keyword" &&
    (keywordSuggestions.length > 0 || history.length > 0);

  const showLocationDropdown =
    openField === "location" && locationSuggestions.length > 0;

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row"
    >
      {/* ---------------- KEYWORD ---------------- */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />

          <label htmlFor="keyword-search" className="sr-only">
            Job title
          </label>
          <input
            id="keyword-search"
            name="keyword"
            type="text"
            placeholder="Job title"
            aria-label="Job title"
            aria-expanded={showKeywordDropdown}
            aria-controls="keyword-dropdown"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            onFocus={() => setOpenField("keyword")}
            className="h-12 w-full bg-transparent outline-none"
          />

          {keyword && (
            <button
              type="button"
              onClick={clearKeyword}
              aria-label="Clear keyword"
              className="cursor-pointer"
            >
              <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {showKeywordDropdown && (
          <div
            id="keyword-dropdown"
            role="listbox"
            aria-label="Keyword suggestions"
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-dropdown py-5"
          >
            {/* suggestions */}
            {keywordSuggestions.map((item, i) => (
              <button
                key={`k-${i}`}
                type="button"
                role="option"
                onClick={() => {
                  setKeyword(item);
                  setOpenField(null);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
              >
                {item}
              </button>
            ))}

            {/* history */}
            {keywordSuggestions.length === 0 &&
              history.length > 0 &&
              history.map((item, i) => (
                <button
                  key={`h-${i}`}
                  type="button"
                  onClick={() => {
                    setKeyword(item);
                    setOpenField(null);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                >
                  <Clock
                    className="h-3.5 w-3.5 text-slate-400"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* ---------------- LOCATION ---------------- */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <MapPin className="h-5 w-5 text-slate-400" aria-hidden="true" />

          <label htmlFor="location-search" className="sr-only">
            City or remote
          </label>
          <input
            id="location-search"
            name="location"
            type="text"
            placeholder="City or remote"
            aria-label="City or remote"
            aria-expanded={showLocationDropdown}
            aria-controls="location-dropdown"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => setOpenField("location")}
            className="h-12 w-full bg-transparent outline-none"
          />

          {location && (
            <button
              type="button"
              onClick={clearLocation}
              aria-label="Clear location"
              className="cursor-pointer"
            >
              <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {showLocationDropdown && (
          <div
            id="location-dropdown"
            role="listbox"
            aria-label="Location suggestions"
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-dropdown py-5"
          >
            {locationSuggestions.map((item, i) => (
              <button
                key={`l-${i}`}
                type="button"
                role="option"
                onClick={() => {
                  setLocation(item);
                  setOpenField(null);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- BUTTON ---------------- */}
      <button
        type="button"
        onClick={handleSearch}
        className="cursor-pointer h-12 rounded-full bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700"
      >
        Find Jobs
      </button>
    </div>
  );
}

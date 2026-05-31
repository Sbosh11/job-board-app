// Purpose: Fully controlled search inputs with local typing buffers.
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
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
  keywordValue: string;
  locationValue: string;
}

export default function JobSearchBar({
  onSearch,
  jobs,
  keywordValue,
  locationValue,
}: JobSearchBarProps) {
  // Local state tracks the active user typing input
  const [keyword, setKeyword] = useState(keywordValue);
  const [location, setLocation] = useState(locationValue);

  // Track the previous prop values to handle external updates (like a Reset button)
  // directly in the render cycle without using performance-killing useEffect loops.
  const [prevProps, setPrevProps] = useState({ keywordValue, locationValue });

  if (
    keywordValue !== prevProps.keywordValue ||
    locationValue !== prevProps.locationValue
  ) {
    setKeyword(keywordValue);
    setLocation(locationValue);
    setPrevProps({ keywordValue, locationValue });
  }

  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [openField, setOpenField] = useState<"keyword" | "location" | null>(
    null,
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const history = getHistory();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpenField(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setKeywordSuggestions(getKeywordSuggestions(value, jobs));
    setOpenField("keyword");
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setLocationSuggestions(getLocationSuggestions(value));
    setOpenField("location");
  };

  const handleSearch = () => {
    if (!keyword.trim() && !location.trim()) {
      toast.error(
        "Enter a job title, department or location to start a search",
      );
      return;
    }
    if (keyword.trim()) saveHistory(keyword);
    onSearch({ keyword, location });
    setOpenField(null);
  };

  const clearKeyword = () => {
    setKeyword("");
    onSearch({ keyword: "", location });
  };

  const clearLocation = () => {
    setLocation("");
    onSearch({ keyword, location: "" });
  };

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
      {/* KEYWORD FIELD */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          <input
            id="keyword-search"
            type="text"
            placeholder="Job title or department"
            aria-label="Job title or department search input"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            onFocus={() => setOpenField("keyword")}
            className="h-12 w-full bg-transparent outline-none"
          />
          {keyword && (
            <button
              type="button"
              onClick={clearKeyword}
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
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-dropdown py-5"
          >
            {keywordSuggestions.map((item, i) => (
              <button
                key={`k-${i}`}
                type="button"
                onClick={() => {
                  setKeyword(item);
                  onSearch({ keyword: item, location });
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

      {/* LOCATION FIELD */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <MapPin className="h-5 w-5 text-slate-400" aria-hidden="true" />
          <input
            id="location-search"
            type="text"
            placeholder="City or remote"
            aria-label="City or remote"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => setOpenField("location")}
            className="h-12 w-full bg-transparent outline-none"
          />
          {location && (
            <button
              type="button"
              onClick={clearLocation}
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
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-dropdown py-5"
          >
            {locationSuggestions.map((item, i) => (
              <button
                key={`l-${i}`}
                type="button"
                onClick={() => {
                  setLocation(item);
                  onSearch({ keyword, location: item });
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

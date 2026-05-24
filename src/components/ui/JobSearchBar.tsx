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
}

export default function JobSearchBar({ onSearch, jobs }: JobSearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

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
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
          <Search className="h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Job title, skill or company"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            onFocus={() => setOpenField("keyword")}
            className="h-12 w-full bg-transparent outline-none"
          />

          {keyword && (
            <X
              className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-600"
              onClick={clearKeyword}
            />
          )}
        </div>

        {showKeywordDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border bg-white shadow-lg">
            {/* suggestions */}
            {keywordSuggestions.map((item, i) => (
              <div
                key={`k-${i}`}
                onClick={() => {
                  setKeyword(item);
                  setOpenField(null);
                }}
                className="px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
              >
                {item}
              </div>
            ))}

            {/* history */}
            {keywordSuggestions.length === 0 &&
              history.length > 0 &&
              history.map((item, i) => (
                <div
                  key={`h-${i}`}
                  onClick={() => {
                    setKeyword(item);
                    setOpenField(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                >
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{item}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ---------------- LOCATION ---------------- */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
          <MapPin className="h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="City, province or remote"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => setOpenField("location")}
            className="h-12 w-full bg-transparent outline-none"
          />

          {location && (
            <X
              className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-600"
              onClick={clearLocation}
            />
          )}
        </div>

        {showLocationDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border bg-white shadow-lg">
            {locationSuggestions.map((item, i) => (
              <div
                key={`l-${i}`}
                onClick={() => {
                  setLocation(item);
                  setOpenField(null);
                }}
                className="px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- BUTTON ---------------- */}
      <button
        onClick={handleSearch}
        className="h-12 rounded-full bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700"
      >
        Find Jobs
      </button>
    </div>
  );
}

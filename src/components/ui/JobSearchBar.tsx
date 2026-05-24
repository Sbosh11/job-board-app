import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { toast } from "sonner";

import type { JobListing } from "../../types/job.types";
import { getSuggestions } from "../../utils/suggestions/suggestionEngine";
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

  const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const history = getHistory();

  const handleKeywordChange = (value: string) => {
    setKeyword(value);

    const results = getSuggestions(value, jobs);

    setKeywordSuggestions(results);

    setShowKeywordDropdown(true);
    setShowLocationDropdown(false);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);

    const results = getSuggestions(value, jobs);

    setLocationSuggestions(results);

    setShowLocationDropdown(true);
    setShowKeywordDropdown(false);
  };

  const handleSearch = () => {
    if (!keyword.trim() && !location.trim()) {
      toast.error("Enter a job title or location to start a search");
      return;
    }

    if (keyword.trim()) {
      saveHistory(keyword);
    }

    onSearch({
      keyword,
      location,
    });

    setShowKeywordDropdown(false);
    setShowLocationDropdown(false);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row">
      {/* KEYWORD */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
          <Search className="h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Job title, skill or company"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            onFocus={() => {
              setShowKeywordDropdown(true);
              setShowLocationDropdown(false);
            }}
            className="h-12 w-full bg-transparent outline-none"
          />
        </div>

        {/* Keyword suggestions */}
        {showKeywordDropdown && keywordSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {keywordSuggestions.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setKeyword(item);
                  setShowKeywordDropdown(false);
                }}
                className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* History ONLY under keyword */}
        {showKeywordDropdown &&
          keywordSuggestions.length === 0 &&
          history.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <p className="border-b border-slate-100 px-4 py-2 text-xs font-medium text-slate-400">
                Recent searches
              </p>

              {history.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setKeyword(item);
                    setShowKeywordDropdown(false);
                  }}
                  className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* LOCATION */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
          <MapPin className="h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="City, province or remote"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => {
              setShowLocationDropdown(true);
              setShowKeywordDropdown(false);
            }}
            className="h-12 w-full bg-transparent outline-none"
          />
        </div>

        {/* Location suggestions ONLY */}
        {showLocationDropdown && locationSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {locationSuggestions.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setLocation(item);
                  setShowLocationDropdown(false);
                }}
                className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSearch}
        className="h-12 rounded-full bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700"
      >
        Find Jobs
      </button>
    </div>
  );
}

// Purpose: Sidebar UI to filter jobs by location and department.
import { useMemo, useState } from "react";
import type { JobListing } from "../../types/job.types";

type Props = {
  jobs: JobListing[];
  filters: {
    location: string[];
    department: string[];
  };
  setFilter: (key: string, value: string) => void;
  reset: () => void;
};

export default function JobFiltersSideBar({
  jobs,
  filters,
  setFilter,
  reset,
}: Props) {
  const [open, setOpen] = useState({
    location: true,
    department: true,
  });

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))),
    [jobs],
  );

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.department))),
    [jobs],
  );

  return (
    <aside className="bg-white rounded-2xl shadow-sm p-4 space-y-6">
      {/* LOCATION */}
      <div>
        <button
          type="button"
          className="w-full flex justify-between text-sm font-medium"
          aria-expanded={open.location}
          aria-controls="location-filters"
          onClick={() => setOpen((p) => ({ ...p, location: !p.location }))}
        >
          Location
          <span className="text-blue-600">{open.location ? "−" : "+"}</span>
        </button>

        {open.location && (
          <div id="location-filters" className="space-y-1 mt-2">
            <label className="flex justify-between text-sm">
              All
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={filters.location.length === 0}
                onChange={() => setFilter("location", "__clear")}
              />
            </label>

            {locations.map((l) => (
              <label key={l} className="flex justify-between text-sm">
                {l}
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={filters.location.includes(l)}
                  onChange={() => setFilter("location", l)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* DEPARTMENT */}
      <div>
        <button
          type="button"
          className="w-full flex justify-between text-sm font-medium"
          aria-expanded={open.department}
          aria-controls="department-filters"
          onClick={() => setOpen((p) => ({ ...p, department: !p.department }))}
        >
          Department
          <span className="text-blue-600">{open.department ? "−" : "+"}</span>
        </button>

        {open.department && (
          <div id="department-filters" className="space-y-1 mt-2">
            <label className="flex justify-between text-sm">
              All
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={filters.department.length === 0}
                onChange={() => setFilter("department", "__clear")}
              />
            </label>

            {departments.map((d) => (
              <label key={d} className="flex justify-between text-sm">
                {d}
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={filters.department.includes(d)}
                  onChange={() => setFilter("department", d)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
      >
        Reset
      </button>
    </aside>
  );
}

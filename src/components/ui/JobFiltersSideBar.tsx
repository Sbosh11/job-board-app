// Purpose: Sidebar UI to filter jobs by location and department with a right-aligned mobile drawer.
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
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

  // Controls whether the mobile drawer is slid open
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // FIXED: Removed accidental parameter to fix the TypeScript/ESLint errors
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))),
    [jobs],
  );

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.department))),
    [jobs],
  );

  return (
    <>
      {/* MOBILE TRIGGER BUTTON: Positioned to the right side */}
      <div className="md:hidden mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium shadow-sm hover:bg-gray-50 text-gray-700"
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          Filter Jobs
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER 
          Mobile: Fixed right drawer, slides left into view (translate-x-full to translate-x-0)
          Desktop: Standard block item, always visible
      */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto
          md:static md:w-full md:max-w-none md:shadow-sm md:rounded-2xl md:p-4 md:translate-x-0 md:block md:z-auto
          ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* LOCATION */}
          <div>
            <button
              type="button"
              className="w-full flex justify-between text-sm font-medium text-gray-900"
              aria-expanded={open.location}
              aria-controls="location-filters"
              onClick={() => setOpen((p) => ({ ...p, location: !p.location }))}
            >
              Location
              <span className="text-blue-600 font-bold">
                {open.location ? "−" : "+"}
              </span>
            </button>

            {open.location && (
              <div id="location-filters" className="space-y-1 mt-2">
                <label className="flex justify-between text-sm py-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  All
                  <input
                    type="checkbox"
                    className="accent-blue-600 rounded"
                    checked={filters.location.length === 0}
                    onChange={() => setFilter("location", "__clear")}
                  />
                </label>

                {locations.map((l) => (
                  <label
                    key={l}
                    className="flex justify-between text-sm py-1 cursor-pointer text-gray-600 hover:text-gray-900"
                  >
                    {l}
                    <input
                      type="checkbox"
                      className="accent-blue-600 rounded"
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
              className="w-full flex justify-between text-sm font-medium text-gray-900"
              aria-expanded={open.department}
              aria-controls="department-filters"
              onClick={() =>
                setOpen((p) => ({ ...p, department: !p.department }))
              }
            >
              Department
              <span className="text-blue-600 font-bold">
                {open.department ? "−" : "+"}
              </span>
            </button>

            {open.department && (
              <div id="department-filters" className="space-y-1 mt-2">
                <label className="flex justify-between text-sm py-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  All
                  <input
                    type="checkbox"
                    className="accent-blue-600 rounded"
                    checked={filters.department.length === 0}
                    onChange={() => setFilter("department", "__clear")}
                  />
                </label>

                {departments.map((d) => (
                  <label
                    key={d}
                    className="flex justify-between text-sm py-1 cursor-pointer text-gray-600 hover:text-gray-900"
                  >
                    {d}
                    <input
                      type="checkbox"
                      className="accent-blue-600 rounded"
                      checked={filters.department.includes(d)}
                      onChange={() => setFilter("department", d)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={reset}
              className="w-full md:w-auto text-center cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 py-2 border border-dashed border-blue-200 rounded-xl md:border-none md:p-0 md:text-left"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

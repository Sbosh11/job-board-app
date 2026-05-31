// Purpose: Provide job keyword and location suggestions.
import Fuse from "fuse.js";
import type { JobListing } from "../../types/job.types";

/* ---------------- CLEAN ---------------- */
function clean(v: string) {
  return v.trim().replace(/\s+/g, " ");
}

/* ---------------- STATIC CITIES ---------------- */
const cities = ["Pretoria", "Johannesburg", "Cape Town", "Durban", "Remote"];

/* ---------------- JOB SUGGESTIONS ---------------- */
export function getKeywordSuggestions(
  value: string,
  jobs: JobListing[],
): string[] {
  const input = value.trim().toLowerCase();
  if (input.length < 2) return [];

  const pool = Array.from(
    new Set(jobs.flatMap((j) => [clean(j.title), clean(j.department)])),
  );

  const fuse = new Fuse(pool, {
    threshold: 0.3,
    ignoreLocation: true,
  });

  const prefix = pool.filter((v) => v.toLowerCase().startsWith(input));

  const fuzzy = fuse.search(input).map((r) => r.item);

  return Array.from(new Set([...prefix, ...fuzzy])).slice(0, 6);
}

/* ---------------- LOCATION SUGGESTIONS ---------------- */
export function getLocationSuggestions(value: string): string[] {
  const input = value.trim().toLowerCase();
  if (input.length < 1) return [];

  const fuse = new Fuse(cities, {
    threshold: 0.3,
    ignoreLocation: true,
  });

  const prefix = cities.filter((c) => c.toLowerCase().startsWith(input));

  const fuzzy = fuse.search(input).map((r) => r.item);

  return Array.from(new Set([...prefix, ...fuzzy])).slice(0, 5);
}

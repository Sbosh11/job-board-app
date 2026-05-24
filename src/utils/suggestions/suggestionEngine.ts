import Fuse from "fuse.js";
import cities from "../../data/cities.json";
import type { JobListing } from "../../types/job.types";

let fuse: Fuse<string> | null = null;
let lastKey = "";

function buildIndex(jobs: JobListing[]) {
  const jobTerms = jobs.flatMap((j) => [j.title, j.department]);

  const cityTerms = cities.flatMap((c) => [c.label, ...c.aliases]);

  return [...new Set([...jobTerms, ...cityTerms])];
}

function buildFuse(index: string[]) {
  return new Fuse(index, {
    threshold: 0.3,
    ignoreLocation: true,
  });
}

export function getSuggestions(value: string, jobs: JobListing[] = []) {
  const input = value.trim().toLowerCase();
  if (!input) return [];

  // rebuild only if needed
  const key = jobs.length + "|cities";

  if (!fuse || key !== lastKey) {
    const index = buildIndex(jobs);
    fuse = buildFuse(index);
    lastKey = key;
  }

  return fuse
    .search(input)
    .slice(0, 6)
    .map((r) => r.item);
}

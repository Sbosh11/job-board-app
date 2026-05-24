import type { JobListing } from "../../types/job.types";
import { resolveLocation } from "./normalizeLocation";

export interface SearchParams {
  keyword: string;
  location: string;
}

export function searchJobs(
  jobs: JobListing[],
  params: SearchParams,
): JobListing[] {
  const keyword = params.keyword.trim().toLowerCase();
  const location = resolveLocation(params.location);

  return jobs.filter((job) => {
    const matchesKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.department.toLowerCase().includes(keyword);

    const matchesLocation =
      !location || job.location.toLowerCase().includes(location.toLowerCase());

    return matchesKeyword && matchesLocation;
  });
}

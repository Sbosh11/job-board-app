// Purpose: Search scoring and matching utilities.
import type { JobListing } from "../../types/job.types";
import { resolveLocation } from "./normalizeLocation";

export interface SearchParams {
  keyword: string;
  location: string[];
  department: string[];
  sort: "newest" | "relevance";
}

export function searchJobs(
  jobs: JobListing[],
  params: SearchParams,
): JobListing[] {
  const keyword = params.keyword.trim().toLowerCase();

  const locations = params.location.map((l) =>
    resolveLocation(l).toLowerCase(),
  );

  const departments = params.department.map((d) => d.toLowerCase());

  let result = jobs.filter((job) => {
    const matchesKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.department.toLowerCase().includes(keyword);

    const matchesLocation =
      locations.length === 0 ||
      locations.some((loc) => job.location.toLowerCase().includes(loc));

    const matchesDepartment =
      departments.length === 0 ||
      departments.some((dep) => job.department.toLowerCase().includes(dep));

    return matchesKeyword && matchesLocation && matchesDepartment;
  });

  if (params.sort === "relevance") {
    result = result.sort((a, b) => {
      const score = (job: JobListing) => {
        let s = 0;
        if (keyword && job.title.toLowerCase().includes(keyword)) s += 2;
        if (keyword && job.department.toLowerCase().includes(keyword)) s += 1;
        return s;
      };

      return score(b) - score(a);
    });
  }

  return result;
}

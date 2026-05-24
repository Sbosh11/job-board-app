import { useQuery } from "@tanstack/react-query";
import type { JobListing, JobSearchParams } from "../types/job.types";
import { fetchJobs } from "../api/jobs.api";

export function useJobs(params?: JobSearchParams) {
  return useQuery<JobListing[]>({
    queryKey: ["jobs", params],
    queryFn: () => fetchJobs(params),
    staleTime: 1000 * 60 * 5,
  });
}

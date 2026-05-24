import { useQuery } from "@tanstack/react-query";
import type { JobListing } from "../types/job.types";
import { fetchJobById } from "../api/jobs.api";

export function useJob(id?: string) {
  return useQuery<JobListing>({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id!),
    enabled: !!id,
  });
}
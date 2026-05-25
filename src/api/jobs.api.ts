// Purpose: API helpers for fetching job data.
import { api } from "./client";
import type { JobListing, JobSearchParams } from "../types/job.types";

export async function fetchJobs(
  params?: JobSearchParams,
): Promise<JobListing[]> {
  const res = await api.get("/jobs", { params });
  return res.data;
}

export async function fetchJobById(id: string): Promise<JobListing> {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
}

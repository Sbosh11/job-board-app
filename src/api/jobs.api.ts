import { api } from "./client";
import type { JobListing } from "../types/job.types";

export async function fetchJobs(): Promise<JobListing[]> {
  const res = await api.get("/jobs");
  return res.data;
}

export async function fetchJobById(id: string): Promise<JobListing> {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
}
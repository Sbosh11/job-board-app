import type { JobListing } from "../types/job.types";
import type { JobApplication } from "../types/jobApplication.types";

const API_URL = import.meta.env.VITE_API_URL;

// GET: All Jobs

export async function fetchJobs(): Promise<JobListing[]> {
  const res = await fetch(`${API_URL}/jobs`);

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

// GET: Single Job (Details Page)

export async function fetchJobById(id: string): Promise<JobListing> {
  const res = await fetch(`${API_URL}/jobs/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch job");
  }

  return res.json();
}

// POST: Submit Application

export async function submitApplication(
  data: JobApplication,
): Promise<JobApplication> {
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit application");
  }

  return res.json();
}

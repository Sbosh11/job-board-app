// Purpose: API helper to submit job applications.
import { api } from "./client";
import type { JobApplication } from "../types/jobApplication.types";

export async function submitApplication(
  data: JobApplication,
): Promise<JobApplication> {
  const res = await api.post("/applications", data);
  return res.data;
}

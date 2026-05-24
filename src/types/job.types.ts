export type JobStatus = "open" | "closed";

export interface JobListing {
  id: number;
  title: string;
  location: string;
  department: string;
  description: string;
  status: JobStatus;
}

export interface JobSearchParams {
  keyword?: string;
  location?: string;
}

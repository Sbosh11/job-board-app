export type JobStatus = "open" | "closed";

export interface JobListing {
  id: string;
  title: string;
  location: string;
  department: string;
  description: string;
  status: JobStatus;
  postedAt: string;
}

export interface JobSearchParams {
  keyword?: string;
  location?: string[];
  department?: string[];
  sort?: "newest" | "relevance";
  _page?: number;  
  _limit?: number; 
  _sort?: string;  
  _order?: "asc" | "desc";
  q?: string;
}

// Purpose: Types for job application payloads.
export type JobApplication = {
  id?: string; // 👈 Make sure this allows a string
  jobId: number;
  fullName: string;
  email: string;
  phone: string | null;
  coverLetter: string | null;
};

export type JobApplicationWithId = JobApplication & { id: string };

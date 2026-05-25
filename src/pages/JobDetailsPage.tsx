// Purpose: Page that shows details for a single job.
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useJob } from "../hooks/useJob";
import JobSearchBar from "../components/ui/JobSearchBar";
import { useJobs } from "../hooks/useJobs";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { data: jobsData = [] } = useJobs();

  const { data: job, isLoading, isError, error } = useJob(id);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load job details");
    }
  }, [isError]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <p role="alert" className="text-error">
        {error?.message}
      </p>
    );
  }

  if (!job) {
    return <p className="text-slate-500">Job not found</p>;
  }

  return (
    <div className="space-y-6">
      <JobSearchBar
        jobs={jobsData}
        onSearch={(p) => {
          const params = new URLSearchParams();
          if (p.keyword) params.set("keyword", p.keyword);
          if (p.location) params.set("location", p.location);

          navigate(`/?${params.toString()}`);
        }}
      />
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
        <h1 className="text-2xl font-bold">{job.title}</h1>

        <p className="text-slate-500">
          {job.location} • {job.department}
        </p>

        <Link
          to={`/jobs/${job.id}/apply`}
          className="h-12 rounded-full bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700 inline-flex items-center gap-2 mt-4"
        >
          Apply Now
        </Link>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
        <p className="text-slate-600">{job.description}</p>
      </div>
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useJob } from "../hooks/useJob";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { job, loading, error } = useJob(id);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!job) {
    return <p className="text-slate-500">Job not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
        <h1 className="text-2xl font-bold">{job.title}</h1>

        <p className="text-slate-500">
          {job.location} • {job.department}
        </p>

        <Link
          to={`/jobs/${job.id}/apply`}
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Apply Now
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
        <p className="text-slate-600">{job.description}</p>
      </div>
    </div>
  );
}
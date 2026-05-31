import { Link } from "react-router-dom";
import type { JobListing } from "../../types/job.types";

interface Props {
  job: JobListing;
}

export default function JobCard({ job }: Props) {
  const truncate = (text: string, max = 70) => {
    if (text.length <= max) return text;

    const trimmed = text.slice(0, max);
    const lastSpace = trimmed.lastIndexOf(" ");

    return trimmed.slice(0, lastSpace) + " ...";
  };

  return (
    <article
      className="
        job-card
        group
        relative
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all
        border border-transparent
        hover:border-slate-100
        focus-within:ring-2
        focus-within:ring-blue-500
        focus-within:ring-offset-2
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-brand">{job.title}</h2>

          <p className="text-sm text-slate-500 mt-1">
            {job.location} • {job.department}
          </p>
        </div>

        <span
          className="
            text-xs
            px-2 py-1
            rounded-full
            bg-emerald-50
            text-emerald-600
          "
        >
          {job.status}
        </span>
      </div>

      <p className="text-sm text-slate-600 mt-3 line-clamp-2">
        {truncate(job.description)}
      </p>

      <Link
        to={`/jobs/${job.id}`}
        className="job-card-link inline-block mt-4 text-blue-600 text-sm font-medium group-hover:underline"
      >
        View Details
        <span className="sr-only"> for {job.title}</span>
        <span aria-hidden="true"> →</span>
      </Link>
    </article>
  );
}

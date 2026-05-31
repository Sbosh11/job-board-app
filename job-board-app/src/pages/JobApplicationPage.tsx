// Purpose: Job application form page.
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { submitApplication } from "../api/application.api";
import { useAppForm } from "../hooks/useAppForm";
import { formFieldClass } from "../components/ui/formFieldClass";
import JobSearchBar from "../components/ui/JobSearchBar";
import { useJobs } from "../hooks/useJobs";
import { useJob } from "../hooks/useJob";

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  website?: string; // honeypot
};

export default function JobApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isSuccessState = searchParams.get("success") === "true";

  const [submitError, setSubmitError] = useState("");

  const { data: jobsData = [] } = useJobs();
  const { data: job } = useJob(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useAppForm<FormValues>();

  const submitHandler = async (data: FormValues) => {
    try {
      setSubmitError("");

      // Honeypot protection (silent fail)
      if (data.website) return;

      await submitApplication({
        jobId: Number(id),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        coverLetter: data.coverLetter || "",
      });

      // Persist success in URL (stable across remounts)
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("success", "true");
        return params;
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const handleSearch = (p: { keyword: string; location: string }) => {
    const params = new URLSearchParams();

    if (p.keyword) params.set("keyword", p.keyword);
    if (p.location) params.set("location", p.location);

    navigate(`/?${params.toString()}`);
  };

  // SUCCESS VIEW (URL-driven, stable)
  if (isSuccessState) {
    return (
      <div className="space-y-6">
        <JobSearchBar jobs={jobsData} onSearch={handleSearch} />

        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm"
            role="status"
            aria-live="polite"
          >
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              Application Submitted Successfully
            </h2>

            <p className="text-blue-700 mb-6">
              Your application has been sent to the employer.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => navigate(`/jobs/${id}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
              >
                Back to Job
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-full font-medium hover:bg-slate-300 transition"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORM VIEW
  return (
    <div className="space-y-6">
      <JobSearchBar jobs={jobsData} onSearch={handleSearch} />

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        noValidate
      >
        {/* Header */}
        <div className="px-6 py-5 border-b bg-slate-50 flex items-start justify-between">
          <div className="flex-1">
            {job && (
              <>
                <h2 className="text-lg font-semibold text-brand">
                  {job.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {job.location} • {job.department}
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate(`/jobs/${id}`)}
            className="ml-4 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name *</label>
            <input
              className={formFieldClass}
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 2, message: "Too short" },
              })}
            />
            {errors.fullName && (
              <p className="text-sm text-error">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email *</label>
            <input
              className={formFieldClass}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone</label>
            <input className={formFieldClass} {...register("phone")} />
          </div>

          {/* Cover Letter */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Letter</label>
            <textarea
              rows={5}
              className={formFieldClass}
              {...register("coverLetter")}
            />
          </div>

          {submitError && (
            <div className="text-sm text-error bg-red-50 border border-red-200 p-3 rounded-lg">
              {submitError}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-3 px-10 rounded-full font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

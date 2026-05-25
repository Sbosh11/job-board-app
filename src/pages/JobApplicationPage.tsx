// Purpose: Job application form page.
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitApplication } from "../api/application.api";
import { useAppForm } from "../hooks/useAppForm";
import { createFormSubmit } from "../utils/form/formSubmitHandler";
import { formFieldClass } from "../components/ui/formFieldClass";
import JobSearchBar from "../components/ui/JobSearchBar";
import { useJobs } from "../hooks/useJobs";

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;

  // Honeypot spam field
  website?: string;
};

export default function JobApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { data: jobsData = [] } = useJobs();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useAppForm<FormValues>();

  const onSubmit = createFormSubmit<FormValues>(
    async (data) => {
      // Honeypot spam protection
      if (data.website) {
        throw new Error("Spam detected");
      }

      return submitApplication({
        ...data,
        jobId: Number(id),
        phone: data.phone || "",
        coverLetter: data.coverLetter || "",
      });
    },
    {
      successMessage: "Application submitted successfully",
      errorMessage: "Failed to submit application",
    },
  );

  const submitHandler = async (data: FormValues) => {
    try {
      setSubmitError("");

      await onSubmit(data);

      setSuccess(true);
      reset();
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

  if (success) {
    return (
      <div
        className="text-center py-20 text-emerald-600 font-semibold"
        role="status"
        aria-live="polite"
      >
        Application submitted successfully
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobSearchBar jobs={jobsData} onSearch={handleSearch} />

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        noValidate
      >
        {/* Header */}
        <div className="px-6 py-5 border-b bg-slate-50">
          <h1 className="text-lg font-semibold text-slate-900">
            Job Application
          </h1>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Honeypot field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>

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
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-slate-700"
            >
              Full Name
              <span className="ml-1 text-slate-700" aria-hidden="true">
                *
              </span>
            </label>

            <input
              id="fullName"
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.fullName}
              aria-required="true"
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name is too short",
                },
              })}
              className={formFieldClass}
              placeholder="John Doe"
            />

            {errors.fullName && (
              <p
                id="fullName-error"
                className="text-sm text-error"
                role="alert"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email Address
              <span className="ml-1 text-slate-700" aria-hidden="true">
                *
              </span>
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className={formFieldClass}
              placeholder="john@example.com"
            />

            {errors.email && (
              <p id="email-error" className="text-sm text-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              {...register("phone")}
              className={formFieldClass}
              placeholder="+27 71 234 5678"
            />
          </div>

          {/* Cover Letter */}
          <div className="space-y-1">
            <label
              htmlFor="coverLetter"
              className="text-sm font-medium text-slate-700"
            >
              Cover Letter
            </label>

            <textarea
              id="coverLetter"
              rows={5}
              {...register("coverLetter")}
              className={formFieldClass}
              placeholder="Tell the employer why you are a good fit..."
            />
          </div>

          {submitError && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="bg-blue-600 text-white py-3 px-10 rounded-full font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { JobListing } from "../types/job.types";
import { fetchJobById } from "../api/jobs.api";

export function useJob(id: string | undefined) {
  const isValid = typeof id === "string" && id.length > 0;

  // Derive initial states right away to avoid any useEffect updates on mount
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(isValid);
  const [error, setError] = useState<string | null>(
    isValid ? null : "Invalid job ID",
  );

  useEffect(() => {
    // Early return if ID is missing or invalid
    if (!isValid || !id) return;

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchJobById(id);

        if (active) {
          setJob(data);
        }
      } catch {
        if (active) {
          setError("Failed to load job");
          setJob(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id, isValid]);

  return { job, loading, error };
}

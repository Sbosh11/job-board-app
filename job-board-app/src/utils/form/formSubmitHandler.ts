// Purpose: Helper to create consistent async form submit handlers.
import { toast } from "sonner";

type AsyncFn<T> = (data: T) => Promise<unknown>;

export function createFormSubmit<T>(
  fn: AsyncFn<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
  },
) {
  return async (data: T): Promise<unknown> => {
    // Automatically handles loading, success, and error toast states while letting errors bubble up properly.
    return toast.promise(fn(data), {
      loading: "Submitting...",
      success: options?.successMessage || "Success",
      error: options?.errorMessage || "Something went wrong",
    });
  };
}

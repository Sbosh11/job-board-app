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
  return async (data: T): Promise<boolean> => {
    try {
      await fn(data);

      toast.success(options?.successMessage || "Success");

      return true;
    } catch {
      toast.error(options?.errorMessage || "Something went wrong");

      return false;
    }
  };
}

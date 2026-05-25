// Purpose: Wrapper around react-hook-form with app defaults.
import { useForm } from "react-hook-form";
import type { UseFormProps, FieldValues } from "react-hook-form";

export function useAppForm<T extends FieldValues>(options?: UseFormProps<T>) {
  return useForm<T>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    ...options,
  });
}

// Purpose: Normalize free-text search inputs.
export function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/,/g, "").replace(/\s+/g, " ");
}

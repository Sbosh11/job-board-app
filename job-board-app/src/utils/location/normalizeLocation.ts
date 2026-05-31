// Purpose: Map alias strings to canonical city names.
import { CITY_ALIASES } from "../constants/cityAliases";

export function normalizeLocation(value: string) {
  const key = value.trim().toLowerCase();
  return CITY_ALIASES[key] ?? value;
}

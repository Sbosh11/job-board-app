// Purpose: Manage recent job search history in localStorage.
const KEY = "job_search_history";

export function getHistory(): string[] {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveHistory(value: string) {
  const existing = getHistory();
  const updated = [value, ...existing.filter((v) => v !== value)].slice(0, 5);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

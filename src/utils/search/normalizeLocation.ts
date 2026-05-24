import cities from "../../data/cities.json";

export function resolveLocation(input: string) {
  const value = input.trim().toLowerCase();
  if (!value) return "";

  const match = cities.find((city) => {
    return city.label.toLowerCase() === value || city.aliases.includes(value);
  });

  return match?.label ?? input;
}

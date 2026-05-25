// Purpose: Small select control for job sorting options.
type SortType = "newest" | "relevance";

export default function JobSort({
  sort,
  setSort,
}: {
  sort: SortType;
  setSort: (v: SortType) => void;
}) {
  return (
    <select value={sort} onChange={(e) => setSort(e.target.value as SortType)}>
      <option value="newest">Newest</option>
      <option value="relevance">Relevance</option>
    </select>
  );
}

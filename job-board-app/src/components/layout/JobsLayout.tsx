// Purpose: Small layout helper for job filters and selectors.
type Props = {
  department: string;
  location: string;
  setDepartment: (v: string) => void;
  setLocation: (v: string) => void;
};

export default function Jobslayout({
  department,
  location,
  setDepartment,
  setLocation,
}: Props) {
  return (
    <div className="space-y-4">
      {/* LOCATION */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
        </select>
      </div>

      {/* DEPARTMENT */}
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
    </div>
  );
}

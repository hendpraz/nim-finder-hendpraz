import { MAJOR_MAPPINGS } from "../utils/majorMapping";

interface MajorFilterProps {
  selectedMajor: string;
  onMajorChange: (major: string) => void;
}

export function MajorFilter({
  selectedMajor,
  onMajorChange,
}: MajorFilterProps) {
  const sortedMajors = Object.entries(MAJOR_MAPPINGS)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([code, name]) => ({
      code,
      name: `${code} - ${name}`,
    }));

  return (
    <div className="relative">
      <select
        value={selectedMajor}
        onChange={(e) => onMajorChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md px-2"
      >
        <option value="">Semua Jurusan</option>
        {sortedMajors.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

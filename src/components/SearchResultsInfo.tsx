interface SearchResultsInfoProps {
  displayedCount: number;
  totalCount: number;
  isSimilar: boolean;
  query: string;
}

export function SearchResultsInfo({
  displayedCount,
  totalCount,
  isSimilar,
  query,
}: SearchResultsInfoProps) {
  return (
    <div className='mt-4 mb-2'>
      {isSimilar || totalCount == null || totalCount <= 0 ? (
        <div className='text-amber-600 mb-2'>
          Couldn't find the exact match of "{query}", here's the suggestion:
        </div>
      ) : null}
      {totalCount > 0 && (
        <div className='text-sm text-gray-600'>
          Displaying {displayedCount} out of {totalCount} students
        </div>
      )}
    </div>
  );
}

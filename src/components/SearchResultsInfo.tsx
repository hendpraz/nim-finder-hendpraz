import { Check, Share2 } from 'lucide-react';

interface SearchResultsInfoProps {
  displayedCount: number;
  totalCount: number;
  isSimilar: boolean;
  query: string;
  onShareResults?: () => void;
  isShareCopied?: boolean;
}

export function SearchResultsInfo({
  displayedCount,
  totalCount,
  isSimilar,
  query,
  onShareResults,
  isShareCopied = false,
}: SearchResultsInfoProps) {
  return (
    <div className='mt-4 mb-2'>
      {isSimilar || totalCount == null || totalCount <= 0 ? (
        <div className='text-amber-600 mb-2'>
          Couldn't find the exact match of "{query}", here's the suggestion:
        </div>
      ) : null}
      {totalCount > 0 && (
        <div className='flex items-center justify-between gap-3 text-sm text-gray-600'>
          <span>
            Displaying {displayedCount} out of {totalCount}
          </span>
          {onShareResults && (
            <button
              type='button'
              onClick={onShareResults}
              className='inline-flex shrink-0 items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
              aria-label='Share results'
            >
              {isShareCopied ? (
                <Check className='h-3.5 w-3.5' />
              ) : (
                <Share2 className='h-3.5 w-3.5' />
              )}
              <span>{isShareCopied ? 'Copied' : 'Share'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import { Loader } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function LoadMoreButton({ onClick, isLoading }: LoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className='mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {isLoading ? (
        <>
          <Loader className='animate-spin -ml-1 mr-2 h-4 w-4' />
          Loading...
        </>
      ) : (
        'Load More'
      )}
    </button>
  );
}

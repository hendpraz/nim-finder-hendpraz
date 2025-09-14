import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DiktiSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function DiktiSearchBar({
  searchQuery,
  setSearchQuery,
  handleKeyPress,
}: DiktiSearchBarProps) {
  const [placeholder, setPlaceholder] = useState(
    'Keyword: [Nama] [PT] [NIM] [Prodi]'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 639px)').matches;
      setPlaceholder(
        isMobile
          ? 'Nama / PT / NIM / Prodi'
          : 'Keyword: [Nama] [PT] [NIM] [Prodi]'
      );
    }
  }, []);

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Search Query
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const [placeholder, setPlaceholder] = useState(
    'Keyword: [Nama] [NIM] [Jurusan] [Fakultas] [Status]'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 639px)').matches;
      setPlaceholder(
        isMobile
          ? 'Nama / NIM / Prodi / Status'
          : 'Keyword: [Nama] [NIM] [Jurusan] [Fakultas] [Status]'
      );
    }
  }, []);

  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Search className='h-5 w-5 text-gray-400' />
      </div>
      <input
        type='text'
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
        placeholder={placeholder}
      />
    </div>
  );
}

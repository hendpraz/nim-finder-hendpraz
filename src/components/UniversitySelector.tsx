'use client';

import { BarChart3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { University } from '@/types/university';

interface UniversitySelectorProps {
  university: University;
  onUniversityChange: (university: University) => void;
  universityOptions: Record<University, string>;
}

export function UniversitySelector({
  university,
  onUniversityChange,
  universityOptions,
}: UniversitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert options to array for easier filtering
  const optionsList = Object.entries(universityOptions).map(
    ([value, label]) => ({
      value: value as University,
      label,
    })
  );

  // Filter options based on search term
  const filteredOptions = searchTerm.trim()
    ? optionsList.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : optionsList;

  // Get selected university label
  const selectedLabel = universityOptions[university] || '';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      onUniversityChange(filteredOptions[0].value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className='flex items-center space-x-2'>
      <div className='relative' ref={containerRef}>
        {/* Search Input */}
        <div className='relative'>
          <input
            ref={inputRef}
            type='text'
            placeholder={isOpen ? 'Cari...' : selectedLabel}
            value={isOpen ? searchTerm : ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className='w-32 sm:w-40 border border-gray-300 rounded-md text-sm py-1.5 px-2 pr-7 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          />
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              if (isOpen) {
                setIsOpen(false);
                setSearchTerm('');
              } else {
                setIsOpen(true);
                inputRef.current?.focus();
              }
            }}
            className='absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer'
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>

        {/* Selected value overlay when not searching */}
        {!isOpen && (
          <div
            onClick={() => {
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className='absolute inset-0 flex items-center px-2 cursor-pointer'
          >
            <span className='text-sm text-gray-900 truncate pr-6'>
              {selectedLabel}
            </span>
          </div>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className='absolute z-20 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
            {filteredOptions.length === 0 ? (
              <div className='px-3 py-2 text-gray-500 text-sm'>
                Tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onUniversityChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                    opt.value === university
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ITB Stats Link - Only show when ITB is selected */}
      {university === 'itb' && (
        <a
          href='https://itb-stats.netlify.app/'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200'
          title='Lihat Statistik ITB'
        >
          <BarChart3 className='w-3.5 h-3.5' />
          <span className='hidden sm:inline'>Stats</span>
        </a>
      )}
    </div>
  );
}

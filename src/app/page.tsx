'use client';

import { Github, GraduationCap, Info } from 'lucide-react';
import { useState } from 'react';
import '@/lib/env';

import { useStudentSearch } from '@/hooks/useStudentSearch';

import { InfoModal } from '@/components/InfoModal';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { SearchBar } from '@/components/SearchBar';
import { StudentsTable } from '@/components/StudentsTable';

// Add gtag type for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Utility function to track dropdown changes
function trackDropdownChange(dropdownId: string, value: string): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "dropdown_change", {
      event_category: "interaction",
      event_label: dropdownId,
      value: value
    });
  }
}

export default function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [university, setUniversity] = useState<'itb' | 'ui' | 'unpad'>('itb');
  // const [university, setUniversity] = useState<'itb' | 'ui' | 'unpad'>(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const uni = params.get('university');
  //   return uni === 'itb' || uni === 'ui' || uni === 'unpad' ? uni : 'itb';
  // });
  // Update the URL query param when university changes
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   params.set('university', university);
  //   const newRelativePathQuery =
  //     window.location.pathname + '?' + params.toString();
  //   window.history.replaceState(null, '', newRelativePathQuery);
  // }, [university]);
  const {
    searchQuery,
    students,
    isLoading,
    isInitialLoad,
    error,
    hasMore,
    total,
    isSimilar,
    handleSearch,
    handleLoadMore,
  } = useStudentSearch(university);

  const showLoadMore =
    students.length > 0 && hasMore && students.length < total;

  const handleGithubClick = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "github_click", {
        event_category: "engagement",
        event_label: "GitHub Icon Click"
      });
    }
  };

  const handleInfoClick = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "info_click", {
        event_category: "engagement",
        event_label: "Info Icon Click"
      });
    }
    setIsInfoModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-5xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='relative flex flex-col items-center justify-center mb-8 text-center'>
            <div className='absolute right-0 top-0 flex space-x-2'>
              <a
                href='https://github.com/hendpraz/nim-finder-hendpraz'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-gray-700 transition-colors'
                title='View on GitHub'
                onClick={handleGithubClick}
              >
                <Github className='h-5 w-5' />
              </a>
              <button
                onClick={handleInfoClick}
                className='text-gray-500 hover:text-gray-700 transition-colors'
                title='How to Use'
              >
                <Info className='h-5 w-5' />
              </button>
            </div>

            <div className='flex items-center mb-2'>
              <GraduationCap className='h-8 w-8 text-blue-600 mr-2' />
              <h1 className='text-3xl font-bold text-gray-900'>
                NIMFinder.com
              </h1>
            </div>
            <p className='text-gray-600'>
              Cari NIM dan nama mahasiswa dari berbagai universitas: ITB, UI,
              dan UNPAD.
            </p>
            <p className='text-gray-600'>
              Data lengkap berbagai angkatan dan jenjang.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='mb-4 flex items-center space-x-3'>
              <label
                htmlFor='university'
                className='text-sm font-medium text-gray-700'
              >
                University:
              </label>
              <select
                id='university'
                value={university}
                onChange={(e) => {
                  const val = e.target.value as 'itb' | 'ui';
                  setUniversity(val);
                  trackDropdownChange('university', val);
                }}
                className='border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='itb'>Institut Teknologi Bandung</option>
                <option value='ui'>Universitas Indonesia</option>
                <option value='unpad'>Universitas Padjadjaran</option>
              </select>
            </div>
            <SearchBar query={searchQuery} onQueryChange={handleSearch} />

            {error && (
              <div className='mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md'>
                {error}
              </div>
            )}

            <>
              <StudentsTable
                students={students}
                isLoading={isLoading}
                isInitialLoad={isInitialLoad}
                total={total}
                isSimilar={isSimilar}
                searchQuery={searchQuery}
                university={university}
              />

              {showLoadMore && (
                <LoadMoreButton
                  onClick={handleLoadMore}
                  isLoading={isLoading}
                />
              )}
            </>
          </div>
        </div>
      </div>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

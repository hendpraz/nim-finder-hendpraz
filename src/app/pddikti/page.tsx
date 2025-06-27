'use client';

import {
  AlertCircle,
  Database,
  ExternalLink,
  Loader,
  Search,
} from 'lucide-react';
import React, { useState } from 'react';

import { PDDIKTIResult, searchMahasiswaPDDIKTI } from '@/lib/pddikti';

export default function PDDIKTISearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'mahasiswa' | 'dosen' | 'prodi'>(
    'mahasiswa'
  );
  const [results, setResults] = useState<PDDIKTIResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchMahasiswaPDDIKTI(searchQuery);
      if (!data) {
        setResults([]);
        setError('No results found or failed to fetch data from PDDIKTI.');
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to search PDDIKTI database. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-6xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center mb-4'>
              <Database className='h-8 w-8 text-blue-600 mr-2' />
              <h1 className='text-3xl font-bold text-gray-900'>
                PDDIKTI Search
              </h1>
            </div>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Search directly from PDDIKTI (Pangkalan Data Pendidikan Tinggi)
              database. Find students, lecturers, and study programs from all
              universities in Indonesia.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) =>
                    setSearchType(
                      e.target.value as 'mahasiswa' | 'dosen' | 'prodi'
                    )
                  }
                  className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value='mahasiswa'>Students (Mahasiswa)</option>
                  {/* <option value="dosen">Lecturers (Dosen)</option>
                  <option value="prodi">Study Programs (Program Studi)</option> */}
                </select>
              </div>

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
                    placeholder={`Keyword ${
                      searchType === 'mahasiswa'
                        ? 'Keyword: [Nama MHS] [PT] [NIM] [Prodi]'
                        : searchType === 'dosen'
                        ? 'lecturer name'
                        : 'program name'
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className='w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <>
                    <Loader className='animate-spin -ml-1 mr-2 h-4 w-4' />
                    Searching PDDIKTI...
                  </>
                ) : (
                  <>
                    <Search className='h-4 w-4 mr-2' />
                    Search PDDIKTI Database
                  </>
                )}
              </button>
            </div>

            <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
              <div className='flex'>
                <AlertCircle className='h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-yellow-700'>
                  <p className='font-medium'>Important Notes:</p>
                  <ul className='mt-1 list-disc list-inside space-y-1'>
                    <li>
                      This feature searches directly from the official PDDIKTI
                      database
                    </li>
                    <li>
                      Results may take longer to load due to external API calls
                    </li>
                    <li>Data accuracy depends on PDDIKTI's database updates</li>
                    <li>
                      Some searches may be rate-limited by the PDDIKTI API
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-6'>
              <div className='flex'>
                <AlertCircle className='h-5 w-5 text-red-400 mr-2 flex-shrink-0' />
                <div className='text-sm text-red-700'>{error}</div>
              </div>
            </div>
          )}

          {hasSearched && !isLoading && (
            <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Search Results ({results.length} found)
                </h3>
              </div>

              {results.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                  No results found for "{searchQuery}". Try a different search
                  term.
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Name
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          NIM
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Perguruan Tinggi
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Prodi
                        </th>
                        {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Aksi
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {results.map((result, index) => (
                        <tr
                          key={result.id || index}
                          className='hover:bg-gray-50'
                        >
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm font-medium text-gray-900'>
                              {result.nama}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {result.nim}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {result.nama_pt}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {result.nama_prodi}
                          </td>
                          {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            <button className='text-blue-600 hover:text-blue-900'>
                              Detail
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
                <div className='flex items-center text-sm text-gray-500'>
                  <ExternalLink className='h-4 w-4 mr-1' />
                  Data source: PDDIKTI (Pangkalan Data Pendidikan Tinggi)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

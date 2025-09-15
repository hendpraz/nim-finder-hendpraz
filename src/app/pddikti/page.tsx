'use client';

import {
  AlertCircle,
  Database,
  ExternalLink,
  Eye,
  Loader,
  Search,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

import { DiktiSearchBar } from '@/components/DiktiSearchBar';

interface PDDIKTIResult {
  id: string;
  nama: string;
  nim: string;
  nama_pt: string;
  singkatan_pt?: string;
  nama_prodi: string;
}

interface PDDIKTIDetail {
  id: string;
  nama_pt: string;
  kode_pt: string;
  kode_prodi: string;
  prodi: string;
  nama: string;
  nim: string;
  jenis_daftar: string;
  id_pt: string;
  id_sms: string;
  jenis_kelamin: string;
  jenjang: string;
  status_saat_ini: string;
  tanggal_masuk: string;
}

export default function PDDIKTISearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [searchType, setSearchType] = useState<'mahasiswa' | 'dosen' | 'prodi'>(
  //   'mahasiswa'
  // );
  const [results, setResults] = useState<PDDIKTIResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Detail modal state
  const [selectedDetail, setSelectedDetail] = useState<PDDIKTIDetail | null>(
    null
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com/mahasiswa_pddikti?query=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from PDDIKTI');
      }

      const data = await response.json();
      setResults(data || []);

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'search', {
          event_category: 'interaction',
          event_label: 'pddikti_mhs_search',
          value: searchQuery,
        });
      }
    } catch (err) {
      setError('Failed to search PDDIKTI database. Please try again.');
      // console.error('PDDIKTI search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    setIsDetailLoading(true);
    setDetailError(null);

    try {
      const response = await fetch(
        `https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com/mahasiswa_pddikti/detail?id=${id}`
      );

      const detailData = await response.json();

      if (!response.ok || detailData.success === false) {
        if (detailData.errorSource === 'PDDIKTI_API') {
          setDetailError(
            'Failed to load detail information. Please try again. Possible cause: PDDIKTI API is under maintenance or down.'
          );
        } else {
          setDetailError(
            'Failed to load detail information. Please try again. Possible cause: Network error contacting PDDIKTI API.'
          );
        }

        if (
          typeof window !== 'undefined' &&
          typeof window.gtag === 'function'
        ) {
          window.gtag('event', 'view_detail', {
            event_category: 'interaction',
            event_label: 'pddikti_mhs_detail',
            value: id,
            error: detailData.error,
            errorSource: detailData.errorSource,
            message: detailData.message,
          });
        }

        return;
      }

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'view_detail', {
          event_category: 'interaction',
          event_label: 'pddikti_mhs_detail',
          value: id,
        });
      }

      setSelectedDetail(detailData);
    } catch (err) {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'view_detail', {
          event_category: 'interaction',
          event_label: 'pddikti_mhs_detail',
          value: id,
          error: true,
          errorSource: 'NETWORK',
          message:
            'Failed to load detail information. Please try again. Possible cause: Network error contacting PDDIKTI API.',
        });
      }

      setDetailError(
        'Failed to load detail information. Please try again. Possible cause: PDDIKTI API is under maintenance or down.'
      );
      // console.error('Detail fetch error:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedDetail(null);
    setDetailError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getGenderDisplay = (jenis_kelamin: string) => {
    return jenis_kelamin === 'L'
      ? 'Male (Laki-laki)'
      : jenis_kelamin === 'P'
      ? 'Female (Perempuan)'
      : jenis_kelamin;
  };

  const getStatusColor = (status: string) => {
    if (
      status?.toLowerCase().includes('non-aktif') ||
      status?.toLowerCase().includes('undur')
    ) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status?.toLowerCase().includes('aktif')) {
      return 'bg-green-100 text-green-800';
    } else if (status?.toLowerCase().includes('lulus')) {
      return 'bg-blue-100 text-blue-800';
    } else if (status?.toLowerCase().includes('keluar')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-5xl mx-auto py-2 sm:py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:py-2 sm:px-0'>
          <div className='text-center mb-4 sm:mb-8 sm:pb-1'>
            <div className='flex items-center justify-center mb-4 sm:mb-2'>
              <Database className='h-8 w-8 text-blue-600 mr-2' />
              <h1 className='text-3xl font-bold text-gray-900'>
                PDDIKTI Search
              </h1>
            </div>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Search directly from PDDIKTI (Pangkalan Data Pendidikan Tinggi)
              database.
            </p>
            <p className='hidden sm:block text-gray-600 max-w-2xl mx-auto'>
              Find students from all universities in Indonesia.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
            <div className='space-y-4'>
              <DiktiSearchBar
                searchQuery={searchQuery}
                handleKeyPress={handleKeyPress}
                setSearchQuery={setSearchQuery}
              />

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
                  <p className='font-medium'>Catatan Penting:</p>
                  <ul className='mt-1 list-disc list-inside space-y-1'>
                    <li>
                      Fitur ini mencari langsung dari database resmi PDDIKTI
                    </li>
                    <li>
                      Beberapa pencarian mungkin terbatas oleh Server PDDIKTI
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
                <div className='w-full overflow-x-auto md:overflow-x-visible'>
                  <table className='min-w-full w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words'>
                          Name
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words'>
                          NIM
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words'>
                          University
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words'>
                          Program
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {results.map((result, index) => (
                        <tr
                          key={result.id || index}
                          className='hover:bg-gray-50'
                        >
                          <td className='px-6 py-4 whitespace-normal break-words text-sm text-gray-500'>
                            <div className='text-sm font-medium text-gray-900'>
                              {result.nama}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-normal break-words text-sm text-gray-500'>
                            {result.nim}
                          </td>
                          <td className='px-6 py-4 whitespace-normal break-words text-sm text-gray-500'>
                            {result.nama_pt}
                          </td>
                          <td className='px-6 py-4 whitespace-normal break-words text-sm text-gray-500'>
                            {result.nama_prodi}
                          </td>
                          <td className='px-6 py-4 whitespace-normal break-words text-sm text-gray-500'>
                            <button
                              onClick={() => handleViewDetail(result.id)}
                              className='inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            >
                              <Eye className='h-3 w-3 mr-1' />
                              View Detail
                            </button>
                          </td>
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

      {/* Detail Modal */}
      {(selectedDetail || isDetailLoading || detailError) && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
          onClick={closeDetailModal}
        >
          <div
            className='bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-semibold'>
                Informasi Detail Mahasiswa
              </h2>
              <button
                onClick={closeDetailModal}
                className='text-gray-500 hover:text-gray-700'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='p-6'>
              {isDetailLoading && (
                <div className='flex items-center justify-center py-8'>
                  <Loader className='animate-spin h-8 w-8 text-blue-600' />
                  <span className='ml-2 text-gray-600'>
                    Loading detail information...
                  </span>
                </div>
              )}

              {detailError && (
                <div className='bg-red-50 border border-red-200 rounded-md p-4'>
                  <div className='flex'>
                    <AlertCircle className='h-5 w-5 text-red-400 mr-2 flex-shrink-0' />
                    <div className='text-sm text-red-700'>{detailError}</div>
                  </div>
                </div>
              )}

              {selectedDetail && (
                <div className='space-y-6'>
                  {/* Personal Information */}
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>
                      General Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Full Name
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {selectedDetail.nama}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          NIM
                        </label>
                        <p className='mt-1 text-sm text-gray-900 font-mono'>
                          {selectedDetail.nim}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Jenis Kelamin
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {getGenderDisplay(selectedDetail.jenis_kelamin)}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Tanggal Masuk
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {formatDate(selectedDetail.tanggal_masuk)}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Current Status
                        </label>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            selectedDetail.status_saat_ini
                          )}`}
                        >
                          {selectedDetail.status_saat_ini}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>
                      Academic Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                          Perguruan Tinggi
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {selectedDetail.nama_pt}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Code: {selectedDetail.kode_pt}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                          Prodi
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {selectedDetail.prodi}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Code: {selectedDetail.kode_prodi}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Jenjang
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {selectedDetail.jenjang}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Jenis Daftar
                        </label>
                        <p className='mt-1 text-sm text-gray-900'>
                          {selectedDetail.jenis_daftar}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 pt-4 border-t border-gray-200'>
                    <div className='flex items-center text-xs text-gray-500'>
                      <ExternalLink className='h-3 w-3 mr-1' />
                      Data source: PDDIKTI Official Database
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

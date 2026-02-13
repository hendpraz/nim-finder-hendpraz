'use client';

import { BookOpen, Github, GraduationCap, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import { SiGooglesheets } from 'react-icons/si';
import '@/lib/env';

import { useStudentSearch } from '@/hooks/useStudentSearch';

import { InfoModal } from '@/components/InfoModal';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { SearchBar } from '@/components/SearchBar';
import { StudentsTable } from '@/components/StudentsTable';

import { University } from '@/types/university';

const UNIVERSITY_OPTIONS: Record<University, string> = {
  itb: 'ITB',
  ui: 'UI',
  unpad: 'UNPAD',
  ugm: 'UGM',
  binus: 'BINUS',
  unbraw: 'UB',
  undip: 'UNDIP',
  ipb: 'IPB',
  gundar: 'Gunadarma',
  trisakti: 'Trisakti',
  unair: 'UNAIR',
  its: 'ITS',
  uii: 'UII',
  uns: 'UNS',
  upi: 'UPI',
  unnes: 'UNNES',
  unand: 'UNAND',
  unila: 'UNILA',
  unhas: 'UNHAS',
  universitas_sanata_dharma: 'Univ. Sanata Dharma',
  universitas_yarsi: 'Univ. Yarsi',
  universitas_katolik_parahyangan: 'UNPAR',
  institut_teknologi_sumatera: 'ITERA',
  universitas_komputer_indonesia: 'UNIKOM',
  universitas_muhammadiyah_surakarta: 'UMS',
  universitas_katolik_widya_mandala_surabaya: 'UKWMS',
  institut_teknologi_del_: 'IT Del',
  universitas_mercu_buana: 'Univ. Mercu Buana',
  universitas_kristen_maranatha: 'UK Maranatha',
  universitas_katolik_indonesia_atma_jaya: 'Unika Atma Jaya',
  universitas_ciputra_surabaya: 'UC Surabaya',
  universitas_ahmad_dahlan: 'Univ. Ahmad Dahlan',
  universitas_islam_negeri_syarif_hidayatullah: 'UIN Jakarta',
  universitas_muhammadiyah_malang: 'UMM',
  universitas_budi_luhur: 'Univ. Budi Luhur',
  universitas_tarumanagara: 'UNTAR',
  universitas_negeri_surabaya: 'UNESA',
  universitas_pelita_harapan: 'UPH',
  universitas_kristen_petra: 'UK Petra',
  universitas_telkom: 'Tel-U',
  universitas_pamulang: 'UNPAM',
  institut_teknologi_nasional_bandung: 'ITENAS Bandung',
  universitas_islam_bandung: 'UNISBA',
  universitas_atma_jaya_yogyakarta: 'UAJY',
};

// Add gtag type for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Utility function to track dropdown changes
function trackDropdownChange(dropdownId: string, value: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'dropdown_change', {
      event_category: 'interaction',
      event_label: dropdownId,
      value: value,
    });
  }
}

export default function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [university, setUniversity] = useState<University>('itb');
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
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'github_click', {
        event_category: 'engagement',
        event_label: 'GitHub Icon Click',
      });
    }
  };

  const handleInfoClick = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'info_click', {
        event_category: 'engagement',
        event_label: 'Info Icon Click',
      });
    }
    setIsInfoModalOpen(true);
  };

  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const sheetsModalRef = useRef<HTMLDivElement>(null);

  function handleSheetsClick() {
    setShowSheetsModal(true);
  }

  function handleSheetsModalClose() {
    setShowSheetsModal(false);
  }

  // Dismiss modal when clicking outside
  function handleSheetsModalBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === sheetsModalRef.current) {
      setShowSheetsModal(false);
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-5xl mx-auto sm:py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-2 sm:px-0'>
          <div className='relative flex flex-col items-center justify-center mb-3 sm:mb-8 text-center pt-6 sm:pt-0 pb-1 sm:pb-1'>
            <div className='absolute right-2 top-2 sm:right-0 sm:top-0 flex space-x-2'>
              <a
                href='https://github.com/hendpraz/nim-finder-hendpraz'
                target='_blank'
                rel='noopener noreferrer'
                className='hidden sm:flex text-gray-500 hover:text-gray-700 transition-colors'
                title='View on GitHub'
                onClick={handleGithubClick}
              >
                <Github className='h-5 w-5' />
              </a>
              <a
                href='https://nimfinder.blogspot.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-gray-700 transition-colors hidden'
                title='Visit Blog'
              >
                <BookOpen className='h-5 w-5' />
              </a>
              <button
                onClick={handleSheetsClick}
                className='hidden sm:flex text-green-600 hover:text-green-800 transition-colors'
                title='Tutorial Google Sheets'
              >
                <SiGooglesheets className='h-5 w-5' />
              </button>
              <button
                onClick={handleInfoClick}
                className='text-gray-500 hover:text-gray-700 transition-colors'
                title='How to Use'
              >
                <Info className='h-5 w-5' />
              </button>
            </div>

            <div className='flex items-center mb-4'>
              <GraduationCap className='h-8 w-8 text-blue-600 mr-2' />
              <h1 className='text-3xl font-bold text-gray-900'>Smart Search</h1>
            </div>
            <p className='text-gray-600'>
              Cari NIM dan nama mahasiswa dari berbagai universitas: ITB, UI,
              UNPAD, UGM, BINUS, UNBRAW, UNDIP, ITS, IPB dll.
            </p>
            <p className='hidden sm:flex text-gray-600'>
              Dilengkapi dengan fitur pencarian fleksibel seperti "if17" dan
              "Lulus 2020"
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-3 md:p-6'>
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
                  const val = e.target.value as University;
                  setUniversity(val);
                  trackDropdownChange('university', val);
                }}
                className='border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              >
                {Object.entries(UNIVERSITY_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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

      {showSheetsModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'
          ref={sheetsModalRef}
          onClick={handleSheetsModalBackdrop}
        >
          <div
            className='bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-gray-700'
              onClick={handleSheetsModalClose}
              aria-label='Tutup'
            >
              ×
            </button>
            <h2 className='text-xl font-bold mb-3 flex items-center'>
              <SiGooglesheets className='h-6 w-6 mr-2 text-green-600' />
              Integrasi Google Sheets
            </h2>
            <p className='mb-2 text-gray-700'>
              Gunakan fungsi berikut di Google Sheets untuk mendapatkan nama
              mahasiswa ITB berdasarkan NIM, langsung dari layanan ini.
            </p>
            <div className='bg-gray-100 rounded p-3 font-mono text-sm mb-2 overflow-x-auto relative'>
              <pre>
                {`function itbStudent(nim) {
  const url = "https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com/mahasiswa_itb/" + encodeURIComponent(nim);
  const response = UrlFetchApp.fetch(url, { 'method': 'get' });
  const data = JSON.parse(response.getContentText());
  return data.name || "-";
}`}
              </pre>
            </div>
            <ol className='list-decimal pl-5 text-gray-700 mb-2'>
              <li>
                Buka Google Sheets, klik <b>Extensions</b> &gt;{' '}
                <b>Apps Script</b>.
              </li>
              <li>Paste kode di atas ke editor.</li>
              <li>
                Simpan, lalu gunakan fungsi <code>=itbStudent("NIM")</code> di
                sel mana pun.
              </li>
            </ol>
            <p className='text-xs text-gray-500'>
              Contoh: <br />
              <code>=itbStudent("12345678")</code> atau <br />
              <code>=itbStudent(A2)</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

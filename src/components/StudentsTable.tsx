import { useEffect, useState } from 'react';

import { SearchResultsInfo } from './SearchResultsInfo';

import { Student } from '@/types/student';

const ITB_SEARCH_SUGGESTIONS = [
  'Hendry if',
  'if21 Lulus',
  'Lulus 2023',
  'stei 2020',
  'Aktif 13522',
  '13520 Lulus',
];

const UI_SEARCH_SUGGESTIONS = [
  '1706 Ilmu Komputer',
  '1706 Lulus',
  '2206 Aktif',
  '1706 Ekonomi',
  'Lulus 2025 Genap',
  '2006 Dokter',
];

const UNPAD_SEARCH_SUGGESTIONS = [
  'Farmasi Lulus 2025',
  'Hukum Lulus 2025',
  'Dokter Lulus 2025',
  'Ekonomi Aktif',
  'Sastra Lulus 2024',
  'Lulus 2024 Ganjil',
];

const TYPING_SPEED = 100; // ms per character
const PAUSE_DURATION = 1000; // ms to pause at full text

interface StudentsTableProps {
  students: Student[];
  isLoading: boolean;
  isInitialLoad: boolean;
  total: number;
  isSimilar: boolean;
  searchQuery: string;
  university: 'itb' | 'ui' | 'unpad';
}

export function StudentsTable({
  students,
  isInitialLoad,
  total,
  isSimilar,
  searchQuery,
  university,
}: StudentsTableProps) {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentSuggestion = '';
    if (university === 'itb') {
      currentSuggestion = ITB_SEARCH_SUGGESTIONS[currentSuggestionIndex];
    } else if (university === 'ui') {
      currentSuggestion = UI_SEARCH_SUGGESTIONS[currentSuggestionIndex];
    } else if (university === 'unpad') {
      currentSuggestion = UNPAD_SEARCH_SUGGESTIONS[currentSuggestionIndex];
    }
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      // Typing forward
      if (displayText.length < currentSuggestion.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentSuggestion.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        // Pause at full text
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, PAUSE_DURATION);
      }
    } else {
      // Erasing
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, TYPING_SPEED / 2); // Erase faster than typing
      } else {
        // Move to next suggestion
        setCurrentSuggestionIndex((prev) =>
          prev ===
          (university === 'itb'
            ? ITB_SEARCH_SUGGESTIONS.length
            : UI_SEARCH_SUGGESTIONS.length) -
            1
            ? 0
            : prev + 1
        );
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, currentSuggestionIndex, isTyping, university]);

  if (isInitialLoad) {
    return (
      <div className='text-center py-8 text-gray-500'>Loading students...</div>
    );
  }

  if (students.length === 0 && searchQuery.length < 3) {
    return (
      <div className='text-center py-8 text-gray-500'>
        Try search "
        <span className='text-blue-600 font-medium'>{displayText}</span>"
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        No students found matching your search criteria.
      </div>
    );
  }

  const getStudentStatus = (status: string) => {
    if (status?.toLowerCase().includes('undur')) {
      const statusSplit = status.split('-');

      return 'Pengunduran-' + statusSplit[1];
    }

    return status;
  };

  return (
    <>
      <SearchResultsInfo
        displayedCount={students.length}
        totalCount={total}
        isSimilar={isSimilar}
        query={searchQuery}
      />
      <div className='mt-4 overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                NIM
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Major
              </th>
              {university === 'ui' && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Jenjang
                </th>
              )}
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {students.map((student) => (
              <tr key={student.majorId} className='hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {student.majorId}
                  </div>
                  {student.facultyId !== student.majorId && (
                    <div className='text-xs text-gray-500'>
                      {student.facultyId}
                    </div>
                  )}
                </td>
                <td className='px-6 py-4 text-sm text-gray-500'>
                  {student.name}
                </td>
                <td className='px-6 py-4 text-sm text-gray-500'>
                  {student.major}
                </td>
                {university === 'ui' && (
                  <td className='px-6 py-4 text-sm text-gray-500'>
                    {student.jenjang || '-'}
                  </td>
                )}
                <td className='px-6 py-4 text-sm text-gray-500'>
                  {getStudentStatus(student.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

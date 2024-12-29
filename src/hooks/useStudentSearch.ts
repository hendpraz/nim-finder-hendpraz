import { useState, useCallback, useEffect } from 'react';
import { fetchStudents } from '../utils/api';
import type { Student } from '../types/student';

const MIN_SEARCH_LENGTH = 3;

export function useStudentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadStudents = useCallback(async (page: number, isLoadMore: boolean = false) => {
    if (searchQuery.length < MIN_SEARCH_LENGTH) {
      setStudents([]);
      setError(null);
      setHasMore(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchStudents(searchQuery, page);
      
      if (response.students.length === 0) {
        setHasMore(false);
        return;
      }

      setStudents(prev => isLoadMore ? [...prev, ...response.students] : response.students);
    } catch (err) {
      setError('Failed to load students. Please try again later.');
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      setHasMore(true);
      loadStudents(0, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadStudents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadStudents(nextPage, true);
  };

  return {
    searchQuery,
    students,
    isLoading,
    error,
    hasMore,
    currentPage,
    handleSearch,
    handleLoadMore,
  };
}
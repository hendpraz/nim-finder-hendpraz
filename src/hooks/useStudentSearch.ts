import { useState, useCallback, useEffect } from "react";
import { fetchStudents } from "../utils/api";
import type { Student } from "../types/student";

const MIN_SEARCH_LENGTH = 3;

type University = 'itb' | 'ui';

export function useStudentSearch(university: University = 'itb') {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isSimilar, setIsSimilar] = useState(false);

  const loadStudents = useCallback(
    async (page: number, isLoadMore: boolean = false) => {
      if (searchQuery.length < MIN_SEARCH_LENGTH) {
        setStudents([]);
        setError(null);
        setHasMore(false);
        setTotal(0);
        setIsSimilar(false);
        return;
      }

      try {
        if (!isLoadMore) {
          setIsInitialLoad(true);
        }
        setIsLoading(true);
        setError(null);

        const response = await fetchStudents(searchQuery, page, university);

        setTotal(response.total);
        setIsSimilar(response.isSimilar);

        if (response.students.length === 0) {
          setHasMore(false);
          return;
        }

        setStudents((prev) =>
          isLoadMore ? [...prev, ...response.students] : response.students
        );
        setHasMore(response.students.length > 0);
      } catch (err) {
        setError("Failed to load students. Please try again later.");
        console.error("Error loading students:", err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [searchQuery, university]
  );

  useEffect(() => {
    setStudents([]); // Clear students when university or query changes
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    setTotal(0);
    setIsSimilar(false);
    const timeoutId = setTimeout(() => {
      loadStudents(0, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, university, loadStudents]);

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
    isInitialLoad,
    error,
    hasMore,
    currentPage,
    total,
    isSimilar,
    handleSearch,
    handleLoadMore,
  };
}

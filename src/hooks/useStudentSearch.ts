import { useState, useCallback, useEffect } from "react";
import { searchStudents } from "../utils/search";
import type { Student } from "../types/student";

const EVENT_TRACKING_URL =
  "https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com/events";

export function useStudentSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isSimilar, setIsSimilar] = useState(false);

  const loadStudents = useCallback(
    (page: number, isLoadMore: boolean = false) => {
      try {
        if (!isLoadMore) {
          setIsInitialLoad(true);
        }
        setIsLoading(true);
        setError(null);

        const result = searchStudents(searchQuery, page, selectedMajor);

        setTotal(result.total);
        setIsSimilar(result.isSimilar);

        if (result.students.length === 0) {
          setHasMore(false);
          return;
        }

        setStudents((prev) =>
          isLoadMore ? [...prev, ...result.students] : result.students
        );
        setHasMore(result.students.length > 0);
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);

        // Event Tracking: fetch students
        fetch(EVENT_TRACKING_URL, {
          method: "POST",
          body: JSON.stringify({
            app: "nim-finder-itb",
            action: "fetch_students",
            query: searchQuery,
            major: selectedMajor,
            page: page,
            timestamp: new Date().toISOString(),
          }),
        });
      }
    },
    [searchQuery, selectedMajor]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      setHasMore(true);
      loadStudents(0, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedMajor, loadStudents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMajorChange = (major: string) => {
    setSelectedMajor(major);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadStudents(nextPage, true);
  };

  return {
    searchQuery,
    selectedMajor,
    students,
    isLoading,
    isInitialLoad,
    error,
    hasMore,
    total,
    isSimilar,
    handleSearch,
    handleMajorChange,
    handleLoadMore,
  };
}

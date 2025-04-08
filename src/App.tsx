import { GraduationCap } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { StudentsTable } from "./components/StudentsTable";
import { LoadMoreButton } from "./components/LoadMoreButton";
import { useStudentSearch } from "./hooks/useStudentSearch";

export default function App() {
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
  } = useStudentSearch();

  const showLoadMore =
    students.length > 0 && hasMore && students.length < total;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <div className="flex items-center mb-2">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">
                ITB NIM Finder
              </h1>
            </div>
            <p className="text-gray-600">
              Lengkap dari angkatan 2011 hingga 2024, termasuk mahasiswa S1, S2
              dan S3.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <SearchBar
              query={searchQuery}
              onQueryChange={handleSearch}
              minLength={3}
            />

            {error && (
              <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
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
    </div>
  );
}

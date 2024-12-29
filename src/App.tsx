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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-center mb-8">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Student Directory
            </h1>
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

            {searchQuery.length < 3 ? (
              <div className="mt-4 text-center text-gray-500">
                Please enter at least 3 characters to search
              </div>
            ) : (
              <>
                <StudentsTable
                  students={students}
                  isLoading={isLoading}
                  isInitialLoad={isInitialLoad}
                  total={total}
                  isSimilar={isSimilar}
                  searchQuery={searchQuery}
                />

                {students.length > 0 && hasMore && (
                  <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

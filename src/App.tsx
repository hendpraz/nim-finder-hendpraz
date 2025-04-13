import { Github, GraduationCap, Info } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { StudentsTable } from "./components/StudentsTable";
import { LoadMoreButton } from "./components/LoadMoreButton";
import { useStudentSearch } from "./hooks/useStudentSearch";
import { useState } from "react";
import { InfoModal } from "./components/InfoModal";

export default function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
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

  const EVENT_TRACKING_URL =
    "https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com/events";

  const showLoadMore =
    students.length > 0 && hasMore && students.length < total;

  const trackIconClick = (action: string) => {
    fetch(EVENT_TRACKING_URL, {
      method: "POST",
      body: JSON.stringify({
        app: "nim-finder-hendpraz",
        action,
        query: "icon_click",
        timestamp: new Date().toISOString(),
      }),
    });
  };

  const handleGithubClick = () => {
    trackIconClick("github_click");
  };

  const handleInfoClick = () => {
    trackIconClick("info_click");
    setIsInfoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="relative flex flex-col items-center justify-center mb-8 text-center">
            <div className="absolute right-0 top-0 flex space-x-2">
              <a
                href="https://github.com/hendpraz/nim-finder-hendpraz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="View on GitHub"
                onClick={handleGithubClick}
              >
                <Github className="h-5 w-5" />
              </a>
              <button
                onClick={handleInfoClick}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="How to Use"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>

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

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

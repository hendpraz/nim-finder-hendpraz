import { useState, useEffect } from "react";
import { Student } from "../types/student";
import { SearchResultsInfo } from "./SearchResultsInfo";

const SEARCH_SUGGESTIONS = [
  "Hendry if",
  "if17",
  "Hend pras",
  "stei 2017",
  "135 Hen",
  "13517",
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
}

export function StudentsTable({
  students,
  isInitialLoad,
  total,
  isSimilar,
  searchQuery,
}: StudentsTableProps) {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentSuggestion = SEARCH_SUGGESTIONS[currentSuggestionIndex];
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
          prev === SEARCH_SUGGESTIONS.length - 1 ? 0 : prev + 1
        );
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, currentSuggestionIndex, isTyping]);

  if (isInitialLoad) {
    return (
      <div className="text-center py-8 text-gray-500">Loading students...</div>
    );
  }

  if (students.length === 0 && searchQuery.length < 3) {
    return (
      <div className="text-center py-8 text-gray-500">
        Try search "
        <span className="text-blue-600 font-medium">{displayText}</span>"
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No students found matching your search criteria.
      </div>
    );
  }

  return (
    <>
      <SearchResultsInfo
        displayedCount={students.length}
        totalCount={total}
        isSimilar={isSimilar}
        query={searchQuery}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Major
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.majorId} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {student.majorId}
                  </div>
                  {student.facultyId !== student.majorId && (
                    <div className="text-xs text-gray-500">
                      {student.facultyId}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {student.major}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

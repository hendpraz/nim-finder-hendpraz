import studentData from '../data/students.json';
import type { Student, PaginatedStudents } from '../types/student';
import { transformStudent } from './transformers';

const ITEMS_PER_PAGE = 20;

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

function calculateSimilarity(query: string, student: [string, string, string?]): number {
  const [name, facultyId, majorId] = student;
  query = normalizeString(query);
  
  // Check exact matches
  if (
    normalizeString(name).includes(query) ||
    normalizeString(facultyId).includes(query) ||
    (majorId && normalizeString(majorId).includes(query))
  ) {
    return 1;
  }
  
  // NIM partial match
  if (
    facultyId.includes(query) ||
    (majorId && majorId.includes(query))
  ) {
    return 0.9;
  }
  
  // Name partial match
  const words = normalizeString(name).split(/\s+/);
  const queryWords = query.split(/\s+/);
  
  const matchCount = queryWords.filter(qw => 
    words.some(w => w.includes(qw))
  ).length;
  
  return matchCount / queryWords.length;
}

function filterByMajor(student: [string, string, string?], majorCode: string): boolean {
  const [, facultyId, majorId] = student;
  
  // Check if majorId starts with the major code
  if (majorId && majorId.startsWith(majorCode)) {
    return true;
  }
  
  // If no majorId or no match, check facultyId
  return facultyId.startsWith(majorCode);
}

export function searchStudents(query: string, page: number = 0, majorFilter: string = ''): PaginatedStudents {
  if (!query && !majorFilter) {
    return {
      students: [],
      currentPage: 0,
      query,
      total: 0,
      isSimilar: false
    };
  }

  let results = (studentData.students as [string, string, string?][]);

  // Apply major filter first if present
  if (majorFilter) {
    results = results.filter(student => filterByMajor(student, majorFilter));
  }

  // Then apply search query if present
  if (query) {
    results = results
      .map(student => ({
        student,
        similarity: calculateSimilarity(query, student)
      }))
      .filter(({ similarity }) => similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ student }) => student);
  }

  const total = results.length;
  const isSimilar = query ? !results.some(student => calculateSimilarity(query, student) === 1) : false;
  
  const paginatedResults = results
    .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
    .map(student => transformStudent(student));

  return {
    students: paginatedResults,
    currentPage: page,
    query,
    total,
    isSimilar
  };
}
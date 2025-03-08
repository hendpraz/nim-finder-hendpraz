export interface Student {
  name: string;
  facultyId: string;
  majorId: string;
  major?: string; // Made optional since it's not in the data
}

export interface PaginatedStudents {
  students: Student[];
  currentPage: number;
  query: string;
  total: number;
  isSimilar: boolean;
}
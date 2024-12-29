export interface Student {
  name: string;
  facultyId: string;
  majorId: string;
  major: string;
}

export interface PaginatedStudents {
  students: Student[];
  currentPage: number;
  query: string;
}
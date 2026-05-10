export interface Student {
  name: string;
  facultyId: string;
  majorId: string;
  major: string;
  jenis_kelamin: string;
  status: string;
  jenjang?: string; // Only for UI
  universitas?: string; // Only for 'all' universities search
}

export interface PaginatedStudents {
  students: Student[];
  currentPage: number;
  query: string;
  total: number;
  isSimilar: boolean;
}

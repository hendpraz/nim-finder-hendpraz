import type { StudentPayload } from "../types/api";
import type { Student } from "../types/student";
import type { ApiResponse } from "../types/api";
import type { PaginatedStudents } from "../types/student";

export function transformStudent(payload: StudentPayload): Student {
  return {
    name: payload.name,
    facultyId: payload.nim_tpb,
    majorId: payload.nim_jur,
    major: payload.prodi,
  };
}

export function transformApiResponse(data: ApiResponse): PaginatedStudents {
  return {
    students: data.payload.map(transformStudent),
    currentPage: parseInt(data.query.page),
    query: data.query.query,
    total: data.total,
    isSimilar: data.is_similar,
  };
}

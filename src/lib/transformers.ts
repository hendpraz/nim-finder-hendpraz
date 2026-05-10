import type { StudentPayload } from '../types/api';
import type {
  AllApiResponse,
  AllStudentPayload,
  ApiResponse,
} from '../types/api';
import type { Student } from '../types/student';
import type { PaginatedStudents } from '../types/student';

export function transformStudent(payload: StudentPayload): Student {
  return {
    name: payload.name,
    facultyId: payload.nim_tpb,
    majorId: payload.nim_jur,
    major: payload.prodi,
    jenis_kelamin: payload.jenis_kelamin,
    status: payload.status,
    jenjang: payload.jenjang, // Only present for UI
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

export function transformAllStudent(payload: AllStudentPayload): Student {
  // nim may be "nim_tpb,nim_jur" or a single value
  const nims = payload.nim.split(',').map((s) => s.trim());
  return {
    name: payload.nama,
    facultyId: nims[0],
    majorId: nims[1] ?? nims[0],
    major: payload.prodi,
    jenis_kelamin: payload.jenis_kelamin,
    status: payload.status,
    jenjang: payload.jenjang,
    universitas: payload.universitas,
  };
}

export function transformAllApiResponse(
  data: AllApiResponse,
  page: number
): PaginatedStudents {
  return {
    students: data.results.map(transformAllStudent),
    currentPage: page,
    query: data.query,
    total: data.total,
    isSimilar: false,
  };
}

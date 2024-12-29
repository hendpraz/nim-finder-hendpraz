import type { StudentPayload } from '../types/api';
import type { Student } from '../types/student';

export function transformStudent(payload: StudentPayload): Student {
  return {
    name: payload.name,
    facultyId: payload.nim_tpb,
    majorId: payload.nim_jur,
    major: payload.prodi
  };
}
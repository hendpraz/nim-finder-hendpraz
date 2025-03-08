import { Student } from "../types/student";
import { inferMajorName } from "./majorMapping";

export function transformStudent(data: [string, string, string?]): Student {
  const [name, facultyId, majorId] = data;
  return {
    name,
    facultyId,
    majorId: majorId || facultyId, // Use facultyId as majorId if not provided
    major: inferMajorName(facultyId, majorId),
  };
}

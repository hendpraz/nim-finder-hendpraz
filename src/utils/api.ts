import type { ApiResponse } from "../types/api";
import type { PaginatedStudents } from "../types/student";
import { transformApiResponse } from "./transformers";

const API_BASE_URL =
  "https://07qw5uk5i4.execute-api.ap-southeast-1.amazonaws.com";

export async function fetchStudents(
  query: string = "",
  page: number = 0
): Promise<PaginatedStudents> {
  const url = `${API_BASE_URL}/mahasiswa?query=${encodeURIComponent(
    query
  )}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const data: ApiResponse = await response.json();
  return transformApiResponse(data);
}

import type { ApiResponse } from "../types/api";
import type { PaginatedStudents } from "../types/student";
import { transformApiResponse } from "./transformers";

const API_BASE_URL =
  "https://07qw5uk5i4.execute-api.ap-southeast-1.amazonaws.com";

const EVENT_TRACKING_URL =
  "https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com/events";

export async function fetchStudents(
  query: string = "",
  page: number = 0
): Promise<PaginatedStudents> {
  try {
    // Event Tracking: fetch students
    fetch(EVENT_TRACKING_URL, {
      method: "POST",
      body: JSON.stringify({
        app: "nim-finder-hendpraz",
        action: "fetch_students",
        query: query,
        page: page,
        meta: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
        timestamp: new Date().toISOString(),
      }),
    });

    const url = `${API_BASE_URL}/mahasiswa?query=${encodeURIComponent(
      query
    )}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse = await response.json();

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format");
    }

    return transformApiResponse(data);
  } catch (error) {
    // Ensure we always throw an Error object with a message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching students");
  }
}

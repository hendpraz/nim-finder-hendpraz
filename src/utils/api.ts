import type { ApiResponse } from "../types/api";
import type { PaginatedStudents } from "../types/student";
import { transformApiResponse } from "./transformers";

const ITB_BASE_URL =
  "https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com";
const UI_BASE_URL =
  "https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com";

const EVENT_TRACKING_URL =
  "https://73drglpjge.execute-api.ap-southeast-1.amazonaws.com";

export async function fetchStudents(
  query: string = "",
  page: number = 0,
  university: 'itb' | 'ui' = 'itb'
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
        university: university,
        meta: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
        timestamp: new Date().toISOString(),
      }),
    });

    let url = '';
    if (university === 'itb') {
      url = `${ITB_BASE_URL}/mahasiswa_itb?query=${encodeURIComponent(query)}&page=${page}`;
    } else if (university === 'ui') {
      url = `${UI_BASE_URL}/mahasiswa_ui?query=${encodeURIComponent(query)}&page=${page}`;
    }
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

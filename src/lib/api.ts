import { transformApiResponse } from './transformers';
import type { ApiResponse } from '../types/api';
import type { PaginatedStudents } from '../types/student';

// TODO: Switch to new Nodejs API SST v2
const ITB_BASE_URL =
  'https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com';
const UI_BASE_URL =
  'https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com';
const UNPAD_BASE_URL =
  'https://6op2jljcv5.execute-api.ap-southeast-1.amazonaws.com'; // If different, adjust accordingly

const EVENT_TRACKING_URL =
  'https://73drglpjge.execute-api.ap-southeast-1.amazonaws.com';

export async function fetchStudents(
  query: string,
  page: number,
  university: 'itb' | 'ui' | 'unpad' = 'itb'
): Promise<PaginatedStudents> {
  try {
    let url = '';
    if (university === 'itb') {
      url = `${ITB_BASE_URL}/mahasiswa_itb?query=${encodeURIComponent(
        query
      )}&page=${page}`;
    } else if (university === 'ui') {
      url = `${UI_BASE_URL}/mahasiswa_ui?query=${encodeURIComponent(
        query
      )}&page=${page}`;
    } else if (university === 'unpad') {
      url = `${UNPAD_BASE_URL}/mahasiswa_unpad?query=${encodeURIComponent(
        query
      )}&page=${page}`;
    }
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    // Event Tracking: fetch students
    fetch(EVENT_TRACKING_URL, {
      method: 'POST',
      body: JSON.stringify({
        app: 'nim-finder-hendpraz',
        action: 'fetch_students',
        query: query,
        page: page,
        university: university,
        meta: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
        timestamp: new Date().toISOString(),
        dataLength: data.total || data.payload.length,
      }),
    });

    return transformApiResponse(data);
  } catch (error) {
    // Ensure we always throw an Error object with a message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching students');
  }
}

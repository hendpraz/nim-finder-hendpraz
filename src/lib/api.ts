import { transformApiResponse } from './transformers';
import type { ApiResponse } from '../types/api';
import type { PaginatedStudents } from '../types/student';

const ITB_BASE_URL =
  'https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com';
const UI_BASE_URL =
  'https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com';
const UNPAD_BASE_URL =
  'https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com';
const GUNDAR_BASE_URL =
  'https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com';
const UGM_BASE_URL =
  'https://rst47qajzugyei6ax72zkqjz6e0gpyyn.lambda-url.ap-southeast-1.on.aws';

const EVENT_TRACKING_URL =
  'https://73drglpjge.execute-api.ap-southeast-1.amazonaws.com';

export async function fetchStudents(
  query: string,
  page: number,
  university: 'itb' | 'ui' | 'unpad' | 'gundar' | 'ugm' = 'itb'
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
    } else if (university === 'gundar') {
      url = `${GUNDAR_BASE_URL}/mahasiswa_gundar?query=${encodeURIComponent(
        query
      )}&page=${page}`;
    } else if (university === 'ugm') {
      url = `${UGM_BASE_URL}/?query=${encodeURIComponent(query)}&page=${page}`;
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

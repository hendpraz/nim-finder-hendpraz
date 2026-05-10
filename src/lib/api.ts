import { transformAllApiResponse, transformApiResponse } from './transformers';
import type { AllApiResponse, ApiResponse } from '../types/api';
import type { PaginatedStudents } from '../types/student';

import { University } from '@/types/university';

const GENERAL_BASE_URL =
  'https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com';

const ALL_UNIVERSITIES_BASE_URL = 'https://api.nimfinder.com';
const PAGE_SIZE = 20;

const EVENT_TRACKING_URL =
  'https://73drglpjge.execute-api.ap-southeast-1.amazonaws.com';

export async function fetchStudents(
  query: string,
  page: number,
  university: University = 'itb'
): Promise<PaginatedStudents> {
  // All-universities search uses a different endpoint with offset/limit pagination
  if (university === 'all') {
    return fetchAllStudents(query, page);
  }

  try {
    const url = `${GENERAL_BASE_URL}/mahasiswa_${university}?query=${encodeURIComponent(
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

async function fetchAllStudents(
  query: string,
  page: number
): Promise<PaginatedStudents> {
  try {
    const offset = page * PAGE_SIZE;
    const url = `${ALL_UNIVERSITIES_BASE_URL}/search?q=${encodeURIComponent(
      query
    )}&limit=${PAGE_SIZE}&offset=${offset}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: AllApiResponse = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    // Event Tracking: fetch all students
    fetch(EVENT_TRACKING_URL, {
      method: 'POST',
      body: JSON.stringify({
        app: 'nim-finder-hendpraz',
        action: 'fetch_students',
        query: query,
        page: page,
        university: 'all',
        meta: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
        timestamp: new Date().toISOString(),
        dataLength: data.total,
      }),
    });

    return transformAllApiResponse(data, page);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching students');
  }
}

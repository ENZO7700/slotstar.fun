import 'server-only';
import { z } from 'zod';
import { env } from '../env';

export class ApiError extends Error {
  constructor(message: string, public code: string, public status: number = 500) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiConnectionError extends ApiError {
  constructor(message = 'Failed to connect to WordPress API') {
    super(message, 'CONNECTION_ERROR', 503);
    this.name = 'ApiConnectionError';
  }
}

export class ApiTimeoutError extends ApiError {
  constructor(message = 'WordPress API request timed out') {
    super(message, 'TIMEOUT_ERROR', 504);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiValidationError extends ApiError {
  constructor(message = 'Response schema validation failed', public details?: unknown) {
    super(message, 'VALIDATION_ERROR', 502);
    this.name = 'ApiValidationError';
  }
}

export class ApiHttpError extends ApiError {
  constructor(status: number, message: string, code = 'HTTP_ERROR') {
    super(message, code, status);
    this.name = 'ApiHttpError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

interface FetchOptions {
  params?: Record<string, string | number | undefined>;
  revalidate?: number | false;
  tags?: string[];
  timeoutMs?: number;
}

export async function fetchApi<T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  options: FetchOptions = {}
): Promise<T> {
  const { params, revalidate = 60, tags, timeoutMs = 8000 } = options;

  const url = new URL(`${env.WORDPRESS_API_URL}/slotstar/v1${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchInit: RequestInit = {
    signal: controller.signal,
    headers: {
      Accept: 'application/json',
    },
    next: {
      ...(typeof revalidate === 'number' ? { revalidate } : {}),
      ...(tags ? { tags } : {}),
    },
    ...(revalidate === false ? { cache: 'no-store' } : {}),
  };

  try {
    const res = await fetch(url.toString(), fetchInit);

    if (res.status === 404) {
      throw new NotFoundError(`Endpoint ${endpoint} returned 404`);
    }

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status} ${res.statusText}`;
      let errorCode = 'HTTP_ERROR';
      try {
        const errorJson = await res.json();
        if (errorJson?.error?.message) {
          errorMessage = errorJson.error.message;
        }
        if (errorJson?.error?.code) {
          errorCode = errorJson.error.code;
        }
      } catch {
        // use default message if json parsing fails
      }
      throw new ApiHttpError(res.status, errorMessage, errorCode);
    }

    const rawData = await res.json();
    const parseResult = schema.safeParse(rawData);

    if (!parseResult.success) {
      console.error('Schema validation error for', endpoint, parseResult.error.format());
      throw new ApiValidationError(`Validation failed for ${endpoint}`, parseResult.error.format());
    }

    return parseResult.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiTimeoutError();
    }

    throw new ApiConnectionError(err instanceof Error ? err.message : 'Unknown connection error');
  } finally {
    clearTimeout(timeoutId);
  }
}

const DEFAULT_PUBLIC_MESSAGE = 'Something went wrong. Please try again later.';

export function getPublicErrorMessage(
  error: unknown,
  fallback = DEFAULT_PUBLIC_MESSAGE,
): string {
  if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

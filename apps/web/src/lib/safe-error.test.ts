import { describe, expect, it, vi } from 'vitest';
import { getPublicErrorMessage } from './safe-error';

describe('getPublicErrorMessage', () => {
  it('returns fallback in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(getPublicErrorMessage(new Error('secret stack trace'), 'Safe fallback')).toBe(
      'Safe fallback',
    );
    vi.unstubAllEnvs();
  });

  it('returns error message in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(getPublicErrorMessage(new Error('debug detail'), 'Safe fallback')).toBe('debug detail');
    vi.unstubAllEnvs();
  });
});

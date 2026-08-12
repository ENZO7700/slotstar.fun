import { describe, expect, it } from 'vitest';
import { decodeSessionEdge, isAdminRole } from './session-edge';

function encodeSession(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

describe('isAdminRole', () => {
  it('accepts known admin roles', () => {
    expect(isAdminRole('SUPER_ADMIN')).toBe(true);
    expect(isAdminRole('RISK_MANAGER')).toBe(true);
    expect(isAdminRole('SUPPORT_AGENT')).toBe(true);
    expect(isAdminRole('FINANCE_ADMIN')).toBe(true);
  });

  it('rejects unknown roles', () => {
    expect(isAdminRole('PLAYER')).toBe(false);
    expect(isAdminRole('')).toBe(false);
    expect(isAdminRole('admin')).toBe(false);
  });
});

describe('decodeSessionEdge', () => {
  it('returns null for null, undefined, or empty token', () => {
    expect(decodeSessionEdge(null)).toBeNull();
    expect(decodeSessionEdge(undefined)).toBeNull();
    expect(decodeSessionEdge('')).toBeNull();
  });

  it('returns null for garbage tokens', () => {
    expect(decodeSessionEdge('not-base64!!!')).toBeNull();
    expect(decodeSessionEdge('aGVsbG8=')).toBeNull(); // "hello"
  });

  it('decodes a valid non-expired session', () => {
    const token = encodeSession({
      userId: 'u1',
      role: 'SUPER_ADMIN',
      exp: Date.now() + 60_000,
    });
    const session = decodeSessionEdge(token);
    expect(session).not.toBeNull();
    expect(session?.userId).toBe('u1');
    expect(session?.role).toBe('SUPER_ADMIN');
  });

  it('returns null for expired sessions', () => {
    const token = encodeSession({
      userId: 'u1',
      role: 'SUPER_ADMIN',
      exp: Date.now() - 1000,
    });
    expect(decodeSessionEdge(token)).toBeNull();
  });

  it('returns null when required fields are missing', () => {
    const token = encodeSession({ userId: 'u1' });
    expect(decodeSessionEdge(token)).toBeNull();
  });
});

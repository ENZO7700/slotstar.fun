import { describe, expect, it } from 'vitest';
import { decodeHtmlEntities } from './utils';

describe('decodeHtmlEntities', () => {
  it('returns empty string for null, undefined, or empty input', () => {
    expect(decodeHtmlEntities(null)).toBe('');
    expect(decodeHtmlEntities(undefined)).toBe('');
    expect(decodeHtmlEntities('')).toBe('');
  });

  it('decodes common HTML entities', () => {
    expect(decodeHtmlEntities('A &amp; B')).toBe('A & B');
    expect(decodeHtmlEntities('&lt;tag&gt;')).toBe('<tag>');
    expect(decodeHtmlEntities('&quot;quoted&quot;')).toBe('"quoted"');
    expect(decodeHtmlEntities('it&#039;s')).toBe("it's");
    expect(decodeHtmlEntities('foo&nbsp;bar')).toBe('foo bar');
  });

  it('decodes WordPress curly quotes and dashes', () => {
    expect(decodeHtmlEntities('it&#8217;s')).toBe("it's");
    expect(decodeHtmlEntities('&#8216;quote&#8217;')).toBe("'quote'");
    expect(decodeHtmlEntities('&#8220;hello&#8221;')).toBe('"hello"');
    expect(decodeHtmlEntities('en&#8211;dash')).toBe('en-dash');
    expect(decodeHtmlEntities('em&#8212;dash')).toBe('em—dash');
  });

  it('decodes a mixed entity string', () => {
    expect(decodeHtmlEntities('Slots &amp; Spins &#8212; &#8220;Free&#8221;')).toBe(
      'Slots & Spins — "Free"',
    );
  });

  it('leaves plain text unchanged', () => {
    expect(decodeHtmlEntities('Book of Dead')).toBe('Book of Dead');
  });
});

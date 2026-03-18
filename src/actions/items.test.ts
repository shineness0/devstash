import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateItem } from './items';

// Mock 'use server' dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/db/items', () => ({
  updateItem: vi.fn(),
}));

import { auth } from '@/auth';
import { updateItem as dbUpdateItem } from '@/lib/db/items';

const mockAuth = vi.mocked(auth);
const mockDbUpdate = vi.mocked(dbUpdateItem);

const SESSION = { user: { id: 'user-1', email: 'test@example.com' } };

const VALID_DATA = {
  title: 'My Snippet',
  description: 'A description',
  content: 'console.log("hello")',
  url: null,
  language: 'TypeScript',
  tags: ['react', 'hooks'],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.mockResolvedValue(SESSION as never);
});

describe('updateItem action', () => {
  describe('auth guard', () => {
    it('returns unauthorized when no session', async () => {
      mockAuth.mockResolvedValue(null);
      const result = await updateItem('item-1', VALID_DATA);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(mockDbUpdate).not.toHaveBeenCalled();
    });

    it('returns unauthorized when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: {} } as never);
      const result = await updateItem('item-1', VALID_DATA);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('validation', () => {
    it('rejects empty title', async () => {
      const result = await updateItem('item-1', { ...VALID_DATA, title: '' });
      expect(result.success).toBe(false);
      if (!result.success && typeof result.error === 'object') {
        expect(result.error.title).toBeDefined();
      }
    });

    it('rejects whitespace-only title', async () => {
      const result = await updateItem('item-1', { ...VALID_DATA, title: '   ' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid URL', async () => {
      const result = await updateItem('item-1', { ...VALID_DATA, url: 'not-a-url' });
      expect(result.success).toBe(false);
      if (!result.success && typeof result.error === 'object') {
        expect(result.error.url).toBeDefined();
      }
    });

    it('accepts valid http URL', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      const result = await updateItem('item-1', { ...VALID_DATA, url: 'http://example.com' });
      expect(result.success).toBe(true);
    });

    it('accepts valid https URL', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      const result = await updateItem('item-1', { ...VALID_DATA, url: 'https://example.com/path?q=1' });
      expect(result.success).toBe(true);
    });

    it('accepts null URL', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      const result = await updateItem('item-1', { ...VALID_DATA, url: null });
      expect(result.success).toBe(true);
    });

    it('defaults tags to empty array when omitted', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      const { tags: _tags, ...withoutTags } = VALID_DATA;
      await updateItem('item-1', withoutTags);
      expect(mockDbUpdate).toHaveBeenCalledWith('item-1', 'user-1', expect.objectContaining({ tags: [] }));
    });

    it('filters empty strings from tags array', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      // Tags are already an array; empty strings are filtered by Zod min(1)
      const result = await updateItem('item-1', { ...VALID_DATA, tags: ['react', '  ', 'hooks'] });
      // '  ' trims to '' which fails min(1) — whole validation should fail
      expect(result.success).toBe(false);
    });
  });

  describe('happy path', () => {
    it('calls dbUpdateItem with correct args and returns data', async () => {
      const fakeItem = { id: 'item-1', title: 'My Snippet' };
      mockDbUpdate.mockResolvedValue(fakeItem as never);

      const result = await updateItem('item-1', VALID_DATA);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(fakeItem);
      }
      expect(mockDbUpdate).toHaveBeenCalledWith('item-1', 'user-1', {
        title: 'My Snippet',
        description: 'A description',
        content: 'console.log("hello")',
        url: null,
        language: 'TypeScript',
        tags: ['react', 'hooks'],
      });
    });

    it('trims title whitespace', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      await updateItem('item-1', { ...VALID_DATA, title: '  Trimmed  ' });
      expect(mockDbUpdate).toHaveBeenCalledWith('item-1', 'user-1', expect.objectContaining({ title: 'Trimmed' }));
    });

    it('coerces undefined optional fields to null', async () => {
      mockDbUpdate.mockResolvedValue({} as never);
      await updateItem('item-1', { title: 'T', description: undefined, content: undefined, url: undefined, language: undefined, tags: [] });
      expect(mockDbUpdate).toHaveBeenCalledWith('item-1', 'user-1', expect.objectContaining({
        description: null,
        content: null,
        url: null,
        language: null,
      }));
    });
  });

  describe('db error handling', () => {
    it('returns error message when db throws', async () => {
      mockDbUpdate.mockRejectedValue(new Error('DB connection failed'));
      const result = await updateItem('item-1', VALID_DATA);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update item');
    });
  });
});

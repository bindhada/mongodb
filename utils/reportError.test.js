import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const { mockSetTag } = vi.hoisted(() => ({
  mockSetTag: vi.fn(),
}));

vi.mock('@sentry/node', () => ({
  withScope: vi.fn((callback) => callback({
    setTag: mockSetTag,
  })),
  captureException: vi.fn(),
}));

import * as Sentry from '@sentry/node';
import { reportError, shouldReport } from './reportError.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('shouldReport', () => {
  it('returns true for ordinary errors', () => {
    expect(shouldReport(new Error('Something went wrong'))).toBe(true);
  });

  it('returns false for Zod errors', () => {
    const result = z.string().safeParse(123);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(shouldReport(result.error)).toBe(false);
    }
  });
});

describe('reportError', () => {
  it('sends ordinary errors to Sentry', () => {
    const error = new Error('Database failed');

    reportError(error, 'books');

    expect(Sentry.withScope).toHaveBeenCalledOnce();
    expect(mockSetTag).toHaveBeenCalledWith('feature', 'books');
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('does not send Zod errors to Sentry', () => {
    const result = z.string().safeParse(123);

    if (!result.success) {
      reportError(result.error, 'books');
    }

    expect(Sentry.withScope).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
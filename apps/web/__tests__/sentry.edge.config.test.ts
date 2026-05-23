import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
}));

describe('sentry.edge.config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('calls Sentry.init with the server DSN and edge-friendly config (no includeLocalVariables)', async () => {
    process.env.SENTRY_DSN = 'https://edge@sentry.io/3';
    await import('../sentry.edge.config');
    const Sentry = await import('@sentry/nextjs');

    expect(Sentry.init).toHaveBeenCalledOnce();
    const config = vi.mocked(Sentry.init).mock.calls[0]?.[0];
    expect(config).toMatchObject({
      dsn: 'https://edge@sentry.io/3',
      sendDefaultPii: true,
      enableLogs: true,
    });
    // Edge runtime can't read local variables; VercelEdgeOptions doesn't even
    // accept includeLocalVariables, so we assert via Object.keys to stay
    // compatible with the runtime type narrowing.
    expect(Object.keys(config ?? {})).not.toContain('includeLocalVariables');
  });
});

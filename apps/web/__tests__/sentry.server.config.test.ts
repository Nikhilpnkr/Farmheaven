import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
}));

describe('sentry.server.config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('calls Sentry.init with the server DSN and recommended server config', async () => {
    process.env.SENTRY_DSN = 'https://srv@sentry.io/2';
    await import('../sentry.server.config');
    const Sentry = await import('@sentry/nextjs');

    expect(Sentry.init).toHaveBeenCalledOnce();
    const config = vi.mocked(Sentry.init).mock.calls[0]?.[0];
    expect(config).toMatchObject({
      dsn: 'https://srv@sentry.io/2',
      sendDefaultPii: true,
      includeLocalVariables: true,
      enableLogs: true,
    });
  });
});

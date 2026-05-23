import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
  replayIntegration: vi.fn(() => ({ name: 'Replay' })),
  captureRouterTransitionStart: vi.fn(),
}));

describe('instrumentation-client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('calls Sentry.init with the public DSN and recommended browser config', async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://pub@sentry.io/1';
    // Re-import so the module re-runs against the freshly cleared mock.
    await import('../instrumentation-client');
    const Sentry = await import('@sentry/nextjs');

    expect(Sentry.init).toHaveBeenCalledOnce();
    const config = vi.mocked(Sentry.init).mock.calls[0]?.[0];
    expect(config).toMatchObject({
      dsn: 'https://pub@sentry.io/1',
      sendDefaultPii: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      enableLogs: true,
    });
    // Replay integration registered exactly once.
    expect(Sentry.replayIntegration).toHaveBeenCalledOnce();
    expect(config?.integrations).toHaveLength(1);
  });

  it('re-exports captureRouterTransitionStart as onRouterTransitionStart', async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://pub@sentry.io/1';
    const mod = await import('../instrumentation-client');
    const Sentry = await import('@sentry/nextjs');
    expect(mod.onRouterTransitionStart).toBe(Sentry.captureRouterTransitionStart);
  });
});

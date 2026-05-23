import { beforeEach, describe, expect, it, vi } from 'vitest';

const serverLoad = vi.fn();
const edgeLoad = vi.fn();

vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
  captureRequestError: vi.fn(),
}));

vi.mock('../sentry.server.config', () => {
  serverLoad();
  return {};
});

vi.mock('../sentry.edge.config', () => {
  edgeLoad();
  return {};
});

describe('instrumentation.register()', () => {
  beforeEach(() => {
    vi.resetModules();
    serverLoad.mockReset();
    edgeLoad.mockReset();
  });

  it('loads sentry.server.config when NEXT_RUNTIME=nodejs', async () => {
    process.env.NEXT_RUNTIME = 'nodejs';
    const { register } = await import('../instrumentation');
    await register();
    expect(serverLoad).toHaveBeenCalledOnce();
    expect(edgeLoad).not.toHaveBeenCalled();
  });

  it('loads sentry.edge.config when NEXT_RUNTIME=edge', async () => {
    process.env.NEXT_RUNTIME = 'edge';
    const { register } = await import('../instrumentation');
    await register();
    expect(edgeLoad).toHaveBeenCalledOnce();
    expect(serverLoad).not.toHaveBeenCalled();
  });

  it('does nothing when NEXT_RUNTIME is unset', async () => {
    process.env.NEXT_RUNTIME = '';
    const { register } = await import('../instrumentation');
    await register();
    expect(serverLoad).not.toHaveBeenCalled();
    expect(edgeLoad).not.toHaveBeenCalled();
  });

  it('re-exports captureRequestError as onRequestError', async () => {
    const mod = await import('../instrumentation');
    const Sentry = await import('@sentry/nextjs');
    expect(mod.onRequestError).toBe(Sentry.captureRequestError);
  });
});

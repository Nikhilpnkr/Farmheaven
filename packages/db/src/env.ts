// Read a required environment variable. Throws at runtime if missing
// so misconfiguration surfaces at app boot with a clear error instead
// of crashing later inside Supabase client code with "Invalid URL" or
// similar opaque failures.
//
// Used by every client in this package (server, browser, middleware,
// service-role admin) to replace the bare `process.env.X!` non-null
// assertions that biome's `noNonNullAssertion` rule (correctly) bans.
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in apps/web/.env.local (development) or in the Vercel project settings (production).`,
    );
  }
  return value;
}

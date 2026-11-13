export function localEnvironment(status) {
  const url = new URL(status.API_URL);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error("Expected a local Supabase URL; refusing to use a remote backend in local mode.");
  }
  const key = status.PUBLISHABLE_KEY || status.ANON_KEY;
  if (typeof key !== "string" || !key) throw new Error("Local Supabase did not return a public API key.");
  // Never pass the CLI's service-role key or database password to Next.js.
  return {
    NEXT_PUBLIC_SUPABASE_URL: url.origin,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  };
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { localEnvironment } from "../scripts/local-environment.mjs";

test("local startup forwards only public settings", () => {
  assert.deepEqual(localEnvironment({ API_URL: "http://127.0.0.1:54321", ANON_KEY: "public", SERVICE_ROLE_KEY: "secret", DB_URL: "private" }), {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  });
});
test("local startup refuses remote endpoints and missing keys", () => {
  assert.throws(() => localEnvironment({ API_URL: "https://project.supabase.co", ANON_KEY: "public" }));
  assert.throws(() => localEnvironment({ API_URL: "http://localhost:54321" }));
});

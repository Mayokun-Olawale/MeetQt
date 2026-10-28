import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "meetq-tests-"));
try {
  const compile = spawnSync(process.execPath, [require.resolve("typescript/bin/tsc"), "tests/event-validation.test.ts", "tests/profile-validation.test.ts", "--outDir", output, "--module", "commonjs", "--moduleResolution", "node", "--target", "es2022", "--esModuleInterop", "--skipLibCheck"], { stdio: "inherit" });
  if (compile.error) throw compile.error;
  if (compile.status !== 0) process.exitCode = compile.status ?? 1;
  else {
    const tests = spawnSync(process.execPath, ["--test", join(output, "tests/event-validation.test.js"), join(output, "tests/profile-validation.test.js")], { stdio: "inherit", env: { ...process.env, NODE_PATH: resolve("node_modules") } });
    if (tests.error) throw tests.error;
    process.exitCode = tests.status ?? 1;
  }
} finally { rmSync(output, { recursive: true, force: true }); }

import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { localEnvironment } from "./local-environment.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const forceLocal = args.includes("--local");
const configured = process.env.NEXT_PUBLIC_SUPABASE_URL ||
  [".env.local", ".env.development.local", ".env.development", ".env"].some(name => existsSync(root + name));
let env = { ...process.env };
if (forceLocal || !configured) {
  const cli = root + "node_modules/.bin/supabase" + (process.platform === "win32" ? ".cmd" : "");
  const status = spawnSync(cli, ["status", "--output", "json"], {
    cwd: root, encoding: "utf8", shell: process.platform === "win32",
  });
  try {
    if (status.status !== 0) throw new Error("Local Supabase is not running. Start Docker, then run npx supabase start.");
    env = { ...env, ...localEnvironment(JSON.parse(status.stdout)) };
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log("Using local Supabase. Email inbox: http://localhost:54324");
} else {
  console.log("Using existing environment configuration. Use npm run dev:local to select Docker instead.");
}
const child = spawn(process.execPath, [root + "node_modules/next/dist/bin/next", "dev", ...args.filter(arg => arg !== "--local")], {
  cwd: root, env, stdio: "inherit",
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
child.on("exit", code => { process.exitCode = code ?? 0; });

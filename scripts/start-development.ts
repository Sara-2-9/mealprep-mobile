const expoArguments = process.argv.slice(2);
const apiBaseUrl = Bun.env.EXPO_PUBLIC_API_BASE_URL ?? `http://localhost:${Bun.env.API_PORT ?? "3000"}`;
const healthUrl = `${apiBaseUrl.replace(/\/$/, "")}/health`;

async function isMealPrepApiRunning() {
  try {
    const response = await fetch(healthUrl, { signal: AbortSignal.timeout(750) });
    if (!response.ok) return false;
    const payload = (await response.json()) as { status?: string };
    return payload.status === "ok";
  } catch {
    return false;
  }
}

const controller = new AbortController();
const children: Bun.Subprocess[] = [];

function spawn(command: string[]) {
  const child = Bun.spawn(command, {
    signal: controller.signal,
    stderr: "inherit",
    stdin: command[1] === "expo" ? "inherit" : "ignore",
    stdout: "inherit",
  });
  children.push(child);
  return child;
}

let api: Bun.Subprocess | undefined;

if (await isMealPrepApiRunning()) {
  console.log(`Using the running MealPrep API at ${apiBaseUrl}`);
} else {
  console.log(`Starting the MealPrep API at ${apiBaseUrl}`);
  api = spawn(["bun", "--watch", "server/index.ts"]);
}

const expo = spawn(["bunx", "expo", "start", ...expoArguments]);
let stopping = false;

function stopChildren() {
  if (stopping) return;
  stopping = true;
  controller.abort();
}

process.once("SIGINT", stopChildren);
process.once("SIGTERM", stopChildren);

const firstExit = await Promise.race([
  expo.exited.then((exitCode) => ({ exitCode, process: "Expo" })),
  ...(api ? [api.exited.then((exitCode) => ({ exitCode, process: "MealPrep API" }))] : []),
]);

if (firstExit.exitCode !== 0) console.error(`${firstExit.process} exited with code ${firstExit.exitCode}.`);
stopChildren();
await Promise.allSettled(children.map((child) => child.exited));
process.exitCode = firstExit.exitCode;

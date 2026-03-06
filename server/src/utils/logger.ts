import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve(__dirname, "../../saved/logs");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function stamp(): string {
  return new Date().toISOString();
}

function dayFile(): string {
  return path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.log`);
}

function write(level: string, ...args: unknown[]) {
  const msg = args
    .map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)))
    .join(" ");
  const line = `[${stamp()}] [${level.toUpperCase()}] ${msg}`;

  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }

  try {
    ensureLogDir();
    fs.appendFileSync(dayFile(), line + "\n");
  } catch {
    // silent — logging should never crash the server
  }
}

export const logger = {
  info: (...args: unknown[]) => write("info", ...args),
  warn: (...args: unknown[]) => write("warn", ...args),
  error: (...args: unknown[]) => write("error", ...args),
  debug: (...args: unknown[]) => write("debug", ...args),
};

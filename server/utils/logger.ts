import fs from 'fs';
import path from 'path';

const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'server.log');

export const logError = (scope: string, err: unknown, context: Record<string, unknown> = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    scope,
    message:
      err && typeof err === 'object' && 'message' in err ? (err as Error).message : String(err),
    stack: err && typeof err === 'object' && 'stack' in err ? (err as Error).stack : undefined,
    context,
  };
  console.error(`[${entry.timestamp}] ${scope}: ${entry.message}`, context);
  fs.appendFileSync(logFile, `${JSON.stringify(entry)}\n`);
};

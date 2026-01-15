import { env } from '@config/env';

type Level = 'info' | 'warn' | 'error';

function sanitize(obj: unknown) {
  if (!obj || typeof obj !== 'object') return obj;
  const sensitive = ['password', 'password_hash', 'token', 'refresh_token', 'authorization', 'cookie'];
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (sensitive.includes(k.toLowerCase())) {
      result[k] = '[redacted]';
    } else if (typeof v === 'object' && v !== null) {
      result[k] = sanitize(v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

function write(level: Level, message: string, meta?: Record<string, unknown>) {
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    message,
    meta: meta ? sanitize(meta) : undefined,
    env: env.NODE_ENV,
  }) + '\n';
  process.stdout.write(line);
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    write('info', message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    write('warn', message, meta);
  },
  error(message: string, meta?: Record<string, unknown>) {
    write('error', message, meta);
  },
};


type Env = Record<string, string | undefined>;

export function sentryOptions(env: Env) {
  return {
    dsn: env.SENTRY_DSN,
    enabled: Boolean(env.SENTRY_DSN),
    environment: env.SENTRY_ENVIRONMENT ?? env.NODE_ENV ?? 'development',
    sendDefaultPii: false,
  };
}

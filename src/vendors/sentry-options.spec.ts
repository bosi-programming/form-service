import { sentryOptions } from './sentry-options';

describe('sentryOptions', () => {
  it('should read the DSN and environment from the environment', () => {
    const options = sentryOptions({
      SENTRY_DSN: 'https://key@example.ingest.sentry.io/1',
      SENTRY_ENVIRONMENT: 'vm',
    });
    expect(options.dsn).toBe('https://key@example.ingest.sentry.io/1');
    expect(options.environment).toBe('vm');
    expect(options.enabled).toBe(true);
  });

  it('should fall back to NODE_ENV for the environment', () => {
    const options = sentryOptions({
      SENTRY_DSN: 'https://key@example.ingest.sentry.io/1',
      NODE_ENV: 'production',
    });
    expect(options.environment).toBe('production');
  });

  it('should stay off without a DSN', () => {
    const options = sentryOptions({});
    expect(options.dsn).toBeUndefined();
    expect(options.enabled).toBe(false);
    expect(options.environment).toBe('development');
  });

  it('should never send default PII', () => {
    const options = sentryOptions({
      SENTRY_DSN: 'https://key@example.ingest.sentry.io/1',
    });
    expect(options.sendDefaultPii).toBe(false);
  });
});

import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'https://ae0aa3197d5f89034f26e2a278f227db@o4509961437970432.ingest.us.sentry.io/4510055035043840',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: 'local',
});

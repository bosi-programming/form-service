import * as Sentry from '@sentry/nestjs';
import { sentryOptions } from './sentry-options';

Sentry.init(sentryOptions(process.env));

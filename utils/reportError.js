import * as Sentry from '@sentry/node';
import { ZodError } from 'zod';

export function shouldReport(error) {
  return !(error instanceof ZodError);
}

export function reportError(error, feature) {
  if (!shouldReport(error)) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag('feature', feature);
    Sentry.captureException(error);
  });
}
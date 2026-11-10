import * as Sentry from '@sentry/node';

export function reportError(error, feature) {
  Sentry.withScope((scope) => {
    scope.setTag('feature', feature);
    Sentry.captureException(error);
  });
}
import * as Sentry from '@sentry/react';

import { Route } from 'react-router-dom';

import { FC, PropsWithChildren } from 'react';

import { history } from './history';
import config from './config';

Sentry.init({
  // TODO remove enabled after close all sentry tasks
  enabled: false,
  dsn: config.sentryDsn,
  environment: config.sentryEnv,
  integrations: [
    Sentry.browserProfilingIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      mask: ['.sentry-mask'],
      unmask: ['.sentry-unmask'],
      block: ['.sentry-block'],
      unblock: ['.sentry-unblock'],
      ignore: ['.sentry-ignore'],
      // networkDetailAllowUrls: [
      //   'https://test.fio.eosusa.io/v1/history/get_actions',
      // ],
      // networkCaptureBodies: true,
      // networkRequestHeaders: ['X-Custom-Header'],
      // networkResponseHeaders: ['X-Custom-Header'],
    }),
    Sentry.reactRouterV5BrowserTracingIntegration({ history }),
  ],

  normalizeDepth: 10,
  maxBreadcrumbs: 50,
  attachStacktrace: true,
  autoSessionTracking: true,

  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: config.sentryReplaysSampleRate,
  replaysOnErrorSampleRate: config.sentryReplaysOnErrorSampleRate,
});

export const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  attachReduxState: true,
  stateTransformer(state) {
    const updatedState = {
      ...state,
    };

    delete updatedState['notifications'];
    delete updatedState['account'];
    delete updatedState['containedFlow'];
    delete updatedState['fioWalletsData'];
    delete updatedState['modal'];
    delete updatedState['wrapStatus'];
    delete updatedState['orders'];

    return updatedState;
  },
});

export const SentryRoute = Sentry.withSentryRouting(Route);

export const SentryErrorBoundary: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      {children}
    </Sentry.ErrorBoundary>
  );
};

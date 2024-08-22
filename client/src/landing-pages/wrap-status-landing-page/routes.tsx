import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import { WrapStatusContainer } from './components/WrapStatusContainer/WrapStatusContainer';
import ScrollToTop from '../../components/ScrollToTop';
import { Loader } from './components/Loader';

import { ROUTES } from '../../constants/routes';
import { SentryRoute } from '../../sentry';

const WrapStatusPageUnwrapTokens = React.lazy(() =>
  import(
    /* webpackChunkName: 'WrapStatusPageUnwrapTokens' */ '../../pages/WrapStatusPageUnwrapTokens'
  ),
);

const WrapStatusPageUnwrapDomains = React.lazy(() =>
  import(
    /* webpackChunkName: 'WrapStatusPageUnwrapDomains' */ '../../pages/WrapStatusPageUnwrapDomains'
  ),
);

const WrapStatusPageWrapTokens = React.lazy(() =>
  import(
    /* webpackChunkName: 'WrapStatusPageWrapTokens' */ '../../pages/WrapStatusPageWrapTokens'
  ),
);

const WrapStatusPageWrapDomains = React.lazy(() =>
  import(
    /* webpackChunkName: 'WrapStatusPageWrapDomains' */ '../../pages/WrapStatusPageWrapDomains'
  ),
);

const WrapStatusPageBurnedDomains = React.lazy(() =>
  import(
    /* webpackChunkName: 'WrapStatusPageBurnedDomains' */ '../../pages/WrapStatusPageBurnedDomains'
  ),
);

const Routes = (): React.ReactElement => (
  <WrapStatusContainer>
    <ScrollToTop>
      <React.Suspense fallback={<Loader />}>
        <Switch>
          <SentryRoute
            path={ROUTES.HOME}
            component={() => <Redirect to={ROUTES.WRAP_STATUS_WRAP_TOKENS} />}
            exact
          />
          <SentryRoute
            path={ROUTES.WRAP_STATUS}
            component={() => <Redirect to={ROUTES.WRAP_STATUS_WRAP_TOKENS} />}
            exact
          />
          <SentryRoute
            path={ROUTES.WRAP_STATUS_UNWRAP_TOKENS}
            component={WrapStatusPageUnwrapTokens}
            exact
          />
          <SentryRoute
            path={ROUTES.WRAP_STATUS_WRAP_TOKENS}
            component={WrapStatusPageWrapTokens}
            exact
          />
          <SentryRoute
            path={ROUTES.WRAP_STATUS_WRAP_DOMAINS}
            component={WrapStatusPageWrapDomains}
            exact
          />
          <SentryRoute
            path={ROUTES.WRAP_STATUS_UNWRAP_DOMAINS}
            component={WrapStatusPageUnwrapDomains}
            exact
          />
          <SentryRoute
            path={ROUTES.WRAP_STATUS_BURNED_DOMAINS}
            component={WrapStatusPageBurnedDomains}
            exact
          />
        </Switch>
      </React.Suspense>
    </ScrollToTop>
  </WrapStatusContainer>
);

export default Routes;

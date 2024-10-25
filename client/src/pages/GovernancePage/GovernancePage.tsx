import React, { FC } from 'react';

import { Redirect, Switch } from 'react-router-dom';

import ScrollToTop from '../../components/ScrollToTop';
import { Loader } from '../../landing-pages/wrap-status-landing-page/components/Loader';
import { SentryRoute } from '../../sentry';
import { ROUTES } from '../../constants/routes';
import { GovernancePageContainer } from './components/GovernancePageContainer';

const GovernanceOverviewTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceOverviewTab' */ './components/GovernanceOverviewTab'
  ),
);

const GovernanceFioFoundationBoardOfDirectorsTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceFioFoundationBoardOfDirectorsTab' */ './components/GovernanceFioFoundationBoardOfDirectorsTab'
  ),
);

const GovernanceBlockProducersTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceBlockProducersTab' */ './components/GovernanceBlockProducersTab'
  ),
);

const GovernanceProxiesTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceProxiesTab' */ './components/GovernanceProxiesTab'
  ),
);

const GovernanceVotingHelpTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceVotingHelpTab' */ './components/GovernanceVotingHelpTab'
  ),
);

const GovernancePage: FC = () => {
  return (
    <GovernancePageContainer>
      <ScrollToTop>
        <React.Suspense fallback={<Loader />}>
          <Switch>
            <SentryRoute
              path={ROUTES.GOVERNANCE}
              component={() => <Redirect to={ROUTES.GOVERNANCE_OVERVIEW} />}
              exact
            />
            <SentryRoute
              path={ROUTES.GOVERNANCE_OVERVIEW}
              component={GovernanceOverviewTab}
              exact
            />
            <SentryRoute
              path={ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS}
              component={GovernanceFioFoundationBoardOfDirectorsTab}
              exact
            />
            <SentryRoute
              path={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
              component={GovernanceBlockProducersTab}
              exact
            />
            <SentryRoute
              path={ROUTES.GOVERNANCE_PROXIES}
              component={GovernanceProxiesTab}
              exact
            />
            <SentryRoute
              path={ROUTES.GOVERNANCE_VOTING_HELP}
              component={GovernanceVotingHelpTab}
              exact
            />
          </Switch>
        </React.Suspense>
      </ScrollToTop>
    </GovernancePageContainer>
  );
};

export default GovernancePage;

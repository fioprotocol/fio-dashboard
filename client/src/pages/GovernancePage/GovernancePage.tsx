import React, { FC } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import ScrollToTop from '../../components/ScrollToTop';
import { Loader } from '../../landing-pages/wrap-status-landing-page/components/Loader';
import { SentryRoute } from '../../sentry';
import { ROUTES } from '../../constants/routes';
import { GovernancePageContainer } from './components/GovernancePageContainer';

import { useContext } from './GovernancePageContext';

const GovernanceOverviewTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceOverviewTab' */ './components/GovernanceOverviewTab/GovernanceOverviewTab'
  ),
);

const GovernanceFioFoundationBoardOfDirectorsTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'BoardOfDirectorsTab' */ './components/BoardOfDirectorsTab/'
  ),
);

const BlockProducersTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'BlockProducersTab' */ './components/BlockProducersTab'
  ),
);

const GovernanceProxiesTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceProxiesTab' */ './components/GovernanceProxiesTab/GovernanceProxiesTab'
  ),
);

const GovernanceVotingHelpTab = React.lazy(() =>
  import(
    /* webpackChunkName: 'GovernanceVotingHelpTab' */ './components/GovernanceVotingHelpTab/GovernanceVotingHelpTab'
  ),
);

const CastBoardVotePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'CastBoardVotePage' */ './components/CastBoardVotePage'
  ),
);

const CastBlockProducerVotePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'CastBlockProducerVotePage' */ './components/CastBlockProducerVotePage'
  ),
);

const ProxiesVotePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'ProxiesVotePage' */ './components/ProxiesVotePage'
  ),
);

const GovernancePage: FC = () => {
  const containerProps = useContext();

  return (
    <ScrollToTop>
      <React.Suspense fallback={<Loader />}>
        <Switch>
          <Route
            path={[
              ROUTES.GOVERNANCE,
              ROUTES.GOVERNANCE_OVERVIEW,
              ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS,
              ROUTES.GOVERNANCE_BLOCK_PRODUCERS,
              ROUTES.GOVERNANCE_PROXIES,
              ROUTES.GOVERNANCE_VOTING_HELP,
            ]}
            exact
          >
            <GovernancePageContainer>
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
                render={props => (
                  <GovernanceFioFoundationBoardOfDirectorsTab
                    {...props}
                    {...containerProps}
                  />
                )}
                exact
              />
              <SentryRoute
                path={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
                render={props => (
                  <BlockProducersTab {...props} {...containerProps} />
                )}
                exact
              />
              <SentryRoute
                path={ROUTES.GOVERNANCE_PROXIES}
                render={props => (
                  <GovernanceProxiesTab {...props} {...containerProps} />
                )}
                exact
              />
              <SentryRoute
                path={ROUTES.GOVERNANCE_VOTING_HELP}
                component={GovernanceVotingHelpTab}
                exact
              />
            </GovernancePageContainer>
          </Route>

          <SentryRoute
            path={ROUTES.GOVERNANCE_CAST_BOARD_VOTE}
            render={props => (
              <CastBoardVotePage {...props} {...containerProps} />
            )}
            exact
          />

          <SentryRoute
            path={ROUTES.GOVERNANCE_CAST_BLOCK_PRODUCER_VOTE}
            render={props => (
              <CastBlockProducerVotePage {...props} {...containerProps} />
            )}
            exact
          />

          <SentryRoute
            path={ROUTES.GOVERNANCE_PROXIES_VOTE}
            render={props => <ProxiesVotePage {...props} {...containerProps} />}
            exact
          />
        </Switch>
      </React.Suspense>
    </ScrollToTop>
  );
};

export default GovernancePage;

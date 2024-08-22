import { Provider } from 'react-redux';
import { hydrate, render } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { HelmetProvider } from 'react-helmet-async';

import { SentryErrorBoundary } from './sentry';
import { history } from './history';

import { store } from './redux/init';

import Routes from './routes';

const App = () => (
  <SentryErrorBoundary>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <HelmetProvider>
          <Routes />
        </HelmetProvider>
      </ConnectedRouter>
    </Provider>
  </SentryErrorBoundary>
);

const rootElement = document.getElementById('root');
(rootElement.hasChildNodes() ? hydrate : render)(<App />, rootElement);

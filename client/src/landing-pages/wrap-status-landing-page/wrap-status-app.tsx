import { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { HelmetProvider } from 'react-helmet-async';
import { library } from '@fortawesome/fontawesome-svg-core';

import icons from './icons';

import { store, history } from './redux/init';

import Routes from './routes';

library.add(icons);

class WrapStatusLandingPage extends Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <HelmetProvider>
            <Routes />
          </HelmetProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(
  <WrapStatusLandingPage />,
  document.getElementById('wrap-status-landing-page'),
);

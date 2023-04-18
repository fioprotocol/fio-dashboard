import { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { LastLocationProvider } from 'react-router-last-location';
import { HelmetProvider } from 'react-helmet-async';

import TwitterMeta from './components/TwitterMeta/TwitterMeta';

import icons from './icons';

import { store, history } from './redux/init';

import Routes from './routes';

library.add(icons);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LastLocationProvider>
            <TwitterMeta />
            <HelmetProvider>
              <Routes />
            </HelmetProvider>
          </LastLocationProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

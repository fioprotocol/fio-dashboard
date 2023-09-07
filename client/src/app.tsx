import { Component } from 'react';
import { Provider } from 'react-redux';
import { hydrate, render } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { HelmetProvider } from 'react-helmet-async';

import { store, history } from './redux/init';

import Routes from './routes';

class App extends Component {
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

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

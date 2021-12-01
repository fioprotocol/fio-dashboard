import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { LastLocationProvider } from 'react-router-last-location';

import icons from './icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import { store, history } from './redux/init';

import Routes from './routes';

library.add(icons);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LastLocationProvider>
            <Routes />
          </LastLocationProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

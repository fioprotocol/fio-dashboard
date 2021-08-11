import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { library } from '@fortawesome/fontawesome-svg-core';
import { LastLocationProvider } from 'react-router-last-location';

import { addLocationQuery } from './helpers/routeParams';

import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faArrowRight,
  faCog,
  faBell,
  faCircle,
  faShoppingCart,
  faTimesCircle,
  faInfoCircle,
  faBan,
  faChevronUp,
  faChevronDown,
  faUserCircle,
  faKeyboard,
  faCheckCircle,
  faSpinner,
  faChevronRight,
  faExclamationCircle,
  faExclamationTriangle,
  faLink,
  faAt,
  faSearch,
  faPlusSquare,
  faTrash,
  faWallet,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  faCircle as faRegularCircle,
  faClipboard as faRegularClipboard,
} from '@fortawesome/free-regular-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import api from './api';
import configureStore from './redux/store';

import Routes from './routes';

const history = createHistory();

addLocationQuery(history);

history.listen(() => addLocationQuery(history));

library.add(
  faEye,
  faEyeSlash,
  faArrowLeft,
  faArrowRight,
  faCog,
  faBell,
  faCircle,
  faRegularClipboard,
  faShoppingCart,
  faTimesCircle,
  faInfoCircle,
  faBan,
  faChevronUp,
  faChevronDown,
  faChevronRight,
  faUserCircle,
  faKeyboard,
  faCheckCircle,
  faRegularCircle,
  faSpinner,
  faExclamationCircle,
  faSearch,
  faPlusSquare,
  faTrash,
  faWallet,
  faPlusCircle,
  faExclamationTriangle,
  faLink,
  faAt,
);

const store = configureStore(api, history);

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

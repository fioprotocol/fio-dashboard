import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { LastLocationProvider } from 'react-router-last-location';

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
  faPen,
  faCheckSquare,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import {
  faCircle as faRegularCircle,
  faClipboard as faRegularClipboard,
  faSquare as faRegularSquare,
} from '@fortawesome/free-regular-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import { store, history } from './redux/init';

import Routes from './routes';

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
  faPen,
  faCheckSquare,
  faRegularSquare,
  faCheck,
);

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

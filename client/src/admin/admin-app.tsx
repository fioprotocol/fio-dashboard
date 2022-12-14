import { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { library } from '@fortawesome/fontawesome-svg-core';

import icons from '../icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import { store, history } from './redux/init';

import Routes from './routes';

library.add(icons);

class AdminApp extends Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<AdminApp />, document.getElementById('admin-page'));

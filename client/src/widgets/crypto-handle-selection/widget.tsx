import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddressWidget from '../../components/AddressWidget';

import icons from './icons';

import { store } from './redux/init';

library.add(icons);

class AddressSelectionWidget extends Component<{}, {}> {
  render() {
    return (
      // todo: store has Store<any> type, but provider wants Store<any, A>
      // @ts-ignore
      <Provider store={store}>
        <AddressWidget />
      </Provider>
    );
  }
}

ReactDOM.render(
  <AddressSelectionWidget />,
  document.getElementById('fio-crypto-handle-selection'),
);

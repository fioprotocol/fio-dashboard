import { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';

import WidgetContainer from './components/WidgetContainer';

import icons from './icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import { store } from './redux/init';

library.add(icons);

class AddressSelectionWidget extends Component<{}, {}> {
  render() {
    return (
      // todo: store has Store<any> type, but provider wants Store<any, A>
      // @ts-ignore
      <Provider store={store}>
        <WidgetContainer />
      </Provider>
    );
  }
}

ReactDOM.render(
  <AddressSelectionWidget />,
  document.getElementById('crypto-handle-selection'),
);

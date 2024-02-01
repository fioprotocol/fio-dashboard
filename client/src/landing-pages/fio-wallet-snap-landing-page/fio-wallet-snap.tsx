import { Component } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';

import { FioWalletSnapComponent } from './FioWalletSnapComponent';

class FioWalletSnapPage extends Component<{}, {}> {
  render() {
    return (
      <HelmetProvider>
        <FioWalletSnapComponent />
      </HelmetProvider>
    );
  }
}

ReactDOM.render(
  <FioWalletSnapPage />,
  document.getElementById('fio-wallet-snap'),
);

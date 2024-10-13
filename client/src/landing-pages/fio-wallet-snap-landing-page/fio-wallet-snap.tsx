import { Component } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';

import { FioSdkLiteComponent } from './FioSdkLiteComponent';

class FioWalletSnapPage extends Component<{}, {}> {
  render() {
    return (
      <HelmetProvider>
        <FioSdkLiteComponent />
      </HelmetProvider>
    );
  }
}

ReactDOM.render(
  <FioWalletSnapPage />,
  document.getElementById('fio-wallet-snap'),
);

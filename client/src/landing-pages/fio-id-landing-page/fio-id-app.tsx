import { Component } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';

import FioIdLandingPage from './FioIdLandingPage';

class FioIdLandingPageMain extends Component<{}, {}> {
  render() {
    return (
      <HelmetProvider>
        <FioIdLandingPage />
      </HelmetProvider>
    );
  }
}

ReactDOM.render(
  <FioIdLandingPageMain />,
  document.getElementById('fio-id-landing-page'),
);

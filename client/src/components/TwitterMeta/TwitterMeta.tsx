import React from 'react';
import { Helmet } from 'react-helmet';

import summaryCardImage from '../../assets/images/landing-page/fio-twitter-summary-card.png';

const TwitterMeta: React.FC = () => {
  const origin = process.env.REACT_APP_BASE_URL.slice(0, -1);
  const hostName = origin.replace('https://', '').replace('http://', '');

  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={hostName} />
      <meta property="twitter:url" content={origin} />
      <meta
        name="twitter:title"
        content="Your FIO handle is now your web3 identity."
      />
      <meta
        name="twitter:description"
        content="Get yours now and replace all of your public wallet addresses with a single, secure, customizable handle."
      />
      <meta name="twitter:image" content={`${origin}${summaryCardImage}`} />
      <meta name="twitter:site" content="@joinfio" />
    </Helmet>
  );
};

export default TwitterMeta;

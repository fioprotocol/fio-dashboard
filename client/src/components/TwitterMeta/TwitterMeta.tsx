import React from 'react';
import { Helmet } from 'react-helmet';

import summaryCardImage from '../../assets/images/landing-page/twitter-summary-card.png';

const TwitterMeta: React.FC = () => {
  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@joinfio" />
      <meta
        name="twitter:title"
        content="Your Twitter handle can now receive crypto"
      />
      <meta name="twitter:description" content="Get yours now" />
      <meta
        name="twitter:image"
        content={`${process.env.REACT_APP_BASE_URL.slice(
          0,
          -1,
        )}${summaryCardImage}`}
      />
    </Helmet>
  );
};

export default TwitterMeta;

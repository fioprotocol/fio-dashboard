import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { APP_TITLE, LINK_TITLES } from '../../constants/labels';
import { ROUTES } from '../../constants/routes';
import { fireAnalyticsEvent } from '../../utils';

type Props = {
  link: string;
};

const PageTitle: React.FC<Props> = props => {
  const { link } = props;

  const title = LINK_TITLES[link]
    ? `${APP_TITLE} - ${LINK_TITLES[link]}`
    : APP_TITLE;

  useEffect(() => {
    const path = ROUTES[link];
    if (link && path) {
      fireAnalyticsEvent('pageview', {
        page: {
          path,
          title,
        },
      });
    }
  }, [link, title]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default PageTitle;

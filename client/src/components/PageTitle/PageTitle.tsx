import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { APP_TITLE, LINK_TITLES } from '../../constants/labels';
import { ROUTES } from '../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

import { fireAnalyticsEvent } from '../../util/analytics';

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
      fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PAGE_VIEW, {
        page_title: title,
        page_location: path,
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

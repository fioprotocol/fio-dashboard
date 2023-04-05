import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { APP_TITLE, LINK_TITLES } from '../../constants/labels';
import { ROUTES } from '../../constants/routes';

import { firePageViewAnalyticsEvent } from '../../util/analytics';

type Props = {
  link: string;
  isVirtualPage?: boolean;
  shouldFireOnce?: boolean;
  noAppName?: boolean;
};

const PageTitle: React.FC<Props> = props => {
  const { link, shouldFireOnce = false, noAppName } = props;

  const title = LINK_TITLES[link]
    ? noAppName
      ? LINK_TITLES[link]
      : `${APP_TITLE} - ${LINK_TITLES[link]}`
    : APP_TITLE;

  useEffect(() => {
    const path = ROUTES[link];
    if (link && path) {
      firePageViewAnalyticsEvent(
        title,
        `${window.location.origin}${path}`,
        shouldFireOnce,
      );
    }
  }, [link, title, shouldFireOnce]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default PageTitle;

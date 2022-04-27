import React from 'react';

import InfoBadge from '../InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../Badge/Badge';
import PriceComponent from './PriceComponent';

import { ADDRESS_FORM_CONTENT } from './constants';

import { NotificationInfoProps } from './types';

const NotificationInfoBadge = (
  props: NotificationInfoProps,
  innerRef: React.Ref<HTMLDivElement>,
) => {
  const {
    showAvailable,
    isDesktop,
    errors,
    isFree,
    isDomain,
    hasCustomDomain,
    hasCurrentDomain,
    roe,
    prices,
    type,
    hasErrors,
  } = props;

  const availableMessage = !isDesktop ? (
    <PriceComponent
      isFree={isFree}
      isDomain={isDomain}
      hasCustomDomain={hasCustomDomain}
      hasCurrentDomain={hasCurrentDomain}
      roe={roe}
      prices={prices}
    />
  ) : (
    ADDRESS_FORM_CONTENT[type].message
  );

  return (
    <div ref={innerRef}>
      <InfoBadge
        type={BADGE_TYPES.SUCCESS}
        show={showAvailable}
        title="Available!"
        message={availableMessage}
        hasBoldMessage={!isDesktop}
      />
      {errors.map(error => {
        if (typeof error === 'string')
          return (
            <InfoBadge
              type={BADGE_TYPES.ERROR}
              title="Try Again!"
              show={hasErrors}
              message={error}
              key={error}
            />
          );
        if (typeof error !== 'string' && error.message)
          return (
            <InfoBadge
              type={error.showInfoError ? BADGE_TYPES.INFO : BADGE_TYPES.ERROR}
              title={error.showInfoError ? '' : 'Try Again!'}
              show={hasErrors}
              message={error.message}
              key={error.message}
            />
          );
        return null;
      })}
    </div>
  );
};

const NotificationInfoBadgeRef = React.forwardRef<
  HTMLDivElement,
  NotificationInfoProps
>(NotificationInfoBadge);

export default NotificationInfoBadgeRef;

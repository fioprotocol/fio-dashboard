import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FioRequestStatusBadge from '../../../components/Badges/FioRequestStatusBadge/FioRequestStatusBadge';

import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import { commonFormatTime } from '../../../util/general';

import { CONTENT_TYPE } from '../constants';

import { FioRequestData } from '../../../types';

import classes from '../styles/FioDataItem.module.scss';

type Props = {
  fioDataItem: FioRequestData;
  type: string;
  onClick: (fioDataItem: FioRequestData) => void;
};

const renderSenderInfo = ({
  title,
  senderAddress,
}: {
  title: string;
  senderAddress: string;
}) => {
  return (
    <p className={classes.senderInfo}>
      {title}: <span className={classes.senderAddress}>{senderAddress}</span>
    </p>
  );
};

const FioDataItem: React.FC<Props> = props => {
  const { fioDataItem, type, onClick } = props;

  const {
    timeStamp: date,
    payeeFioAddress: from,
    payerFioAddress: to,
    status,
  } = fioDataItem;

  const senderInfo = {
    title: CONTENT_TYPE[type].from
      ? CONTENT_TYPE[type].from
      : CONTENT_TYPE[type].to,
    senderAddress: CONTENT_TYPE[type].from ? from : to,
  };

  return (
    <div
      className={classes.badgeContainer}
      onClick={() => onClick(fioDataItem)}
    >
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          <div className={classes.fioDataTypeContainer}>
            <CommonBadge
              isBlue={CONTENT_TYPE[type].isBlue}
              isGreen={CONTENT_TYPE[type].isGreen}
            >
              <div className={classes.iconContainer}>
                <FontAwesomeIcon
                  icon={CONTENT_TYPE[type].icon}
                  className={classes.icon}
                />
              </div>
            </CommonBadge>
            <p className={classes.type}>{type}</p>
          </div>
          <div className={classes.date}>{commonFormatTime(date)}</div>
          {renderSenderInfo(senderInfo)}
          {status && (
            <div className={classes.statusContainer}>
              <FioRequestStatusBadge status={status} />
            </div>
          )}
          <FontAwesomeIcon icon="chevron-right" className={classes.iconArrow} />
        </div>
      </Badge>
    </div>
  );
};

export default FioDataItem;

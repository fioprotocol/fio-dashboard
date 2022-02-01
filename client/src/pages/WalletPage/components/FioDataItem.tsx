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
  fioDataTxType: string;
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
  const { fioDataItem, fioDataTxType, onClick } = props;

  const {
    timeStamp: date,
    payeeFioAddress: from,
    payerFioAddress: to,
    status,
  } = fioDataItem;

  const senderInfo = {
    title: CONTENT_TYPE[fioDataTxType].from
      ? CONTENT_TYPE[fioDataTxType].from
      : CONTENT_TYPE[fioDataTxType].to,
    senderAddress: CONTENT_TYPE[fioDataTxType].from ? from : to,
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
              isBlue={CONTENT_TYPE[fioDataTxType].isBlue}
              isGreen={CONTENT_TYPE[fioDataTxType].isGreen}
            >
              <div className={classes.iconContainer}>
                <FontAwesomeIcon
                  icon={CONTENT_TYPE[fioDataTxType].icon}
                  className={classes.icon}
                />
              </div>
            </CommonBadge>
            <p className={classes.fioDataTxType}>{fioDataTxType}</p>
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

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FioRequestStatusBadge from '../../../components/Badges/FioRequestStatusBadge/FioRequestStatusBadge';

import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import { commonFormatTime } from '../../../util/general';

import { CONTENT_TYPE } from '../constants';

import { TransactionItemProps } from '../types';

import classes from '../styles/TransactionItems.module.scss';

type Props = {
  transactionItem: TransactionItemProps;
  onClick: (transactionItem: TransactionItemProps) => void;
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

const FioTransactionItem: React.FC<Props> = props => {
  const { transactionItem, onClick } = props;

  const { date, from, to, transactionType, status } = transactionItem;

  const senderInfo = {
    title: CONTENT_TYPE[transactionType].from
      ? CONTENT_TYPE[transactionType].from
      : CONTENT_TYPE[transactionType].to,
    senderAddress: CONTENT_TYPE[transactionType].from ? from : to,
  };

  return (
    <div
      className={classes.badgeContainer}
      onClick={() => onClick(transactionItem)}
    >
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          <div className={classes.transactionTypeContainer}>
            <CommonBadge
              isBlue={CONTENT_TYPE[transactionType].isBlue}
              isGreen={CONTENT_TYPE[transactionType].isGreen}
            >
              <div className={classes.iconContainer}>
                <FontAwesomeIcon
                  icon={CONTENT_TYPE[transactionType].icon}
                  className={classes.icon}
                />
              </div>
            </CommonBadge>
            <p className={classes.transactionType}>{transactionType}</p>
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

export default FioTransactionItem;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import CopyToolltip from '../../../components/CopyTooltip';

import apis from '../../../api';
import { copyToClipboard, commonFormatTime } from '../../../util/general';

import { TransactionItemProps } from '../../../types';

import classes from '../styles/TransactionList.module.scss';

const TransactionItem: React.FC<TransactionItemProps> = props => {
  const { txId, nativeAmount, date } = props;

  const onClick = () => {
    copyToClipboard(txId);
  };

  const isReceive = parseInt(nativeAmount, 10) > 0;

  return (
    <div className={classes.badgeContainer}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          <div className={classes.transactionTypeContainer}>
            {isReceive ? (
              <CommonBadge isBlue={true}>
                <div className={classes.iconContainer}>
                  <FontAwesomeIcon icon="arrow-down" className={classes.icon} />
                </div>
              </CommonBadge>
            ) : (
              <CommonBadge isGreen={true}>
                <div className={classes.iconContainer}>
                  <FontAwesomeIcon icon="arrow-up" className={classes.icon} />
                </div>
              </CommonBadge>
            )}
            <p className={classes.transactionType}>
              {isReceive ? 'Received' : 'Sent'}
            </p>
          </div>
          <div className={classes.date}>
            {commonFormatTime(new Date(date * 1000).toISOString())}
          </div>
          <CopyToolltip placement="top">
            <div className={classes.txId} onClick={onClick}>
              {txId}
            </div>
          </CopyToolltip>
          <div className={classes.amount}>
            {`${apis.fio.sufToAmount(parseInt(nativeAmount, 10)).toFixed(2)}`}{' '}
            <span className={classes.currencyCode}>FIO</span>
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default TransactionItem;

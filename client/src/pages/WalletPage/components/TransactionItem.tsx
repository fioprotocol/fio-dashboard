import React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import CopyTooltip from '../../../components/CopyTooltip';
import Amount from '../../../components/common/Amount';

import apis from '../../../api';

import {
  copyToClipboard,
  commonFormatTime,
  truncateTextInMiddle,
} from '../../../util/general';
import MathOp from '../../../util/math';

import { TransactionItemProps } from '../../../types';

import classes from '../styles/TransactionList.module.scss';

const TransactionItem: React.FC<TransactionItemProps> = props => {
  const { txId, nativeAmount, date } = props;

  const onCopyClick = () => {
    copyToClipboard(txId);
  };

  const isReceive = new MathOp(nativeAmount).gt(0);

  return (
    <div className={classes.badgeContainer}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          <div className={classes.dateTypeContainer}>
            <div className={classes.transactionTypeContainer}>
              {isReceive ? (
                <CommonBadge isBlue={true}>
                  <div className={classes.iconContainer}>
                    <ArrowDownwardIcon className={classes.icon} />
                  </div>
                </CommonBadge>
              ) : (
                <CommonBadge isGreen={true}>
                  <div className={classes.iconContainer}>
                    <ArrowUpwardIcon className={classes.icon} />
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
          </div>
          <div className={classes.txContainer}>
            <p className={classes.title}>ID: </p>
            <p className={classes.txId}>{truncateTextInMiddle(txId)}</p>
            <CopyTooltip placement="top">
              <ContentCopyIcon
                onClick={onCopyClick}
                className={classes.actionButton}
              />
            </CopyTooltip>
            <a
              href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${txId}`}
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon
                className={classes.actionButton}
                onClick={onCopyClick}
              />
            </a>
          </div>
          <div className={classes.amount}>
            <Amount value={apis.fio.sufToAmount(nativeAmount || 0)} />
            &nbsp;<span className={classes.currencyCode}>FIO</span>
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default TransactionItem;

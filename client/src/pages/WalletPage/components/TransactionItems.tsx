import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import Loader from '../../../components/Loader/Loader';

import { commonFormatTime } from '../../../util/general';

import { INFO_BADGE_CONTENT, CONTENT_TYPE, STATUS_TYPES } from '../constants';

import { TransactionItemProps } from '../types';

import classes from '../styles/TransactionItems.module.scss';

type Props = {
  transactionsList: TransactionItemProps[];
  type: string;
  loading: boolean;
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

const TransactionItems: React.FC<Props> = props => {
  const { transactionsList, type, loading } = props;

  if (loading)
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );

  if (transactionsList.length === 0 && !loading)
    return (
      <InfoBadge
        title={`No ${INFO_BADGE_CONTENT[type].title} Transactions`}
        message={`There are no ${INFO_BADGE_CONTENT[type].message} transactions for this wallet`}
      />
    );

  const onClick = (id: string) => {
    // todo: set open modal info
  };

  return (
    <div className={classes.container}>
      {transactionsList.map(transactionItem => {
        const { id, date, from, to, transactionType, status } = transactionItem;

        const senderInfo = {
          title: CONTENT_TYPE[transactionType].from
            ? CONTENT_TYPE[transactionType].from
            : CONTENT_TYPE[transactionType].to,
          senderAddress: CONTENT_TYPE[transactionType].from ? from : to,
        };

        const statusProps = {
          isBlue: STATUS_TYPES.PAID === status,
          isOrange: STATUS_TYPES.REJECTED === status,
          isRose: STATUS_TYPES.PENDING === status,
        };

        return (
          <div className={classes.badgeContainer} key={id}>
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
                    <CommonBadge {...statusProps}>
                      <p className={classes.status}>{status}</p>
                    </CommonBadge>
                  </div>
                )}
                <FontAwesomeIcon
                  icon="chevron-right"
                  className={classes.iconArrow}
                  onClick={() => onClick(id)}
                />
              </div>
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionItems;

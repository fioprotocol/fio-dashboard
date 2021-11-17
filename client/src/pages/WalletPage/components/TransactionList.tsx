import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import CopyToolltip from '../../../components/CopyTooltip';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

import { copyToClipboard } from '../../../util/general';

import apis from '../../../api';

import { checkTransactions } from '../../../util/transactions';
import { FioWalletDoublet, TransactionItem } from '../../../types';

import classes from '../styles/TransactionList.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
};

const TransactionItemRow = (trx: TransactionItem) => {
  const { txId, nativeAmount, date } = trx;
  const onClick = () => {
    copyToClipboard(txId);
  };

  const isReceive = parseInt(nativeAmount) > 0;

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
            {new Date(date * 1000).toLocaleDateString('en-US')}
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

const TransactionList: React.FC<Props> = props => {
  const { fioWallet } = props;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const getTransactions = async () => {
    setLoading(true);
    try {
      const transactions = await checkTransactions(fioWallet.publicKey);
      setList(transactions);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTransactions();
  }, []);
  return (
    <div className={classes.container}>
      <h4 className={classes.title}>Recent transactions</h4>
      {loading && (
        <div className={classes.loader}>
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      )}
      {list.length === 0 && !loading ? (
        <div className={classes.infoBadge}>
          <InfoBadge
            title="No Transactions"
            message="You have no transactions to display at this time."
          />
        </div>
      ) : (
        list.map((item: TransactionItem) => (
          <TransactionItemRow key={item.txId} {...item} />
        ))
      )}
    </div>
  );
};

export default TransactionList;

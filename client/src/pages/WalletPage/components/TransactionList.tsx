import React, { useEffect, useState } from 'react';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import TransactionItem from './TransactionItem';
import Loader from '../../../components/Loader/Loader';

import { checkTransactions } from '../../../util/transactions';
import { FioWalletDoublet, TransactionItemProps } from '../../../types';

import classes from '../styles/TransactionList.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
};

const TransactionList: React.FC<Props> = props => {
  const { fioWallet } = props;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<TransactionItemProps[] | null>(null);

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

  if (loading)
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );

  if (!list)
    return (
      <div className={classes.infoBadge}>
        <InfoBadge
          title="No Transactions"
          message="You have no transactions to display at this time."
        />
      </div>
    );

  return (
    <div className={classes.container}>
      {list.map(item => (
        <TransactionItem key={item.txId} {...item} />
      ))}
    </div>
  );
};

export default TransactionList;

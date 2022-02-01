import React, { useEffect, useState, useRef } from 'react';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import TransactionItem from './TransactionItem';
import Loader from '../../../components/Loader/Loader';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';

import { checkTransactions } from '../../../util/transactions';
import { FioWalletDoublet, TransactionItemProps } from '../../../types';

import classes from '../styles/TransactionList.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
};

const MIN_VISIBLE_TRANSACTIONS_COUNT = 20;
const MARGIN_BETWEEN_ITEMS = 10;

const TransactionList: React.FC<Props> = props => {
  const { fioWallet } = props;
  const [loading, setLoading] = useState(false);
  const [transactionList, setTransactionList] = useState<
    TransactionItemProps[] | null
  >(null);
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState(
    MIN_VISIBLE_TRANSACTIONS_COUNT,
  );
  const [height, setHeight] = useState(0);

  const elementRef = useRef(null);

  useEffect(() => {
    setHeight(elementRef?.current?.clientHeight);
  }, []);

  const getTransactions = async () => {
    setLoading(true);
    try {
      const transactions = await checkTransactions(fioWallet.publicKey);
      setTransactionList(transactions);
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

  if (!transactionList)
    return (
      <div className={classes.infoBadge}>
        <InfoBadge
          title="No Transactions"
          message="You have no transactions to display at this time."
        />
      </div>
    );

  const loadMore = () => {
    setVisibleTransactionsCount(
      visibleTransactionsCount + MIN_VISIBLE_TRANSACTIONS_COUNT,
    );
  };

  const hasNextPage = visibleTransactionsCount < transactionList.length;

  return (
    <div className={classes.container}>
      <InfiniteScroll
        loading={loading}
        hasNextPage={hasNextPage}
        isContentScrollable={
          transactionList.length > MIN_VISIBLE_TRANSACTIONS_COUNT
        }
        onLoadMore={loadMore}
        maxHeight={
          (height + MARGIN_BETWEEN_ITEMS) * MIN_VISIBLE_TRANSACTIONS_COUNT
        }
      >
        {transactionList
          .slice(
            0,
            !hasNextPage ? transactionList.length : visibleTransactionsCount,
          )
          .map(item => (
            <div ref={elementRef} key={item.txId}>
              <TransactionItem {...item} />
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default TransactionList;

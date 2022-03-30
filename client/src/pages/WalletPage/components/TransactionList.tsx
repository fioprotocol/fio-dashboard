import React, { useEffect, useState, useRef } from 'react';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import TransactionItem from './TransactionItem';
import Loader from '../../../components/Loader/Loader';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';

import {
  FioWalletDoublet,
  FioWalletTxHistory,
  TransactionItemProps,
} from '../../../types';

import classes from '../styles/TransactionList.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
  walletTxHistory: FioWalletTxHistory;
};

const MIN_VISIBLE_TRANSACTIONS_COUNT = 20;
const MARGIN_BETWEEN_ITEMS = 10;

const TransactionList: React.FC<Props> = props => {
  const { walletTxHistory = { highestTxHeight: -1, txs: [] } } = props;
  const transactionList: TransactionItemProps[] = walletTxHistory
    ? walletTxHistory.txs
    : [];
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState(
    MIN_VISIBLE_TRANSACTIONS_COUNT,
  );
  const [height, setHeight] = useState<number>(0);

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeight(elementRef?.current?.clientHeight || 0);
  }, []);

  // when no history fetched yet
  if (
    typeof walletTxHistory.highestTxHeight === 'undefined' ||
    walletTxHistory.highestTxHeight < 0
  )
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );

  if (!transactionList || !transactionList.length)
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
        loading={false}
        hasNextPage={hasNextPage}
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

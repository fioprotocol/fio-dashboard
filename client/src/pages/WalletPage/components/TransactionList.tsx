import React from 'react';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import TransactionItem from './TransactionItem';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';

import { TransactionItemProps } from '../../../types';

import classes from '../styles/TransactionList.module.scss';

type Props = {
  transactions: TransactionItemProps[];
  transactionsLoading: boolean;
  transactionsHasNextPage: boolean;
  loadMoreTransactions: () => void;
};

const TransactionList: React.FC<Props> = ({
  transactions,
  transactionsLoading,
  transactionsHasNextPage,
  loadMoreTransactions,
}) => {
  if ((!transactions || !transactions.length) && !transactionsLoading)
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
      <InfiniteScroll
        loading={transactionsLoading}
        hasNextPage={transactionsHasNextPage}
        onLoadMore={loadMoreTransactions}
      >
        {transactions?.map(item => (
          <div key={item.txId}>
            <TransactionItem {...item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default TransactionList;

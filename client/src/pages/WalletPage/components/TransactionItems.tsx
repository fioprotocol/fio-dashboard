import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

import Loader from '../../../components/Loader/Loader';
import TransactionDetailedModal from './TransactionDetailedModal';
import TransactionDetailedTabs from './TransactionDetailedTabs';
import FioDataDetails from './FioDataDetails';
import FioTransactionItem from './FioTransactionItem';
import DecryptContentEdge from './DecryptContentEdge';

import {
  INFO_BADGE_CONTENT,
  TRANSACTION_ITEM_TYPES,
  FIO_REQUEST_FIELDS_LIST,
} from '../constants';

import { WALLET_CREATED_FROM } from '../../../constants/common';

import { TransactionItemProps } from '../types';
import { FioRequestData, FioWalletDoublet } from '../../../types';

import classes from '../styles/TransactionItems.module.scss';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';

type Props = {
  transactionsList: FioRequestData[];
  type: string;
  transactionType: string;
  loading: boolean;
  fioWallet: FioWalletDoublet;
};

type DetailedItemProps = {
  transactionItem: TransactionItemProps;
  type: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

type Location = {
  location: {
    state: {
      transactionItem: TransactionItemProps;
    };
  };
};

const FIO_REQUEST_DETAILED_COMPONENT = {
  [TRANSACTION_ITEM_TYPES.SENT]: (props: DetailedItemProps) => (
    <TransactionDetailedTabs
      {...props}
      requestFieldsList={FIO_REQUEST_FIELDS_LIST.SENT_LIST}
    />
  ),
  [TRANSACTION_ITEM_TYPES.RECEIVED]: (props: DetailedItemProps) => (
    <TransactionDetailedTabs
      {...props}
      requestFieldsList={FIO_REQUEST_FIELDS_LIST.RECEIVED_LIST}
    />
  ),
  [TRANSACTION_ITEM_TYPES.DATA]: (props: DetailedItemProps) => (
    <FioDataDetails {...props} />
  ),
};

const MIN_VISIBLE_TRANSACTIONS_COUNT = 20;

const TransactionItems: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    transactionsList,
    type,
    loading,
    fioWallet,
    transactionType,
    location: { state },
  } = props;

  const [showModal, toggleModal] = useState(false);
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState(
    MIN_VISIBLE_TRANSACTIONS_COUNT,
  );
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<FioRequestData | null>(null);
  const [
    transactionDetailsItem,
    setTxDetails,
  ] = useState<TransactionItemProps | null>(null);
  const { transactionItem } = state || {};

  useEffect(() => {
    if (transactionItem && transactionItem.transactionType === type) {
      setTxDetails(transactionItem);
      toggleModal(true);
    }
  }, [JSON.stringify(transactionItem)]);

  useEffect(() => {
    return () => setTxDetails(null);
  }, []);

  if (loading)
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );

  if ((!transactionsList || transactionsList.length === 0) && !loading)
    return (
      <InfoBadge
        title={`No ${INFO_BADGE_CONTENT[type].title} Transactions`}
        message={`There are no ${INFO_BADGE_CONTENT[type].message} transactions for this wallet`}
      />
    );

  const onClick = (txItem: FioRequestData) => {
    setSubmitData(txItem);
  };

  const onCloseModal = () => {
    toggleModal(false);
    setSubmitData(null);
  };

  const onSuccess = (txData: any) => {
    setProcessing(false);
    setSubmitData(null);
    setTxDetails(txData);
    toggleModal(true);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const loadMore = () => {
    setVisibleTransactionsCount(
      visibleTransactionsCount + MIN_VISIBLE_TRANSACTIONS_COUNT,
    );
  };

  return (
    <div className={classes.container}>
      <InfiniteScroll
        loading={loading}
        hasNextPage={visibleTransactionsCount < transactionsList.length}
        isContentScrollable={
          transactionsList.length > MIN_VISIBLE_TRANSACTIONS_COUNT
        }
        onLoadMore={loadMore}
      >
        {transactionsList
          .slice(
            0,
            visibleTransactionsCount > transactionsList.length
              ? transactionsList.length
              : visibleTransactionsCount,
          )
          .map(trxItem => (
            <FioTransactionItem
              transactionItem={trxItem}
              transactionType={transactionType}
              onClick={onClick}
              key={trxItem.fioRequestId}
            />
          ))}
      </InfiniteScroll>
      <TransactionDetailedModal
        show={showModal}
        onClose={onCloseModal}
        status={transactionDetailsItem && transactionDetailsItem.status}
      >
        {FIO_REQUEST_DETAILED_COMPONENT[type]({
          transactionItem: transactionDetailsItem,
          type,
          fioWallet,
          onCloseModal,
        })}
      </TransactionDetailedModal>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <DecryptContentEdge
          fioWallet={fioWallet}
          onSuccess={onSuccess}
          onCancel={onCancel}
          processing={processing}
          setProcessing={setProcessing}
          submitData={submitData}
        />
      ) : null}
    </div>
  );
};

export default withRouter(TransactionItems);

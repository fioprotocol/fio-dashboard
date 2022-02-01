import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import Loader from '../../../components/Loader/Loader';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import FioDataDetailedModal from './FioDataDetailedModal';
import FioDataDetailedTabs from './FioDataDetailedTabs';
import FioObtDataDetails from './FioObtDataDetails';
import FioDataItem from './FioDataItem';
import DecryptContentEdge from './DecryptContentEdge';

import {
  INFO_BADGE_CONTENT,
  FIO_DATA_TX_ITEM_TYPES,
  FIO_REQUEST_FIELDS_LIST,
} from '../constants';
import { WALLET_CREATED_FROM } from '../../../constants/common';

import { FioRequestData, FioWalletDoublet } from '../../../types';
import { FioDataItemProps } from '../types';

import classes from '../styles/FioDataItem.module.scss';

type Props = {
  fioDataList: FioRequestData[];
  type: string;
  loading: boolean;
  fioWallet: FioWalletDoublet;
};

type DetailedItemProps = {
  fioDataItem: FioDataItemProps;
  type: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

type Location = {
  location: {
    state: {
      fioDataItem: FioDataItemProps;
      fioRequestTab: string;
    };
  };
};

const FIO_REQUEST_DETAILED_COMPONENT = {
  [FIO_DATA_TX_ITEM_TYPES.SENT]: (props: DetailedItemProps) => (
    <FioDataDetailedTabs
      {...props}
      requestFieldsList={FIO_REQUEST_FIELDS_LIST.SENT_LIST}
    />
  ),
  [FIO_DATA_TX_ITEM_TYPES.RECEIVED]: (props: DetailedItemProps) => (
    <FioDataDetailedTabs
      {...props}
      requestFieldsList={FIO_REQUEST_FIELDS_LIST.RECEIVED_LIST}
    />
  ),
  [FIO_DATA_TX_ITEM_TYPES.DATA]: (props: DetailedItemProps) => (
    <FioObtDataDetails {...props} />
  ),
};

const MIN_VISIBLE_TRANSACTIONS_COUNT = 20;

const FioDataList: React.FC<Props & RouteComponentProps & Location> = props => {
  const {
    fioDataList,
    type,
    loading,
    fioWallet,
    location: { state },
  } = props;

  const [showModal, toggleModal] = useState(false);
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState(
    MIN_VISIBLE_TRANSACTIONS_COUNT,
  );
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<FioRequestData | null>(null);
  const [
    fioDataDetailsItem,
    setFioDataDetailsItem,
  ] = useState<FioDataItemProps | null>(null);
  const { fioDataItem, fioRequestTab } = state || {};

  useEffect(() => {
    if (fioDataItem && fioRequestTab === type) {
      setFioDataDetailsItem(fioDataItem);
      toggleModal(true);
    }
  }, [JSON.stringify(fioDataItem)]);

  useEffect(() => {
    return () => setFioDataDetailsItem(null);
  }, []);

  if (loading)
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );

  if ((!fioDataList || fioDataList.length === 0) && !loading)
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
    setFioDataDetailsItem(txData);
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
        hasNextPage={visibleTransactionsCount < fioDataList.length}
        isContentScrollable={
          fioDataList.length > MIN_VISIBLE_TRANSACTIONS_COUNT
        }
        onLoadMore={loadMore}
      >
        {fioDataList
          .slice(
            0,
            visibleTransactionsCount > fioDataList.length
              ? fioDataList.length
              : visibleTransactionsCount,
          )
          .map(trxItem => (
            <FioDataItem
              fioDataItem={trxItem}
              type={type}
              onClick={onClick}
              key={trxItem.fioRequestId}
            />
          ))}
      </InfiniteScroll>
      <FioDataDetailedModal
        show={showModal}
        onClose={onCloseModal}
        status={fioDataDetailsItem && fioDataDetailsItem.status}
      >
        {FIO_REQUEST_DETAILED_COMPONENT[type]({
          fioDataItem: fioDataDetailsItem,
          type,
          fioWallet,
          onCloseModal,
        })}
      </FioDataDetailedModal>
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

export default withRouter(FioDataList);

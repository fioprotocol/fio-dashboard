import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import Loader from '../../../components/Loader/Loader';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import FioRecordDetailedModal from './FioRecordDetailedModal';
import FioRecordDetailedTabs from './FioRecordDetailedTabs';
import FioObtDataDetails from './FioObtDataDetails';
import FioRecordItem from './FioRecordItem';
import DecryptContentEdge from './DecryptContentEdge';

import { transformFioRecord } from '../util';

import {
  INFO_BADGE_CONTENT,
  FIO_REQUEST_FIELDS_LIST,
  FIO_RECORD_TYPES,
} from '../constants';
import { WALLET_CREATED_FROM } from '../../../constants/common';

import {
  FioRecord,
  FioWalletDoublet,
  FioDecryptedRecordData,
} from '../../../types';
import { FioRecordViewDecrypted } from '../types';

import classes from '../styles/FioRecordItem.module.scss';

type Props = {
  fioDataList: FioRecord[];
  paymentDataList?: FioRecord[];
  fioRecordType: string;
  loading: boolean;
  fioWallet: FioWalletDoublet;
};

type DetailedItemProps = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordPaymentDataDecrypted: FioRecordViewDecrypted;
  fioRecordType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

type Location = {
  location: {
    state: {
      fioRecordDecrypted: FioRecordViewDecrypted;
      fioRequestTab: string;
    };
  };
};

const FIO_REQUEST_DETAILED_COMPONENT = {
  [FIO_RECORD_TYPES.SENT]: (props: DetailedItemProps) => (
    <FioRecordDetailedTabs
      {...props}
      requestFieldsList={FIO_REQUEST_FIELDS_LIST.SENT_LIST}
    />
  ),
  [FIO_RECORD_TYPES.RECEIVED]: (props: DetailedItemProps) => (
    <FioRecordDetailedTabs
      {...props}
      requestFieldsList={FIO_REQUEST_FIELDS_LIST.RECEIVED_LIST}
    />
  ),
  [FIO_RECORD_TYPES.DATA]: (props: DetailedItemProps) => (
    <FioObtDataDetails {...props} />
  ),
};

const MIN_VISIBLE_TRANSACTIONS_COUNT = 20;

const FioRecordsList: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    fioDataList,
    fioRecordType,
    loading,
    fioWallet,
    paymentDataList,
    location: { state },
  } = props;

  const [showModal, toggleModal] = useState(false);
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState(
    MIN_VISIBLE_TRANSACTIONS_COUNT,
  );
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    itemData: FioRecord;
    paymentOtbData: FioRecord | null;
    fioRecordType: string;
  } | null>(null);
  const [
    fioRecordDetailedItem,
    setFioRecordDetailedItem,
  ] = useState<FioRecordViewDecrypted | null>(null);
  const [
    fioRecordDetailedItemPaymentData,
    setFioRecordDetailedItemPaymentData,
  ] = useState<FioRecordViewDecrypted | null>(null);
  const { fioRecordDecrypted, fioRequestTab } = state || {};

  useEffect(() => {
    if (fioRecordDecrypted && fioRequestTab === fioRecordType) {
      setFioRecordDetailedItem(fioRecordDecrypted);
      toggleModal(true);
    }
  }, [JSON.stringify(fioRecordDecrypted)]);

  useEffect(() => {
    return () => setFioRecordDetailedItem(null);
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
        title={`No ${INFO_BADGE_CONTENT[fioRecordType].title} Transactions`}
        message={`There are no ${INFO_BADGE_CONTENT[fioRecordType].message} transactions for this wallet`}
      />
    );

  const onItemClick = (fioRecordItem: FioRecord) => {
    const paymentOtbData = paymentDataList?.filter(
      pd => pd.fioRequestId === fioRecordItem.fioRequestId,
    );

    setSubmitData({
      itemData: fioRecordItem,
      paymentOtbData: paymentOtbData?.length ? paymentOtbData[0] : null,
      fioRecordType,
    });
  };

  const onCloseModal = () => {
    toggleModal(false);
    setSubmitData(null);
  };

  const onSuccess = (fioRecordItemDecrypted: FioDecryptedRecordData) => {
    const { itemData, paymentOtbData } = fioRecordItemDecrypted;
    setProcessing(false);
    setSubmitData(null);
    const transformedFioRecordItem = transformFioRecord({
      fioRecordItem: itemData,
      publicKey: fioWallet.publicKey,
      fioRecordType,
    });

    if (paymentOtbData) {
      setFioRecordDetailedItemPaymentData(
        transformFioRecord({
          fioRecordItem: paymentOtbData,
          publicKey: fioWallet.publicKey,
          fioRecordType: FIO_RECORD_TYPES.DATA,
        }),
      );
    }

    setFioRecordDetailedItem(transformedFioRecordItem);
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

  const hasNextPage = visibleTransactionsCount < fioDataList.length;

  return (
    <div className={classes.container}>
      <InfiniteScroll
        loading={loading}
        hasNextPage={hasNextPage}
        onLoadMore={loadMore}
      >
        {fioDataList
          .slice(
            0,
            !hasNextPage ? fioDataList.length : visibleTransactionsCount,
          )
          .map(trxItem => (
            <FioRecordItem
              fioRecord={trxItem}
              fioRecordType={fioRecordType}
              publicKey={fioWallet.publicKey}
              onClick={onItemClick}
              key={trxItem.fioRequestId + trxItem.timeStamp}
            />
          ))}
      </InfiniteScroll>
      <FioRecordDetailedModal
        show={showModal}
        onClose={onCloseModal}
        status={fioRecordDetailedItem?.fioRecord.status}
      >
        {FIO_REQUEST_DETAILED_COMPONENT[fioRecordType]({
          fioRecordDecrypted: fioRecordDetailedItem,
          fioRecordPaymentDataDecrypted: fioRecordDetailedItemPaymentData,
          fioRecordType,
          fioWallet,
          onCloseModal,
        })}
      </FioRecordDetailedModal>
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

export default withRouter(FioRecordsList);

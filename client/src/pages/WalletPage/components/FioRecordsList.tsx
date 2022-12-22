import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import Loader from '../../../components/Loader/Loader';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import FioRecordDetailedModal from './FioRecordDetailedModal';
import FioRecordDetailedTabs from './FioRecordDetailedTabs';
import FioObtDataDetails from './FioObtDataDetails';
import FioRecordItem from './FioRecordItem';
import WalletAction from '../../../components/WalletAction/WalletAction';
import DecryptContentEdge from './DecryptContentEdge';
import DecryptContentLedger from './DecryptContentLedger';
import { FioTokensReceive } from '../../../components/FioTokensReceive';

import { transformFioRecord } from '../util';

import { FIO_REQUEST_FIELDS_LIST, FIO_RECORD_TYPES } from '../constants';
import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import {
  FioRecord,
  FioWalletDoublet,
  FioDecryptedRecordData,
  FioAddressDoublet,
} from '../../../types';
import { FioRecordViewDecrypted } from '../types';

import classes from '../styles/FioRecordItem.module.scss';

type Props = {
  fioDataList: FioRecord[];
  paymentDataList?: FioRecord[];
  fioRecordType: string;
  loading: boolean;
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
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

const FioRecordsList: React.FC<Props> = props => {
  const {
    fioDataList,
    fioRecordType,
    loading,
    fioWallet,
    fioCryptoHandles,
    paymentDataList,
  } = props;

  const {
    location: { state },
  }: Location = useHistory();
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
      <FioTokensReceive
        fioWallet={fioWallet}
        fioCryptoHandles={fioCryptoHandles}
        subtitle="We see that you do not have any FIO tokens in your wallet."
        noVerticalMargin
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
      <WalletAction
        fioWallet={fioWallet}
        processing={processing}
        submitData={submitData}
        action={CONFIRM_PIN_ACTIONS.DETAILED_FIO_REQUEST}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        FioActionWallet={DecryptContentEdge}
        LedgerActionWallet={DecryptContentLedger}
      />
    </div>
  );
};

export default FioRecordsList;

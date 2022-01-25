import React, { useState } from 'react';

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
import { FioWalletDoublet } from '../../../types';

import classes from '../styles/TransactionItems.module.scss';

type Props = {
  transactionsList: TransactionItemProps[];
  type: string;
  loading: boolean;
  fioWallet: FioWalletDoublet;
};

type DetailedItemProps = {
  transactionItem: TransactionItemProps;
  type: string;
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

const TransactionItems: React.FC<Props> = props => {
  const { transactionsList, type, loading, fioWallet } = props;
  const [showModal, toggleModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<TransactionItemProps | null>(
    null,
  );
  const [
    transactionDetailsItem,
    setTxDetails,
  ] = useState<TransactionItemProps | null>(null);

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

  const onClick = (transactionItem: TransactionItemProps) => {
    setSubmitData(transactionItem);
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

  return (
    <div className={classes.container}>
      {transactionsList.map(transactionItem => (
        <FioTransactionItem
          transactionItem={transactionItem}
          onClick={onClick}
          key={transactionItem.id}
        />
      ))}
      <TransactionDetailedModal
        show={showModal}
        onClose={onCloseModal}
        status={transactionDetailsItem && transactionDetailsItem.status}
      >
        {FIO_REQUEST_DETAILED_COMPONENT[type]({
          transactionItem: transactionDetailsItem,
          type,
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

export default TransactionItems;

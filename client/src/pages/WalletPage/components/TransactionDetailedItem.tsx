import React from 'react';

import TransactionActionButtons from './TransactionActionButtons';
import TransactionFieldsList from './TransactionFieldsList';

import { TRANSACTION_ITEM_TYPES } from '../constants';
import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';

import { TransactionItemProps, TransactionItemKeysProps } from '../types';
import { FioWalletDoublet } from '../../../types';

import classes from '../styles/TransactionDetailedItem.module.scss';

type Props = {
  fieldsList: TransactionItemKeysProps[];
  transactionItem: TransactionItemProps;
  type: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const TransactionDetailedItem: React.FC<Props> = props => {
  const { fieldsList, transactionItem, type, fioWallet, onCloseModal } = props;

  if (!transactionItem) return null;

  return (
    <div className={classes.fieldsContainer}>
      <TransactionFieldsList
        fieldsList={fieldsList}
        transactionItem={transactionItem}
      />
      {transactionItem.status === FIO_REQUEST_STATUS_TYPES.PENDING &&
        type === TRANSACTION_ITEM_TYPES.RECEIVED && (
          <TransactionActionButtons
            fioRequest={transactionItem}
            fioWallet={fioWallet}
            onCloseModal={onCloseModal}
          />
        )}
    </div>
  );
};

export default TransactionDetailedItem;

import React from 'react';

import FioDataDetailedActionButtons from './FioDataDetailedActionButtons';
import FioDataFieldsList from './FioDataFieldsList';

import { FIO_DATA_TX_ITEM_TYPES } from '../constants';
import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';

import { FioDataItemProps, FioDataItemKeysProps } from '../types';
import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioDataDetailedItem.module.scss';

type Props = {
  fieldsList: FioDataItemKeysProps[];
  fioDataItem: FioDataItemProps;
  type: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioDataDetailedItem: React.FC<Props> = props => {
  const { fieldsList, fioDataItem, type, fioWallet, onCloseModal } = props;

  if (!fioDataItem) return null;

  return (
    <div className={classes.fieldsContainer}>
      <FioDataFieldsList fieldsList={fieldsList} fioDataItem={fioDataItem} />
      {fioDataItem.status === FIO_REQUEST_STATUS_TYPES.PENDING &&
        type === FIO_DATA_TX_ITEM_TYPES.RECEIVED && (
          <FioDataDetailedActionButtons
            fioRequest={fioDataItem}
            fioWallet={fioWallet}
            type={type}
            onCloseModal={onCloseModal}
          />
        )}
    </div>
  );
};

export default FioDataDetailedItem;

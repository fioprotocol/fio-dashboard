import React from 'react';

import FioDataDetailedItem from './FioDataDetailedItem';

import { FIO_REQUEST_FIELDS_LIST } from '../constants';

import { FioDataItemProps } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioDataDetailedModal.module.scss';

type Props = {
  fioDataItem: FioDataItemProps;
  type: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioDataDetails: React.FC<Props> = props => {
  return (
    <>
      <h5 className={classes.subtitle}>Request Information</h5>
      <FioDataDetailedItem
        fieldsList={FIO_REQUEST_FIELDS_LIST.DATA_LIST}
        {...props}
      />
    </>
  );
};

export default FioDataDetails;

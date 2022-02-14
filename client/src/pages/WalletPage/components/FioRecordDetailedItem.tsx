import React, { useEffect, useState } from 'react';

import FioRecordDetailedAcctionButtons from './FioRecordDetailedAcctionButtons';
import FioRecordFieldsList from './FioRecordFieldsList';

import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';
import { FIO_RECORD_TYPES } from '../../WalletPage/constants';

import { FioRecordViewKeysProps, FioRecordViewDecrypted } from '../types';
import { FioAddressDoublet, FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedItem.module.scss';
import { useFioAddresses } from '../../../util/hooks';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

type Props = {
  fieldsList: FioRecordViewKeysProps[];
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordType: string;
  fioRecordDetailedType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioRecordDetailedItem: React.FC<Props> = props => {
  const {
    fieldsList,
    fioRecordDecrypted,
    fioRecordType,
    fioWallet,
    fioRecordDetailedType,
    onCloseModal,
  } = props;

  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const walletFioAddresses = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  ).sort((fioAddress1: FioAddressDoublet, fioAddress2: FioAddressDoublet) =>
    fioAddress1.name > fioAddress2.name ? 1 : -1,
  );

  useEffect(() => {
    if (fioRecordDecrypted?.fioRecord?.to) {
      const address = walletFioAddresses.find(
        ({ name }) => name === fioRecordDecrypted.fioRecord.to,
      );
      setSelectedAddress(address);
      setError(
        !address
          ? 'This Fio Crypto Handle no longer exists in current wallet.'
          : null,
      );
    }
  }, [fioRecordDecrypted, walletFioAddresses]);

  if (!fioRecordDecrypted) return null;

  const renderActionButtons = () =>
    !!selectedAddress &&
    fioRecordDecrypted.fioRecord.status === FIO_REQUEST_STATUS_TYPES.PENDING &&
    fioRecordType === FIO_RECORD_TYPES.RECEIVED && (
      <FioRecordDetailedAcctionButtons
        fioRecordDecrypted={fioRecordDecrypted}
        fioWallet={fioWallet}
        fioRecordType={fioRecordType}
        onCloseModal={onCloseModal}
      />
    );
  return (
    <div className={classes.fieldsContainer}>
      <FioRecordFieldsList
        fieldsList={fieldsList}
        fioRecordDecrypted={fioRecordDecrypted}
        fioRecordDetailedType={fioRecordDetailedType}
        fioRecordType={fioRecordType}
      />
      {error &&
        fioRecordDecrypted.fioRecord.status ===
          FIO_REQUEST_STATUS_TYPES.PENDING &&
        fioRecordType === FIO_RECORD_TYPES.RECEIVED &&
        fioRecordDecrypted?.fioRecord?.to && (
          <div className={classes.infoBadge}>
            <InfoBadge
              isOrange
              message={error}
              title={`${fioRecordDecrypted.fioRecord.to}`}
            />
          </div>
        )}
      {renderActionButtons()}
    </div>
  );
};

export default FioRecordDetailedItem;
